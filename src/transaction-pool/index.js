class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addOrUpdateTransaction(transaction) {
    const index = this.findTransactionIndex(transaction);

    if (index !== -1) {
      this.transactions[index] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  findTransactionIndex(transaction) {
    return this.transactions.findIndex(t => t.id === transaction.id);
  }
}

module.exports = TransactionPool;
