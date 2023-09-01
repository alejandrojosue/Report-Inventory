import ProductsController from '../../controllers/productsController.js'
const productsController = new ProductsController();

const list = document.getElementById('list');

const deleted = async (id) => {
    const product = await productsController.getById(parseInt(id))
    const res = confirm(`Seguro que desea eliminar: \n[${product.name}] de la lista ? `)
    if (res) {
        product.status = false
        await productsController.update(parseInt(id), product)
        alert('Eliminado')
        location.reload()
    }
}
const redirection = (id) => {
    localStorage.setItem('productId', parseInt(id));
    location.href ='../../views/products/edit.html'
};

(async () => {
    const products = await productsController.getAll()
    list.innerHTML =
        `<div class="border-bottom d-flex p-2 fs-5 text-secondary align-items-center"><span class="fw-bold d-flex align-items-center">ID&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i>&nbsp;&nbsp;</span><span class="fw-bold w-100 d-flex align-items-center">&nbsp;DESCRIPCIÓN&nbsp;<i class="fa-solid fa-sort-down" style="font-size: .5em;"></i></span><span class="fw-bold d-flex justify-content-end" style="width: 100px;"></span></div>`
    products.forEach(product => {
        list.innerHTML +=
            `
                ${!product.status ?
                `<div class="border-bottom d-flex p-2 fs-5">`
                : '<div class="border-bottom d-flex p-2 fs-5">'}
                
                <span class="d-flex align-items-center text-truncate" style="width: 45px;">
                     &nbsp;${product.id}
                </span>
                ${product.status ? '<span class="flex-fill text-truncate px-1">' :
                `<span class="flex-fill text-truncate px-1 fst-italic text-danger text-decoration-line-through">`}
                ${product.name}
                </span>
                <span class="fw-bold d-flex justify-content-between text-secondary align-items-center"
                    style="width: 60px;">
                    <i class="fa-solid fa-pen" data-id="${product.id}"></i>
                    ${product.status ? `<i class="fa-solid fa-trash" data-id="${product.id}"></i>` : ''}
                </span >
            </div > `
    });

    list.onclick = (e) => {
        const target = e.target;
        if (target.classList.contains('fa-pen')) {
            const productId = target.getAttribute('data-id')
            redirection(parseInt(productId));
        } else if (target.classList.contains('fa-trash')) {
            const productId = target.getAttribute('data-id');
            deleted(productId)
        }
    }
})()
