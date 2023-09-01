import ProductsController from '../../controllers/productsController.js'
const productsController = new ProductsController();

const forms = document.querySelectorAll('.needs-validation')
const name = document.getElementById("productName")
const stock = document.getElementById("stock")
const unitPrice = document.getElementById("unitPrice")
const description = document.getElementById("description");

(async () => {
    'use strict'
    let productID = localStorage.getItem('productId')
    const product = await productsController.getById(parseInt(productID))
    name.value = product.name
    stock.value = product.stock
    unitPrice.value = product.unitPrice
    description.value = product.description


    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            if (!form.checkValidity()) {
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {


                if (name && unitPrice && stock && description) {
                    try {
                        const msj = await productsController.update(parseInt(productID), {
                            name: name.value,
                            stock: stock.value,
                            unitPrice: unitPrice.value,
                            description: description.value,
                            status: true
                        });
                        alert(msj)
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        }, false)
    })
})()