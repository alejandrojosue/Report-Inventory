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
const details = document.querySelector('#details')
const isEditable = document.querySelectorAll('.isEditable')
const contAmount = document.querySelector('#contAmount')
const btnSave = document.querySelector('#btnSave')
const form = document.querySelector('.needs-validation')
const record = (key) => {
    const transaction = db.transaction([TABLE])
    const objectStore = transaction.objectStore(TABLE)
    const request = objectStore.get(parseInt(key))
    request.onsuccess = () => {
        saleArr.products = request.result.products
        saleArr.created_at = request.result.created_at
        saleArr.update_at = request.result.update_at
        if (!request.result.status)
            document.querySelector('#btnSave').innerHTML = '<i class="fa-solid fa-check"></i> Restaurar'
        isEditable.forEach(div => {
            div.style.display = 'none'
        })
        let amount = 0;
        saleArr.products.forEach(p => {
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
    </div>`
            amount = 'L.' + parseFloat(p.amount)
        })
        contAmount.textContent = amount
    }
}

(() => {
    const request = indexedDB.open('miDB')
    request.onerror = (evt) => alert(`Error ${evt.code} / ${evt.message}`)
    request.onsuccess = (e) => {
        db = e.target.result
        const urlParams = new URLSearchParams(window.location.search);
        saleArr.id = urlParams.get('key') * 1;
        record(saleArr.id)
    }
})();

const saveEdit = () => {
    const transaction = db.transaction([TABLE], "readwrite")
    const objectStore = transaction.objectStore(TABLE)
    const currentDate = new Date()
    objectStore.put({
        id: saleArr.id,
        products: saleArr.products,
        created_at: saleArr.created_at,
        status: true,
        updated_at: `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()} `
    });
    transaction.onsuccess = e => console.log('siiii')
    transaction.oncomplete = () => { location.href = '../../views/sales/index.html' }
    transaction.onerror = e => { console.log(e.target.error, 'noooo') }
}

form.addEventListener('submit', e => e.preventDefault())
btnSave.addEventListener('click', () => {
    if (btnSave.textContent.trim() !== 'Regresar') saveEdit(); else location.href = '../../views/sales/index.html'
})
