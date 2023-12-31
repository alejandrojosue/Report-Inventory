class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.db = null;
    }

    async openConnection() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event) => {
                reject("Error opening database");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                let store
                // Define object stores here
                if (!db.objectStoreNames.contains('products')) {
                    store = db.createObjectStore('products', { keyPath: 'id' });
                    store.createIndex('seekName', 'name', { unique: false })
                }

                if (!db.objectStoreNames.contains('sales')) {
                    store = db.createObjectStore('sales', { keyPath: 'id' });
                    store.createIndex('seekID', 'id', { unique: true })
                }

                if (!db.objectStoreNames.contains('expenses')) {
                    store = db.createObjectStore('expenses', { keyPath: 'id' });
                    store.createIndex('seekID', 'id', { unique: true })
                }
            };
        });
    }

    async getObjectStore(storeName = '', mode = '') {
        const transaction = this.db.transaction([storeName], mode);
        return transaction.objectStore(storeName);
    }
}

export default Database;
