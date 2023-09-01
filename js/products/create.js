import ProductsController from '../../controllers/productsController.js'
const productsController = new ProductsController();
const create = async () => {
    
}
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
                const name = document.getElementById("productName").value
    const stock = parseInt(document.getElementById("stock").value)
    const unitPrice = parseFloat(document.getElementById("unitPrice").value)
    const description = document.getElementById("description").value

    if (name && unitPrice && stock && description) {
        try {
            const mensaje = await productsController.add({
                name, stock, unitPrice, description
            })
            alert(mensaje)
            location.href = '../../views/products/index.html'
        } catch (err) {
            console.error(err);
        }
    }
            }
        }, false)
    })
})()
