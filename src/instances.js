const Blockchain = require('./blockchain');
const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');

module.exports = {
  blockchain: new Blockchain(),
  wallet: new Wallet(),
  transactionPool: new TransactionPool(),
};
