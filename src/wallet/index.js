const Transaction = require('../transaction');
const { genKeyPair } = require('../utilities');
const { INITIAL_BALANCE } = require('../constants');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `
    Carteira

      Chave pública: ${this.publicKey}
      Saldo:         ${this.balance}
    `;
  }

  sign(hashFromData) {
    return this.keyPair.sign(hashFromData);
  }

  createTransaction(recipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.log(`Valor da transação excede o saldo da carteira. Saldo: ${this.balance}; Valor: ${amount}.`);
      return null;
    }

    let transaction = transactionPool.findTransactionByAddress(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.create(this, recipient, amount);
      transactionPool.addOrUpdateTransaction(transaction);
    }

    return transaction;
  }
}

module.exports = Wallet;
