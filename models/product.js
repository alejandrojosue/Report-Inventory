export default class Product {
    constructor(id, name, stock, unitPrice, description, status, created_at, update_at) {
        this.id = id
        this.name = name
        this.stock = stock
        this.unitPrice = unitPrice
        this.description = description
        this.status = status
        this.created_at = created_at
        this.update_at = update_at
    }
}