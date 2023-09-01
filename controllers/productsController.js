import Database from '../database/config.js';
import Product from '../models/product.js';

class ProductsController {
    constructor() {
        this.db = new Database('myDB');
    }

    async getAll() {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('products', 'readonly');
        const products = [];
        return new Promise((resolve, reject) => {
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const product = cursor.value;
                    products.push(product);
                    cursor.continue();
                } else {
                    resolve(products);
                }
            }
            request.onerror = () => {
                reject("Error al obtener la lista de productos");
            };
        });
    }

    async getById(id) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('products', 'readonly');

        return new Promise((resolve, reject) => {
            const request = store.get(id);

            request.onsuccess = (event) => {
                const product = event.target.result;
                if (product) {
                    resolve(product);
                } else {
                    reject("Producto no encontrado");
                }
            };

            request.onerror = () => {
                reject("Error al obtener el producto por ID");
            };
        });
    }

    async add(product) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('products', 'readwrite');

        const currentDate = new Date();
        const productData = new Product(
            Date.now(),
            product.name,
            product.stock,
            product.unitPrice,
            product.description,
            true,
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
        );

        const request = store.add(productData);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve("Producto agregado exitosamente");
            };

            request.onerror = (event) => {
                reject("Error al agregar producto");
            };
        });
    }

    async update(id, updatedProduct) {
        await this.db.openConnection()
        const store = await this.db.getObjectStore('products', 'readwrite')

        const request = store.get(id)
        return new Promise((resolve, reject) => {
            request.onsuccess = async (event) => {
                const existingProduct = event.target.result
                if (existingProduct) {
                    const currentDate = new Date()
                    existingProduct.name = updatedProduct.name
                    existingProduct.stock = updatedProduct.stock
                    existingProduct.unitPrice = updatedProduct.unitPrice
                    existingProduct.description = updatedProduct.description
                    existingProduct.status = updatedProduct.status
                    existingProduct.update_at =
                        currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString()

                    const updateRequest = store.put(existingProduct)

                    updateRequest.onsuccess = () => {
                        resolve("Producto actualizado exitosamente");
                    };

                    updateRequest.onerror = () => {
                        reject("Error al actualizar producto");
                    };
                }
            }
        })
    }
}

export default ProductsController;
