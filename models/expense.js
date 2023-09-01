export default class Expense {
    constructor(id, amount, description, status, created_at, update_at) {
        this.id = id
        this.amount = amount
        this.description = description
        this.status = status
        this.created_at = created_at
        this.update_at = update_at
    }
}