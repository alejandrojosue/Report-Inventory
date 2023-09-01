import SalesController from '../../controllers/salesController.js'
import ProductsController from '../../controllers/productsController.js'
const salesController = new SalesController()
const productsController = new ProductsController()
const productID = document.querySelector('#productID')
const btnAdd = document.querySelector('#btnAdd')
const quantity = document.querySelector('#quantity')
const unitPrice = document.querySelector('#unitPrice')
const btnCreate = document.querySelector('#btnCreate')
const details = document.querySelector('#details')
const contAmount = document.querySelector('#contAmount')
const currentDate = new Date()
document.querySelector('#date').textContent = currentDate.toLocaleDateString();
let products;
let product = { id: 0, name: null, quantity: 0, amount: 0.0 };
let sale = { id: 0, products: [], status: true, created_at: null, updated_at: null };
(async () => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')

    products = await productsController.getAll()
    products.forEach(product => {
        productID.innerHTML +=
            `<option value="${product.id}">${product.name}</option>`
    })

    productID.onchange = () => {
        const res = products.find(p => p.id == productID.value)
        product.id = res.id * 1
        product.name = res.name
        unitPrice.value = res.unitPrice
    }

    btnAdd.onclick = () => {
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
    }

    details.onclick = (e) => {
        const target = e.target;
        if (target.classList.contains('btn-close')) {
            const productId = target.getAttribute('data-id')
            update(parseInt(productId))
        }
    }

    btnCreate.onclick = async () => {
        if (sale.products.length > 0) {
            try {
                const mensaje = await salesController.add(sale)
                alert(mensaje)
                location.href = '../../views/sales/index.html'
            } catch (err) {
                console.error(err);
            }
        }
    }

    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', async (event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

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
        <button type="button" data-id="${parseInt(p.id)}" class="btn-close h-50" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
        amount += parseFloat(p.amount)
    })
    contAmount.textContent = 'L. ' + amount
    quantity.value = ''
    productID.value = ''
    unitPrice.value = ''
}

const update = (id) => {
    const index = sale.products.findIndex(p => p.id == id)
    sale.products.splice(index, 1);
    show()
}
