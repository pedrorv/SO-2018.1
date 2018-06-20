const fs = require('fs');
const { isProduction } = require('./utilities');

const PEERS_PATH = './src/nodes.json';

class Peers {
  constructor() {
    this.peers = process.env.PEERS
      ? process.env.PEERS.split(',')
      : !isProduction()
        ? []
        : JSON.parse(fs.readFileSync(PEERS_PATH)).map(n => `ws://${n}:${process.env.P2P_PORT}`);
  }

  getAll() {
    return this.peers;
  }

  store(peer) {
    const shouldStorePeer = !this.peers.find(p => p === peer) && peer !== '::1';

    if (shouldStorePeer) {
      fs.writeFileSync(PEERS_PATH, JSON.stringify([...this.peers, peer]));
      console.log('Lista de nós conhecidos foi atualizada.');
    }
  }
}

module.exports = new Peers();
