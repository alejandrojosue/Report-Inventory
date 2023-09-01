import ProductsController from '../../controllers/productsController.js'
const productsController = new ProductsController();
const forms = document.querySelectorAll('.needs-validation')
const name = document.getElementById("productName")
const stock = document.getElementById("stock")
const unitPrice = document.getElementById("unitPrice")
const description = document.getElementById("description");

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', async(event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                
                
    if (name && unitPrice && stock && description) {
        try {
            const product ={
                    name: name.value,
                    stock: parseInt(stock.value),
                    unitPrice: parseFloat(unitPrice.value),
                    description: description.value
                }
            const mensaje = await productsController.add(product)
            alert(mensaje)
            location.href = '../../views/products/index.html'
        } catch (err) {
            alert(err);
        }
    }
            }
        }, false)
    })
})()
