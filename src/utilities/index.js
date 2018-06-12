const EC = require('elliptic').ec;
const uuid = require('uuid/v1');

const ec = new EC('secp256k1');
const genKeyPair = () => ec.genKeyPair();
const genUniqueId = () => uuid();

module.exports = {
  genKeyPair,
  genUniqueId,
};
