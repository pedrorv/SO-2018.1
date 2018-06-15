const express = require('express');
const { blockchain, wallet, transactionPool } = require('./instances');

module.exports = (p2p, miner) => {
  const router = express.Router();

  router.get('/blocos', (req, res) => {
    res.json(blockchain.chain);
  });

  router.get('/transacoes', (req, res) => {
    res.json(transactionPool.transactions);
  });

  router.post('/transacao', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
    p2p.broadcastTransaction(transaction);

    res.redirect('/transacoes');
  });

  router.get('/chave-publica', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
  });

  router.get('/minerar-transacoes', (req, res) => {
    miner.mine();

    res.redirect('/blocos');
  });

  return router;
};
