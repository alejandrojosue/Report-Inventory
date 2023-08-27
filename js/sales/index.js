const list = document.getElementById('list')
const SSeek = document.querySelector('#SSeek')
const form = document.querySelector('#form')

const TABLE = 'sales';

let db;

const iniciarDB = () => {
    // form.addEventListener('submit', seek)

    const request = indexedDB.open('miDB')

    request.onerror = (evt) => {
        alert(`Error ${evt.code} / ${evt.message}`)
    }

    request.onsuccess = (e) => {
        db = e.target.result
        show()
    }

    // Abrir una base de datos no existente
    request.onupgradeneeded = (e) => {
        //creando el objeto de base de datos
        db = e.target.result
        let store
        // Crear un object store llamado TABLE
        if (!db.objectStoreNames.contains(TABLE)) {
            store = db.createObjectStore(TABLE, { keyPath: 'id' });
        }
        store.createIndex('seekID', 'id', { unique: false })

        if (!db.objectStoreNames.contains('products')) {
            store = db.createObjectStore('products', { keyPath: 'id' });
        }
        store.createIndex('seekName', 'name', { unique: false })

        if (!db.objectStoreNames.contains('expenses')) {
            store = db.createObjectStore('expenses', { keyPath: 'id' });
        }
        store.createIndex('seekID', 'id', { unique: true })

    }
}


const show = () => {
    list.innerHTML =
        `
    <div class="border-bottom d-flex p-2 fs-5 text-secondary align-items-center">
        <span class="fw-bold d-flex align-items-center">ID&nbsp;
            <i class="fa-solid fa-sort-down" style="font-size: .5em;"></i>&nbsp;&nbsp;
        </span>
        <span class="fw-bold w-100 d-flex align-items-center">&nbsp;DESCRIPCIÓN&nbsp;
            <i class="fa-solid fa-sort-down" style="font-size: .5em;"></i>
        </span>
        <span class="fw-bold d-flex justify-content-end" style="width: 100px;">
        </span>
    </div>
    `
    const transaction = db.transaction([TABLE])
    const objectStore = transaction.objectStore(TABLE)

    let cursor = objectStore.openCursor();
    cursor.onsuccess = (e) => {
        let cursor = e.target.result
        if (cursor) {
            list.innerHTML +=
                `
                ${!cursor.value.status ?
                    `<div class="border-bottom d-flex p-2 fs-5" onclick="seleccionar(${cursor.value.id})">`
                    : '<div class="border-bottom d-flex p-2 fs-5">'}
                
                <span class="d-flex align-items-center text-truncate" style="width: 45px;">
                     &nbsp;${cursor.value.id}
                </span>
                ${cursor.value.status ? '<span class="flex-fill text-truncate px-1">' :
                    `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                ${cursor.value.name}
                </span>
                <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                    style="width: 60px;">
                    <i class="fa-solid fa-pen" onclick="seleccionar(${cursor.value.id})"></i>
                    ${cursor.value.status ? `<i class="fa-solid fa-trash" onclick="deleted(${cursor.value.id}, '${cursor.value.name}', ${cursor.value.quantity}, ${cursor.value.unitPrice}, '${cursor.value.description}', '${cursor.value.created_at}')"></i>` : ''}
                </span >
            </div > `
            cursor.continue()
        }
    }
}

const seleccionar = (key) => location.href = './edit.html?key=' + key

const seek = (e) => {
    e.preventDefault()
    list.innerHTML = ''
    const name = SSeek.value
    const transaction = db.transaction([TABLE])
    const objectStore = transaction.objectStore(TABLE)

    const indice = objectStore.index('seekName')
    const range = IDBKeyRange.only(name)
    const cursor = indice.openCursor(range)

    cursor.onsuccess = (e) => {
        let cursor = e.target.result
        if (cursor) {
            list.innerHTML +=
                `< p > ${cursor.value.name}
<button class="btn btn-success" onclick="seleccionar(${cursor.value.id})">
    <span class="fs-3">
        <i class="fa-solid fa-pencil"></i>Editar
    </span>
</button>
            </p > `
            cursor.continue()
        }
    }
}

const saveEdit = (id, name, quantity, unitPrice, description, created_at) => {
    const transaction = db.transaction([TABLE], "readwrite")
    const objectStore = transaction.objectStore(TABLE)
    const fechaActual = new Date()
    objectStore.put({
        id: parseInt(id),
        name,
        description,
        unitPrice: parseFloat(unitPrice),
        quantity: parseInt(quantity),
        created_at,
        status: false,
        updated_at: `${fechaActual.toLocaleDateString()} | ${fechaActual.toLocaleTimeString()} `
    });
    transaction.onsuccess = e => console.log('siiii')
    transaction.oncomplete = () => { location.href = '../../views/products/index.html' }
    transaction.onerror = e => { console.log(e.target.error, 'noooo') }
}

const deleted = (id, name, quantity, unitPrice, description, created_at) => {
    const res = confirm(`Seguro que desea eliminar: \n * ${name}* de la lista ? `)
    if (res) {
        saveEdit(id, name, quantity, unitPrice, description, created_at)
        alert('Eliminado!')
        show()
    }
}

window.onload = (e) => {
    iniciarDB()
}
