import ExpensesController from '../../controllers/expensesController.js'
const expensesController = new ExpensesController()
const create = async () => {
    const amount = document.getElementById("amount").value
    const description = document.getElementById("description").value

    if (amount && description) {
        try {
            const expense = { amount: parseFloat(amount), description }
            const mensaje = await expensesController.add(expense)
            alert(mensaje)
            location.href = './index.html'
        } catch (err) {
            console.error(err);
        }
    }
}
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                create()
            }
        }, false)
    })
})()
