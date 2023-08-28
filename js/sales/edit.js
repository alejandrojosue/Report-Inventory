const TABLE = 'sales';
let db;
let saleArr =
    [/*{
        id: -1,
        products: [],
        status: true,
        created_at: null,
        updated_at: null
    }*/];
const record = (key) => {
    const transaction = db.transaction([TABLE])
    const objectStore = transaction.objectStore(TABLE)
    const request = objectStore.get(parseInt(key))
    const quantity = document.querySelector('#quantity')
    const unitPrice = document.querySelector('#unitPrice')
    const description = document.querySelector('#description')
    request.onsuccess = () => {
        quantity.value = request.result.quantity
        unitPrice.value = request.result.unitPrice
        description.value = request.result.description
        created_at = request.result.created_at
        !(request.result.status) ? document.querySelector('#btnSave').innerHTML = '<i class="fa-solid fa-check"></i> Restaurar' : 'Finalizar y Guardar'
    }
}

(() => {
    const request = indexedDB.open('miDB')
    request.onerror = (evt) => alert(`Error ${evt.code} / ${evt.message}`)
    request.onsuccess = (e) => {
        db = e.target.result
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('key');
        record(id)
    }
})();

const saveEdit = (id) => {
    const transaction = db.transaction([TABLE], "readwrite")
    const objectStore = transaction.objectStore(TABLE)
    const fechaActual = new Date()
    const v = saleArr.find(sale => sale.id === id)
    objectStore.put({
        id: parseInt(id),
        products: v.products,
        created_at: v.created_at,
        status: false,
        updated_at: `${fechaActual.toLocaleDateString()} | ${fechaActual.toLocaleTimeString()} `
    });
    transaction.onsuccess = e => console.log('siiii')
    transaction.oncomplete = () => { location.href = '../../views/sales/index.html' }
    transaction.onerror = e => { console.log(e.target.error, 'noooo') }
}

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                saveEdit()
            }
        }, false)
    })
})()
