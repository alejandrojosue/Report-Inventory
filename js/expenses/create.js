import ExpensesController from '../../controllers/expensesController.js'
const expensesController = new ExpensesController();

(async() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', async(event) => {
            alert('validando el form')
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                alert('datos')
                const amount = document.getElementById("amount").value
    const description = document.getElementById("description").value
alert('antes del if')
    if (amount && description) {
        try {
            const expense = { amount: parseFloat(amount), description }
            const mensaje = await expensesController.add(expense)
            alert(mensaje)
            location.href = '../../views/expenses/index.html'
        } catch (err) {
            alert(err);
        }
    }else{alert('else')}
            }
        }, false)
    })
})()
