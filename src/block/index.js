const sha256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `
    Bloco

      Criado em:      ${this.timestamp}
      Bloco anterior: ${this.lastHash}
      Hash:           ${this.hash}
      Dados:          ${this.data}
    `;
  }

  static genesis() {
    const timestamp = null;
    const lastHash = null;
    const data = 'Genesis';
    const hash = Block.hash(timestamp, lastHash, data);

    return new Block(timestamp, lastHash, hash, data);
  }

  static getBlockHash(block) {
    const { timestamp, lastHash, data } = block;

    return Block.hash(timestamp, lastHash, data);
  }

  static hash(timestamp, lastHash, data) {
    return sha256(`${timestamp}-${lastHash}-${data}`).toString();
  }

  static mine(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new Block(timestamp, lastHash, hash, data);
  }
}

module.exports = Block;
