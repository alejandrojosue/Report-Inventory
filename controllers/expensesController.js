import Database from '../database/config.js';
import Expense from '../models/expense.js';

export default class ExpensesController {
    constructor() {
        this.db = new Database('myDB');
    }

    async getAll() {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('expenses', 'readonly');
        const expenses = [];
        return new Promise((resolve, reject) => {
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const product = cursor.value;
                    expenses.push(product);
                    cursor.continue();
                } else {
                    resolve(expenses);
                }
            }
            request.onerror = () => {
                reject("Error al obtener la lista de productos");
            };
        });
    }

    async getById(id) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('expenses', 'readonly');

        return new Promise((resolve, reject) => {
            const request = store.get(id);

            request.onsuccess = (event) => {
                const expense = event.target.result;
                if (expense) {
                    resolve(expense);
                } else {
                    reject("Gasto no encontrado");
                }
            };

            request.onerror = () => {
                reject("Error al obtener el gasto por ID");
            };
        });
    }

    async add(expense) {
        await this.db.openConnection();
        const store = await this.db.getObjectStore('expenses', 'readwrite');

        const currentDate = new Date();
        const expenseData = new Expense(
            Date.now(),
            expense.amount,
            expense.description,
            true,
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
            currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString(),
        );

        const request = store.add(expenseData);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve("Gasto agregado exitosamente");
            };

            request.onerror = (event) => {
                reject("Error al agregar gasto");
            };
        });
    }

    async update(id, updatedExpense) {
        await this.db.openConnection()
        const store = await this.db.getObjectStore('expenses', 'readwrite')

        const request = store.get(id)
        return new Promise((resolve, reject) => {
            request.onsuccess = async (event) => {
                const existingExpense = event.target.result
                if (existingExpense) {
                    const currentDate = new Date()
                    existingExpense.amount = updatedExpense.amount
                    existingExpense.description = updatedExpense.description
                    existingExpense.status = updatedExpense.status
                    existingExpense.update_at =
                        currentDate.toLocaleDateString() + '|' + currentDate.toLocaleTimeString()

                    const updateRequest = store.put(existingExpense)

                    updateRequest.onsuccess = () => {
                        resolve("Gasto actualizado exitosamente");
                    };

                    updateRequest.onerror = () => {
                        reject("Error al actualizar gasto");
                    };
                }
            }
        })
    }
}