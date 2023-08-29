// controllers/productosController.js
import Database from '../database/db.js';
import Producto from '../models/producto.js';

class ProductosController {
    constructor() {
        this.db = new Database('miBaseDeDatos');
    }

    async agregarProducto(producto) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('productos', 'readwrite');

        const fechaActual = new Date().toLocaleDateString();
        const productoData = new Producto(
            Date.now(),
            producto.nombre,
            producto.precio,
            fechaActual,
            fechaActual
        );

        const request = store.add(productoData);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve("Producto agregado exitosamente");
            };

            request.onerror = (event) => {
                reject("Error al agregar producto");
            };
        });
    }
}

export default ProductosController;
