const Transaction = require('../transaction');

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

  clear() {
    this.transactions = [];
  }

  getValidTransactions() {
    return this.transactions.filter((t) => {
      const outputTotal = t.outputs.reduce((acc, cur) => acc + cur.amount, 0);

      if (t.input.amount !== outputTotal) {
        console.log(`Transação inválida da carteira ${
          t.input.address
        }. Total das saídas não bate com entrada. Saídas: ${outputTotal}; Entrada: ${
          t.input.amount
        }.`);
        return null;
      }

      if (!Transaction.isTransactionValid(t)) {
        console.log(`Transação inválida da carteira ${t.input.address}.`);
        return null;
      }

      return t;
    });
  }

  findTransactionIndex(transaction) {
    return this.transactions.findIndex(t => t.id === transaction.id);
  }

  findTransactionByAddress(address) {
    return this.transactions.find(t => t.input.address === address);
  }
}

module.exports = TransactionPool;
