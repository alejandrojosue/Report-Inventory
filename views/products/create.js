import ProductosController from '../../controllers/productosController.js'
const productosController = new ProductosController();
document.getElementById("btnCreate").addEventListener("click", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("productName").value;
    const precio = parseFloat(document.getElementById("unitPrice").value);

    if (nombre && precio) {
        try {
            const mensaje = await productosController.agregarProducto({ nombre, precio });
            alert(mensaje)
            console.log(mensaje);
        } catch (error) {
            alert('error', error)
            console.error(error);
        }
    }
});