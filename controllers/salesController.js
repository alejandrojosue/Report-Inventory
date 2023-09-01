import Database from '../database/config.js';
import Sale from '../models/sale.js';

export default class SalesController {
    constructor() {
        this.db = new Database('myDB');
    }

    async getAll() {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('sales', 'readonly');
        const sales = [];
        return new Promise((resolve, reject) => {
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const sale = cursor.value;
                    sales.push(sale);
                    cursor.continue();
                } else {
                    resolve(sales.reverse());
                }
            }
            request.onerror = () => {
                reject("Error al obtener la lista de ventas");
            };
        });
    }

    async getById(id) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('sales', 'readonly');

        return new Promise((resolve, reject) => {
            const request = store.get(id);

            request.onsuccess = (event) => {
                const sale = event.target.result;
                if (sale) {
                    resolve(sale);
                } else {
                    reject("venta no encontrada");
                }
            };

            request.onerror = () => {
                reject("Error al obtener el venta por ID");
            };
        });
    }

    async add(sale) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('sales', 'readwrite');
        const currentDate = new Date();
        const saleData = new Sale(
            Date.now(),
            sale.products,
            true,
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
        );

        const request = store.add(saleData);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve("Venta agregada exitosamente");
            };

            request.onerror = (event) => {
                reject("Error al agregar venta");
            };
        });
    }

    async update(id, updatedsale) {
        await this.db.openConnection()
        const store = await this.db.getObjectStore('sales', 'readwrite')
        const request = store.get(id)
        return new Promise((resolve, reject) => {
            request.onsuccess = async (event) => {
                const existingSale = event.target.result
                if (existingSale) {
                    const currentDate = new Date()
                    existingSale.product = updatedsale.product
                    existingSale.status = updatedsale.status
                    existingSale.update_at =
                        currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString()

                    const updateRequest = store.put(existingSale)

                    updateRequest.onsuccess = () => {
                        resolve("Venta actualizada exitosamente");
                    };

                    updateRequest.onerror = () => {
                        reject("Error al actualizar venta");
                    };
                }
            }
        })
    }
}