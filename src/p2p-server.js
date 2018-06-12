const WS = require('ws');

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
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
      const chain = JSON.parse(message);
      this.blockchain.replaceChain(chain);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }
}

module.exports = P2PServer;
