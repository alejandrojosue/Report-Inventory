import ExpensesController from '../../controllers/expensesController.js'
const expensesController = new ExpensesController();

const forms = document.querySelectorAll('.needs-validation')
const amount = document.getElementById("amount")
const description = document.getElementById("description");

(async () => {
    'use strict'
    let expenseID = localStorage.getItem('expenseId')
    const expense = await expensesController.getById(parseInt(expenseID))
    amount.value = parseFloat(expense.amount)
    description.value = expense.description
    !(expense.status) ? document.querySelector('#btnSave').innerHTML = '<i class="fa-solid fa-check"></i> Restaurar' : 'Finalizar y Guardar'

    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            if (!form.checkValidity()) {
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                if (amount && description) {
                    try {
                        const msj = await expensesController.update(parseInt(expenseID), {
                            amount: parseFloat(amount.value),
                            description: description.value,
                            status: true
                        });
                        alert(msj)
                        location.href ='../../views/expenses/index.html'
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        }, false)
    })
})()
