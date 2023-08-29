const TABLE = 'sales';
const ID_PRODUCT_COUNT = 'saleID';
let productArr = [{
    // id: 0,
    // name: '',
    // quantity: 0,
    // unitPrice: 0.0,
    // description: null,
    // created_at: '',
    // updated_at: null
}]
let product = {
    id: 0,
    name: null,
    quantity: 0,
    amount: 0.0
};
let sale =
{
    id: 0,
    products: [],
    status: true,
    created_at: null,
    updated_at: null
};

const productID = document.querySelector('#productID');
const btnAdd = document.querySelector('#btnAdd');
const quantity = document.querySelector('#quantity');
const unitPrice = document.querySelector('#unitPrice');
const btnCreate = document.querySelector('#btnCreate');
const details = document.querySelector('#details');
const contAmount = document.querySelector('#contAmount');
const currentDate = new Date();
document.querySelector('#date').textContent = currentDate.toLocaleDateString();
productID.addEventListener('change', () => {
    const res = productArr.find(p => p.id == productID.value)
    product.id = res.id * 1
    product.name = res.name
    unitPrice.value = res.unitPrice
});
btnAdd.addEventListener('click', () => {
    if ((quantity.value !== '') && (unitPrice.value !== '')) {
        product.quantity = quantity.value * 1
        product.amount = unitPrice.value * quantity.value
        sale.products.push({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            amount: product.quantity * unitPrice.value
        })
        show()
    }
});

(() => {
    const request = indexedDB.open('miDB')
    request.onerror = (evt) => alert(`Error ${evt.code} / ${evt.message}`)
    request.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction('products')
        const objectStore = transaction.objectStore('products')
        let cursor = objectStore.openCursor();
        cursor.onsuccess = (e) => {
            let cursor = e.target.result
            if (cursor) {
                if (cursor.value.status) {
                    productArr.push(cursor.value)
                    productID.innerHTML +=
                        `<option value="${cursor.value.id}">${cursor.value.name}</option>`
                }
                cursor.continue()
            }
        }
    }
})()

// LOCALSTORAGE
const setIntValue = (key, value) => {
    if (localStorage.getItem(key) === null) {
        if (typeof value === 'number' && Number.isInteger(value))
            localStorage.setItem(key, value)
        else console.error('El valor debe ser un número entero.')
    }
}

const updateIntValue = (key, newValue) => {
    if (typeof newValue === 'number' && Number.isInteger(newValue))
        localStorage.setItem(key, newValue);
    else console.error('El nuevo valor debe ser un número entero.');

}

const show = () => {
    details.innerHTML = ``
    let amount = 0
    sale.products.forEach(p => {
        details.innerHTML +=
            `<div class="alert alert-primary alert-dismissible fade d-flex align-items-center show" role="alert"
        style="height: 75px;">
        <svg xmlns="http://www.w3.org/2000/svg" class="me-3" viewBox="0 0 16 16" aria-label="Info:"
            style="width: 20px; fill: #0d6efd;">
            <path
                d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
        <div>
            <div class="text-dark fw-bold text-truncate" style="width: 250px;">
                ${p.name}</div> <span class="text-dark">Cantidad: ${p.quantity} &nbsp;Valor: ${p.amount / p.quantity}</span>
        </div>
        <button type="button" onclick="update(${parseInt(p.id)})" class="btn-close h-50" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
        amount += parseFloat(p.amount)
    })
    contAmount.textContent = 'L. ' + amount
    quantity.value = ''
    productID.value = ''
    unitPrice.value = ''
}

const createNew = () => {
    setIntValue(ID_PRODUCT_COUNT, 0); // Guardar un valor entero PRIMERA VEZ
    let id = parseInt(localStorage.getItem(ID_PRODUCT_COUNT));
    sale.id = parseInt(id)
    sale.created_at = `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`
    sale.updated_at = `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`
    const transaction = db.transaction([TABLE], 'readwrite')
    const objectStore = transaction.objectStore(TABLE)
    objectStore.add(sale);
    updateIntValue(ID_PRODUCT_COUNT, (id + 1))

    transaction.oncomplete = () => { location.href = '../../views/sales/index.html' }
    transaction.onerror = e => console.log(e.target.error)
}

const update = (id) => {
    const index = sale.products.findIndex(p => p.id == id)
    sale.products.splice(index, 1);
    show()
}

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault()
            if (!form.checkValidity()) {
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {

            }
        }, false)
    })
})();

btnCreate.addEventListener('click', () => {
    if (sale.products.length > 0) createNew()
})