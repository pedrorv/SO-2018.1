const { MINING_REWARD } = require('../constants');
const { genUniqueId, hashData, isSignatureValid } = require('../utilities');

class Transaction {
  constructor() {
    this.id = genUniqueId();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(o => o.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Valor da transação excede o saldo da carteira. Saldo: ${
        senderOutput.amount
      }; Valor: ${amount}.`);
      return null;
    }

    senderOutput.amount -= amount;
    const recipientOutput = { amount, address: recipient };
    this.outputs.push(recipientOutput);
    Transaction.sign(this, senderWallet);

    return this;
  }

  static create(senderWallet, recipient, amount) {
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

    return this.getWithOutputs(senderWallet, [senderOutput, recipientOutput]);
  }

  static sign(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hashData(transaction.outputs)),
    };
  }

  static reward(minerWallet, rewardSystemWallet) {
    const rewardOutput = {
      amount: MINING_REWARD,
      address: minerWallet.publicKey,
    };

    return this.getWithOutputs(rewardSystemWallet, [rewardOutput]);
  }

  static isTransactionValid(transaction) {
    const { address, signature } = transaction.input;

    return isSignatureValid(address, signature, hashData(transaction.outputs));
  }

  static getWithOutputs(senderWallet, outputs) {
    const transaction = new Transaction();
    transaction.outputs.push(...outputs);
    Transaction.sign(transaction, senderWallet);

    return transaction;
  }
}

module.exports = Transaction;
