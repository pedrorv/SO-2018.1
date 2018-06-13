const { genUniqueId, hashData } = require('../utilities');

class Transaction {
  constructor() {
    this.id = genUniqueId();
    this.input = null;
    this.outputs = [];
  }

  static create(senderWallet, recipient, amount) {
    const transaction = new Transaction();

    if (amount > senderWallet.balance) {
      console.log(`Valor da transação excede o saldo da carteira. Saldo: ${
        senderWallet.balance
      }; Valor: ${amount}.`);
      return null;
    }

    const senderOutput = {
      amount: senderWallet.balance - amount,
      address: senderWallet.publicKey,
    };
    const recipientOutput = { amount, address: recipient };

    transaction.outputs.push(senderOutput);
    transaction.outputs.push(recipientOutput);

    Transaction.sign(transaction, senderWallet);

    return transaction;
  }

  static sign(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hashData(transaction.outputs)),
    };
  }
}

module.exports = Transaction;
