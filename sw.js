let cdn = {
    unpkg: 'https://unpkg.com',
    max: 'https://maxcdn.bootstrapcdn.com'
}

let vendor = {
    bootstrap: 'https://unpkg.com/bootstrap@4.0.0-alpha.2',
    fontAwesome: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3',
    raven: 'https://unpkg.com/raven-js@3.7.0'
};

let URLS = {
    app: [
        './',
        './index.html',
        './manifest.json',
        './views/products/create.html',
        './views/sales/create.html',
        './views/expenses/create.html',
        './views/products/edit.html',
        './views/sales/edit.html',
        './views/expenses/edit.html',
        './views/products/index.html',
        './views/sales/index.html',
        './views/expenses/index.html',
        './views/products/create.js',
        './views/sales/create.js',
        './views/expenses/create.js',
        './views/products/edit.js',
        './views/sales/edit.js',
        './views/expenses/edit.js',
        './views/products/index.js',
        './views/sales/index.js',
        './views/expenses/index.js',
        './img/expense.jpg',
        './img/sale.jpg',
        './img/report.jpg',
        './icons/icono16x16.png',
        './icons/icono32x32.png',
        './icons/icono64x64.png',
        './icons/icono128x128.png',
        './icons/icono192x192.png',
        './icons/icono256x256.png',
        './icons/icono384x384.png',
        './icons/icono512x512.png'
    ],
    vendor: [
        `${vendor.bootstrap}/dist/css/bootstrap.min.css`,
        `${vendor.fontAwesome}/css/font-awesome.min.css`,
        `${vendor.fontAwesome}/fonts/fontawesome-webfont.woff2`, // browsers that support sw support woff2
        `${vendor.raven}/dist/raven.min.js`
    ]
}

let CACHE_NAMES = {
    app: 'app-cache-v5',
    vendor: 'vendor-cache-v5'
};

function isVendor(url) {
    return url.startsWith(cdn.unpkg) || url.startsWith(cdn.max);
}

function cacheAll(cacheName, urls) {
    return caches.open(cacheName).then((cache) => cache.addAll(urls));
}

function addToCache(cacheName, request, response) {
    if (response.ok) {
        let clone = response.clone()
        caches.open(cacheName).then((cache) => cache.put(request, clone));
    }
    return response;
}

function lookupCache(request) {
    return caches.match(request).then(function (cachedResponse) {
        if (!cachedResponse) {
            throw Error(`${request.url} not found in cache`);
        }
        return cachedResponse;
    });
}

function fetchThenCache(request, cacheName) {
    let fetchRequest = fetch(request);
    // add to cache, but don't block resolve of this promise on caching
    fetchRequest.then((response) => addToCache(cacheName, request, response));
    return fetchRequest;
}

function raceRequest(request, cacheName) {
    let attempts = [
        fetchThenCache(request, cacheName),
        lookupCache(request)
    ];
    return new Promise(function (resolve, reject) {
        // resolve this promise once one resolves
        attempts.forEach((attempt) => attempt.then(resolve));
        // reject if all promises reject
        attempts.reduce((verdict, attempt) => verdict.catch(() => attempt))
            .catch(() => reject(Error('Unable to resolve request from network or cache.')));
    })
}

function cleanupCache() {
    let validKeys = Object.keys(CACHE_NAMES).map((key) => CACHE_NAMES[key]);
    return caches.keys().then((localKeys) => Promise.all(
        localKeys.map((key) => {
            if (validKeys.indexOf(key) === -1) { // key no longer in our list
                return caches.delete(key);
            }
        })
    ));
}

self.addEventListener('install', function (evt) {
    let cachingCompleted = Promise.all([
        cacheAll(CACHE_NAMES.app, URLS.app),
        cacheAll(CACHE_NAMES.vendor, URLS.vendor)
    ]).then(() => self.skipWaiting())

    evt.waitUntil(cachingCompleted);
});

self.addEventListener('activate', function (evt) {
    evt.waitUntil(Promise.all([
        cleanupCache(),
        self.clients.claim() // claim immediately so the page can be controlled by the sw immediately
    ]));
});

self.addEventListener('fetch', function (evt) {
    let request = evt.request;
    let response;

    // only handle GET requests
    if (request.method !== 'GET') return;

    if (isVendor(request.url)) {
        // vendor requests: check cache first, fallback to fetch
        response = lookupCache(request)
            .catch(() => fetchThenCache(request, CACHE_NAMES.vendor));
    } else {
        // app request: race cache/fetch (bonus: update in background)
        response = raceRequest(request, CACHE_NAMES.app);
    }
    evt.respondWith(response);
});