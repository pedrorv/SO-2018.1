const { genKeyPair } = require('../utilities');
const { INITIAL_BALANCE } = require('../constants');

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
}

module.exports = Wallet;
