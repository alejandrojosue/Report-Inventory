import ProductsController from '../controllers/ProductsController.js';
import SalesController from '../controllers/SalesController.js';

export default class ReportGenerator {
    constructor() {
        this.productsController = new ProductsController();
        this.salesController = new SalesController();
    }
    async generateReport() {
        try {
            // Obtener todos los productos
            const products = await this.productsController.getAll()
            // Obtener todas las ventas realizadas hoy
            const currentDate = new Date().toLocaleDateString()
            const sales = await this.salesController.getAll()
            const salesToday = sales.filter(sale => sale.created_at.split('|')[0] == currentDate)

            // Inicializar un objeto para el informe
            const report = [];

            // Calcular la cantidad de cada producto vendido hoy
            for (const product of products) {
                const productSoldToday = salesToday.reduce((total, sale) => {
                    const soldProduct = sale.status ? sale.products.find(p => p.id === product.id) : 0;
                    return total + (soldProduct ? soldProduct.quantity : 0);
                }, 0);

                const productAmountSoldToday = salesToday.reduce((total, sale) => {
                    const soldProduct = sale.status ? sale.products.find(p => p.id === product.id) : 0
                    return total + (soldProduct ? soldProduct.amount : 0);
                }, 0);

                const productAvailable = product.stock - productSoldToday;

                report.push({
                    Producto: product.name,
                    "Vendidos Hoy": productSoldToday,
                    "Valor Total": productAmountSoldToday,
                    "Disponibles": productAvailable
                });
            }
            const reportData = document.getElementById("report-data");
            report.forEach((venta) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                                <td>${venta.Producto}</td>
                                <td>${venta["Vendidos Hoy"]}</td>
                                <td>L. ${venta["Valor Total"]}</td>
                                <td>L. ${venta["Disponibles"]}</td>
                            `;
                reportData.appendChild(row);
            })
            const printWindow = window.open("", "_self");
            printWindow.document.write(`
                            <html>
                            <head>
                            <title>Reporte de Ventas - Pollolandia</title>
                            <style>
                                ${document.querySelector("style").innerHTML}
                            </style>
                            </head>
                            <body>
                            <h1>Reporte de Ventas - Pollolandia</h1>
                            <h2>Nombre de la Empresa</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Vendidos Hoy</th>
                                    <th>Valor Total</th>
                                    <th>Disponibles</th>
                                </tr>
                                </thead>
                                <tbody>
                                ${reportData.innerHTML}
                                </tbody>
                            </table>
                            </body>
                            </html>
                        `);
            printWindow.document.close();
            printWindow.print();
            return "Informe generado exitosamente.";
        } catch (error) {
            return `Error al generar el informe: ${error}`;
        }
    }
}