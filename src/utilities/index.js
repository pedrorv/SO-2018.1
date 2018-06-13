const EC = require('elliptic').ec;
const uuid = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

const ec = new EC('secp256k1');
const genKeyPair = () => ec.genKeyPair();
const genUniqueId = () => uuid();
const hashData = data => SHA256(JSON.stringify(data)).toString();

module.exports = {
  genKeyPair,
  genUniqueId,
  hashData,
};
