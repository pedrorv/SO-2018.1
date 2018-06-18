const fs = require('fs');
const Transaction = require('../transaction');
const { genKeyPair, isProduction, genKeyPairFromPrivate } = require('../utilities');
const { INITIAL_BALANCE, MINING_REWARD } = require('../constants');

const KEY_PATH = './src/wallet/wallet.json';

class Wallet {
  constructor() {
    let privateKey;

    if (isProduction() && fs.existsSync(KEY_PATH)) {
      privateKey = JSON.parse(fs.readFileSync(KEY_PATH)).key;
    }

    this.balance = INITIAL_BALANCE;
    this.keyPair = privateKey ? genKeyPairFromPrivate(privateKey) : genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');

    if (isProduction() && !privateKey) {
      const wallet = JSON.stringify({ key: this.keyPair.getPrivate().toString(16) });
      fs.writeFileSync(KEY_PATH, wallet);
    }
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

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = blockchain.getBalance(this.publicKey);   
    if (isNaN(amount))
    {
      console.log(`valor da transação inválido Valor: ${amount}`)
      return {
        message: `valor da transação inválido Valor: ${amount}`,
      };
    }
    amount = Number(amount)
    if (amount > this.balance) {
      console.log(`Valor da transação excede o saldo da carteira. Saldo: ${this.balance}; Valor: ${amount}.`);
      return {
        message: `Valor da transação excede o saldo da carteira. Saldo: ${
          this.balance
        }; Valor: ${amount}.`,
      };
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

  static rewardWallet() {
    const rewardWallet = new Wallet();
    rewardWallet.balance = MINING_REWARD;

    return rewardWallet;
  }
}

module.exports = Wallet;
