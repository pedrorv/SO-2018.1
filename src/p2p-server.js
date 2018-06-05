const WS = require('ws');

const peers = [];

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
  }
}

module.exports = P2PServer;
