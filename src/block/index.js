const sha256 = require('crypto-js/sha256');
const { BASE_DIFFICULTY, MINE_RATE } = require('../constants');

class Block {
  constructor(timestamp, lastHash, hash, data, difficulty = BASE_DIFFICULTY, nonce = 0) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  toString() {
    return `
    Bloco

      Criado em:      ${this.timestamp}
      Bloco anterior: ${this.lastHash}
      Hash:           ${this.hash}
      Dificuldade:    ${this.difficulty}
      Nonce:          ${this.nonce}
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
    const {
      timestamp, lastHash, data, difficulty, nonce,
    } = block;

    return Block.hash(timestamp, lastHash, data, difficulty, nonce);
  }

  static hash(timestamp, lastHash, data, difficulty, nonce) {
    return sha256(`${timestamp}-${lastHash}-${data}-${difficulty}-${nonce}`).toString();
  }

  static mine(lastBlock, data) {
    const { hash: lastHash } = lastBlock;
    let nonce = 0;
    let difficulty;
    let hash;
    let timestamp;

    do {
      nonce += 1;
      timestamp = Date.now();
      difficulty = Block.getBlockDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, difficulty, nonce);
    } while (!Block.hashHasRightDifficulty(hash, difficulty));

    return new Block(timestamp, lastHash, hash, data, difficulty, nonce);
  }

  static hashHasRightDifficulty(hash, difficulty) {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }

  static getBlockDifficulty(lastBlock, currentTime) {
    const { difficulty, timestamp } = lastBlock;

    return timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
  }
}

module.exports = Block;
