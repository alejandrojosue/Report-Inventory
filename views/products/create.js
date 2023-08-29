import ProductosController from '../../controllers/productosController.js'
const productosController = new ProductosController();
alert('hola')
document.getElementById("btnCreate").addEventListener("click", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("productName").value;
    const precio = parseFloat(document.getElementById("unitPrice").value);

    if (nombre && precio) {
        try {
            const mensaje = await productosController.agregarProducto({ nombre, precio });
            console.log(mensaje);
        } catch (error) {
            console.error(error);
        }
    }
});