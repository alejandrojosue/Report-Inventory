import ExpensesController from '../../controllers/expensesController.js'
const expensesController = new ExpensesController();

const list = document.getElementById('list')
const btnShow = document.getElementById('btnShow')

const deleted = async (id) => {
    const expense = await expensesController.getById(parseInt(id))
    const res = confirm(`Seguro que desea eliminar el gasto \n#${id} de la lista ? `)
    if (res) {
        expense.status = false
        await expensesController.update(parseInt(id), expense)
        alert('Eliminado')
        location.reload()
    }
}
const redirection = (id) => {
    localStorage.setItem('expenseId', parseInt(id));
    location.href = './edit.html'
};

const show = async (date) => {
    const expenses = await expensesController.getAll()
    list.innerHTML =
        `<div class="border-bottom d-flex p-2 fs-5 text-secondary align-items-center"><span class="fw-bold d-flex align-items-center">ID&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i>&nbsp;&nbsp;</span><span class="fw-bold w-100 d-flex align-items-center">&nbsp;MONTO&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i></span><span class="fw-bold d-flex justify-content-end" style="width: 100px;"></span></div>`
    if (date) {
        expenses.filter(expense => expense.update_at.split("|")[0] === date)
            .forEach(expense => {
                list.innerHTML +=
                    `
                    ${!expense.status ?
                        `<div class="border-bottom d-flex p-2 fs-5">`
                        : '<div class="border-bottom d-flex p-2 fs-5">'}
                    
                    <span class="d-flex align-items-center text-truncate" style="width: 45px;">
                         &nbsp;${expense.id}
                    </span>
                    ${expense.status ? '<span class="flex-fill text-truncate px-1">' :
                        `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                    L. ${expense.amount}
                    </span>
                    <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                        style="width: 60px;">
                        <i class="fa-solid fa-pen" data-id="${expense.id}"></i>
                        ${expense.status ? `<i class="fa-solid fa-trash" data-id="${expense.id}"></i>` : ''}
                    </span >
                </div > `
            });
    } else {
        expenses.forEach(expense => {
            list.innerHTML +=
                `
                    ${!expense.status ?
                    `<div class="border-bottom d-flex p-2 fs-5">`
                    : '<div class="border-bottom d-flex p-2 fs-5">'}
                    
                    <span class="d-flex align-items-center text-truncate" style="width: 45px;">
                         &nbsp;${expense.id}
                    </span>
                    ${expense.status ? '<span class="flex-fill text-truncate px-1">' :
                    `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                    L. ${expense.amount}
                    </span>
                    <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                        style="width: 60px;">
                        <i class="fa-solid fa-pen" data-id="${expense.id}"></i>
                        ${expense.status ? `<i class="fa-solid fa-trash" data-id="${expense.id}"></i>` : ''}
                    </span >
                </div > `
        });
    }

}
(async () => {
    show((new Date).toLocaleDateString())

    list.onclick = (e) => {
        const target = e.target;
        if (target.classList.contains('fa-pen')) {
            const expenseId = target.getAttribute('data-id')
            redirection(parseInt(expenseId));
        } else if (target.classList.contains('fa-trash')) {
            const expenseId = target.getAttribute('data-id');
            deleted(expenseId)
        }
    }

    btnShow.onclick = () => {
        if (btnShow.textContent.trim() === 'Mostrar Todos') {
            btnShow.innerHTML = '<i class="fa-solid fa-align-center"></i> &nbsp;Hoy'
            show()
        } else {
            show((new Date).toLocaleDateString())
            btnShow.innerHTML = '<i class="fa-solid fa-align-center"></i> &nbsp;Mostrar Todos'
        }
    }
})()