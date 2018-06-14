const WS = require('ws');

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGES = {
  SYNC_CHAINS: 'SYNC_CHAINS',
  BROADCAST_TRANSACTION: 'BROADCAST_TRANSACTION',
  CLEAR_TRANSACTIONS: 'CLEAR_TRANSACTIONS',
};

const syncChainsMessage = data => ({
  type: MESSAGES.SYNC_CHAINS,
  data,
});

const broadcastTransactionMessage = data => ({
  type: MESSAGES.BROADCAST_TRANSACTION,
  data,
});

const broadcastClearTransactionsMessage = () => ({ type: MESSAGES.CLEAR_TRANSACTIONS });

class P2PServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.transactionPool = transactionPool;
  }

  listen(port, callback) {
    const server = new WS.Server({ port }, callback);

    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WS(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.handleMessages(socket);
    this.sendChain(socket);
  }

  handleMessages(socket) {
    socket.on('message', (message) => {
      const { type, data } = JSON.parse(message);

      switch (type) {
        case MESSAGES.SYNC_CHAINS:
          return this.blockchain.replaceChain(data);
        case MESSAGES.BROADCAST_TRANSACTION:
          return this.transactionPool.addOrUpdateTransaction(data);
        case MESSAGES.CLEAR_TRANSACTIONS:
          return this.transactionPool.clear();
        default:
          return null;
      }
    });
  }

  dispatchMessage(socket, message) {
    socket.send(JSON.stringify(message));
  }

  sendChain(socket) {
    this.dispatchMessage(socket, syncChainsMessage(this.blockchain.chain));
  }

  sendTransaction(socket, transaction) {
    this.dispatchMessage(socket, broadcastTransactionMessage(transaction));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket =>
      this.dispatchMessage(socket, broadcastClearTransactionsMessage()));
  }
}

module.exports = P2PServer;
