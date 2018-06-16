const EC = require('elliptic').ec;
const uuid = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

const ec = new EC('secp256k1');
const genKeyPair = () => ec.genKeyPair();
const genKeyPairFromPrivate = privateKey => ec.keyFromPrivate(privateKey, 'hex');
const genUniqueId = () => uuid();
const hashData = data => SHA256(JSON.stringify(data)).toString();
const isSignatureValid = (publicKey, signature, dataHash) =>
  ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
const isProduction = () => process.env.NODE_ENV === 'production';

module.exports = {
  genKeyPair,
  genKeyPairFromPrivate,
  genUniqueId,
  hashData,
  isSignatureValid,
  isProduction,
};
