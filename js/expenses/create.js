const TABLE = 'expenses';
const ID_PRODUCT_COUNT = 'expenseID';
const amount = document.querySelector('#amount')
const description = document.querySelector('#description')
const currentDate = new Date();
document.querySelector('#date').textContent = currentDate.toLocaleDateString();

(() => {
    const request = indexedDB.open('miDB')
    request.onerror = (evt) => alert(`Error ${evt.code} / ${evt.message}`)
    request.onsuccess = (e) => { db = e.target.result }
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
    setIntValue(ID_PRODUCT_COUNT, 0); // Guardar un valor entero PRIMERA VEZ
    let id = parseInt(localStorage.getItem(ID_PRODUCT_COUNT));
    const transaction = db.transaction([TABLE], "readwrite")
    const objectStore = transaction.objectStore(TABLE)
    objectStore.add({
        id,
        amount: parseFloat(amount.value),
        description: description.value,
        status: true,
        created_at: `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`,
        updated_at: `${currentDate.toLocaleDateString()} | ${currentDate.toLocaleTimeString()}`
    });
    updateIntValue(ID_PRODUCT_COUNT, (id + 1))

    transaction.oncomplete = () => {
        location.href = '../../views/expenses/index.html'
    }
    transaction.onerror = e => alert(e.target.error)
}

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
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