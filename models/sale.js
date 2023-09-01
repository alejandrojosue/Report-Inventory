export default class Sale {
    constructor(id, products, status, created_at, update_at) {
        this.id = id
        this.products = products
        this.status = status
        this.created_at = created_at
        this.update_at = update_at
    }
}