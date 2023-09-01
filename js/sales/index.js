import SalesController from '../../controllers/salesController.js'
const salesController = new SalesController();

const list = document.getElementById('list')
const btnShow = document.getElementById('btnShow')

const deleted = async (id) => {
    const res = confirm(`Seguro que desea eliminar la venta #[${id}] de la lista ? `)
    if (res) {
        const sale = await salesController.getById(parseInt(id))
        sale.status = false
        await salesController.update(parseInt(id), sale)
        alert('Eliminado')
        location.reload()
    }
}
const redirection = (id) => {
    localStorage.setItem('saleId', parseInt(id));
    location.href = '../../views/sales/edit.html'
};

const show = async (date) => {
    const sales = await salesController.getAll()
    list.innerHTML =
        `<div class="border-bottom d-flex p-2 fs-5 text-secondary align-items-center"><span class="fw-bold d-flex align-items-center" style="width: 105px;">FECHA&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i>&nbsp;&nbsp;</span><span class="fw-bold w-100 d-flex align-items-center">&nbsp;&nbsp;MONTO TOTAL&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i></span><span class="fw-bold d-flex justify-content-end" style="width: 100px;"></span></div>`
    if (date) {
        sales.filter(sale => sale.update_at.split("|")[0] === (new Date).toLocaleDateString())
            .forEach(sale => {
                list.innerHTML +=
                    `
                    ${!sale.status ?
                        `<div class="border-bottom d-flex p-2 fs-5">`
                        : '<div class="border-bottom d-flex p-2 fs-5">'}
                    
                    <span class="d-flex align-items-center text-truncate" style="width: 100px;">
                         &nbsp;${sale.update_at.split("|")[0]}
                    </span>
                    ${sale.status ? '<span class="flex-fill text-truncate px-1">' :
                        `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                    L. ${sale.products.reduce((acc, product) => acc += product.amount, 0)}
                    </span>
                    <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                        style="width: 60px;">
                        <i class="fa-solid fa-eye" data-id="${sale.id}"></i>
                        ${sale.status ? `<i class="fa-solid fa-trash" data-id="${sale.id}"></i>` : ''}
                    </span >
                </div > `
            });
    } else {
        sales.forEach(sale => {
            list.innerHTML +=
                `
                ${!sale.status ?
                    `<div class="border-bottom d-flex p-2 fs-5">`
                    : '<div class="border-bottom d-flex p-2 fs-5">'}
                
                <span class="d-flex align-items-center text-truncate" style="width: 100px;">
                     &nbsp;${sale.update_at.split("|")[0]}
                </span>
                ${sale.status ? '<span class="flex-fill text-truncate px-1">' :
                    `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                L. ${sale.products.reduce((acc, product) => acc += product.amount, 0)}
                </span>
                <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                    style="width: 60px;">
                    <i class="fa-solid fa-eye" data-id="${sale.id}"></i>
                    ${sale.status ? `<i class="fa-solid fa-trash" data-id="${sale.id}"></i>` : ''}
                </span >
            </div > `
        });
    }

}

(async () => {
    show((new Date).toLocaleDateString())

    list.onclick = (e) => {
        const target = e.target;
        if (target.classList.contains('fa-eye')) {
            const saleId = target.getAttribute('data-id')
            redirection(parseInt(saleId));
        } else if (target.classList.contains('fa-trash')) {
            const saleId = target.getAttribute('data-id');
            deleted(parseInt(saleId))
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
