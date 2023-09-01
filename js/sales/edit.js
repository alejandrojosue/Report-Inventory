import SalesController from '../../controllers/salesController.js'
const salesController = new SalesController();

const details = document.querySelector('#details')
const isEditable = document.querySelectorAll('.isEditable')
const contAmount = document.querySelector('#contAmount')
const btnSave = document.querySelector('#btnSave')
const form = document.querySelector('.needs-validation')

const saleID = localStorage.getItem('saleId')
const sale = await salesController.getById(parseInt(saleID))

const saveEdit = async () => {
    try {
        sale.status = true
        const msj = await salesController.update(parseInt(saleID), sale)
        alert(msj)
        location.href = '../../views/sales/index.html'
    } catch (err) {
        console.error(err)
    }
};

(async () => {
    !(sale.status) ? document.querySelector('#btnSave').innerHTML = '<i class="fa-solid fa-check"></i> Restaurar' : 'Finalizar y Guardar'
    isEditable.forEach(div => div.style.display = 'none')
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
        
    </div>`
        amount += parseFloat(p.amount)
    })
    contAmount.textContent = 'L. ' + amount
    form.onsubmit = e => e.preventDefault()
    btnSave.onclick = () => { if (btnSave.textContent.trim() !== 'Regresar') saveEdit(); else location.href = '../../views/sales/index.html' }
})()
