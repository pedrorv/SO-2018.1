const express = require('express');
const blockchain = require('./serverBlockchain');

const router = express.Router();

router.get('/blocos', (req, res) => {
  res.json(blockchain.chain);
});

router.post('/minerar', (req, res) => {
  blockchain.addBlock(req.body.data);

  res.redirect('blocos');
});

module.exports = router;
