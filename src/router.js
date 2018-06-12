const express = require('express');
const blockchain = require('./serverBlockchain');

module.exports = (p2p) => {
  const router = express.Router();

  router.get('/blocos', (req, res) => {
    res.json(blockchain.chain);
  });

  router.post('/minerar', (req, res) => {
    blockchain.addBlock(req.body.data);

    p2p.syncChains();

    res.redirect('blocos');
  });

  return router;
};
