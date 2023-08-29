class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.db = null;
    }

    async openConnection() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event) => {
                reject("Error opening database");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Define object stores here
            };
        });
    }

    async getObjectStore(storeName, mode) {
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }
}

export default Database;
