const Transaction = require('../transaction');
const { genKeyPair } = require('../utilities');
const { INITIAL_BALANCE, MINING_REWARD } = require('../constants');

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

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.getBalance(blockchain);

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

  getBalance(blockchain) {
    let { balance } = this;
    const transactions = blockchain.chain.reduce((acc, block) => [...acc, ...block.data], []);
    const walletInputs = transactions.filter(t => t.input.address === this.publicKey);
    let mostRecentTimestamp = 0;

    if (walletInputs.length) {
      const mostRecentInput = walletInputs.reduce((acc, cur) => (acc.input.timestamp > cur.input.timestamp ? acc : cur));

      balance = mostRecentInput.outputs.find(o => o.address === this.publicKey).amount;
      mostRecentTimestamp = mostRecentInput.input.timestamp;
    }

    return transactions.reduce((acc, t) => {
      if (t.input.timestamp > mostRecentTimestamp) {
        return (
          acc +
          t.outputs.reduce((sum, o) => (o.address === this.publicKey ? sum + o.amount : sum), 0)
        );
      }

      return acc;
    }, balance);
  }

  static rewardWallet() {
    const rewardWallet = new Wallet();
    rewardWallet.balance = MINING_REWARD;

    return rewardWallet;
  }
}

module.exports = Wallet;
