const { genUniqueId } = require('../utilities');

class Transaction {
  constructor() {
    this.id = genUniqueId();
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

    const sender = {
      amount: senderWallet.balance - amount,
      address: senderWallet.publicKey,
    };
    const receiver = { amount, address: recipient };

    transaction.outputs.push(sender);
    transaction.outputs.push(receiver);

    return transaction;
  }
}

module.exports = Transaction;
