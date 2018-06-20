const fs = require('fs');
const { isProduction } = require('./utilities');

const PEERS_PATH = './src/nodes.json';

class Peers {
  constructor() {
    this.peers = process.env.PEERS
      ? process.env.PEERS.split(',')
      : !isProduction()
        ? []
        : JSON.parse(fs.readFileSync(PEERS_PATH));
  }

  getAll() {
    return this.peers;
  }

  getAllHosts() {
    return this.getAll().map(peerIp => `ws://${peerIp}:${process.env.P2P_PORT}`);
  }

  store(peer) {
    const shouldStorePeer = !this.peers.find(p => p === peer) && peer !== '::1';

    if (shouldStorePeer) {
      const newPeers = [...this.peers, peer];
      this.peers = newPeers;

      savePeers(newPeers);
      console.log(`Lista de nós conhecidos foi atualizada. Novo nó: ${peer}.`);
    }
  }

  storeAll(peersList) {
    const newPeers = [...new Set([...peersList, ...this.peers])];
    this.peers = newPeers;

    savePeers(newPeers);
    console.log('Lista de nós conhecidos foi atualizada.');
  }
}

const savePeers = (peersList) => {
  fs.writeFileSync(PEERS_PATH, JSON.stringify(peersList));
};

module.exports = new Peers();
