const TABLE = 'expenses';
const ID_PRODUCT_COUNT = 'expenseID';
const currentDate = new Date();
document.querySelector('#date').textContent = currentDate.toLocaleDateString();
(() => {
    const request = indexedDB.open('miDB')
    request.onerror = (evt) => alert(`Error ${evt.code} / ${evt.message}`)
    request.onsuccess = (e) => db = e.target.result
})()

// LOCALSTORAGE
const setIntValue = (key, value) => {
    if (localStorage.getItem(key) === null) {
        if (typeof value === 'number' && Number.isInteger(value))
            localStorage.setItem(key, value)
        else console.error('El valor debe ser un número entero.')
    }
}

const updateIntValue = (key, newValue) => {
    if (typeof newValue === 'number' && Number.isInteger(newValue))
        localStorage.setItem(key, newValue);
    else console.error('El nuevo valor debe ser un número entero.');

}

const createNew = () => {
    const amount = document.querySelector('#amount').value
    const description = document.querySelector('#description').value
    const transaction = db.transaction([TABLE], "readwrite")
    const objectStore = transaction.objectStore(TABLE)
    setIntValue(ID_PRODUCT_COUNT, 0); // Guardar un valor entero PRIMERA VEZ
    let id = parseInt(localStorage.getItem(ID_PRODUCT_COUNT));

    objectStore.add({
        id,
        amount: parseFloat(amount),
        description,
        status: true,
        created_at: `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`,
        updated_at: `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`
    });
    updateIntValue(ID_PRODUCT_COUNT, (id + 1))

    transaction.oncomplete = () => { location.href = `../../views/expenses/index.html` }
    transaction.onerror = e => console.log(e.target.error)
}

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
            if (form.checkValidity()) {
                createNew()
            }
        }, false)
    })
})()