const WS = require('ws');
const Peers = require('./peers');

const MESSAGES = {
  SYNC_CHAINS: 'SYNC_CHAINS',
  BROADCAST_TRANSACTION: 'BROADCAST_TRANSACTION',
  CLEAR_TRANSACTIONS: 'CLEAR_TRANSACTIONS',
  BROADCAST_PEERS: 'BROADCAST_PEERS',
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

const broadcastPeersMessage = () => ({
  type: MESSAGES.BROADCAST_PEERS,
  data: Peers.getAll(),
});

class P2PServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.transactionPool = transactionPool;
  }

  listen(port, host, callback) {
    const server = new WS.Server({ port, host }, callback);

    server.on('connection', (socket, req) => {
      this.connectSocket(socket);
      const socketIP = req.connection.remoteAddress;
      Peers.store(socketIP);
      this.broadcastPeers();
    });

    this.connectToPeers();
  }

  connectToPeers() {
    Peers.getAllHosts().forEach(peer => this.connectPeer(peer));
  }

  connectPeer(peer, tries = 0) {
    if (tries >= 5) return;

    setTimeout(() => {
      const socket = new WS(peer);
      socket.on('open', () => this.connectSocket(socket));
      socket.on('error', () => {
        const retryString =
          tries === 4
            ? `Nó ${peer} possivelmente fora do ar.`
            : 'Tentando novamente em 3 segundos...';

        console.log(`Erro ao conectar à ${peer}. Tentativa: ${tries + 1}.`, retryString);
        this.connectPeer(peer, tries + 1);
      });
      socket.on('close', () => this.removeConnection(socket));
    }, 3000 * tries);
  }

  removeConnection(socket) {
    this.sockets = this.sockets.filter(s => s !== socket);
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
        case MESSAGES.BROADCAST_PEERS:
          return Peers.storeAll(data);
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

  broadcastPeers() {
    this.sockets.forEach(socket => this.dispatchMessage(socket, broadcastPeersMessage()));
  }
}

module.exports = P2PServer;
