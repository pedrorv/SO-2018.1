const { MINING_REWARD } = require('../constants');
const { genUniqueId, hashData, isSignatureValid } = require('../utilities');

class Transaction {
  constructor() {
    this.id = genUniqueId();
    this.input = null;
    this.outputs = [];
    this.isReward = false;
  }

  static update(transaction, senderWallet, recipient, amount) {
    const senderOutput = transaction.outputs.find(o => o.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Valor da transação excede o saldo da carteira. Saldo: ${
        senderOutput.amount
      }; Valor: ${amount}.`);
      return null;
    }

    senderOutput.amount -= amount;
    const recipientOutput = { amount, address: recipient };
    transaction.outputs.push(recipientOutput);
    Transaction.sign(transaction, senderWallet);

    return transaction;
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
    const t = this.getWithOutputs(rewardSystemWallet, [rewardOutput]);
    t.isReward = true;
    return t;
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
