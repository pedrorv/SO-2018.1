const express = require('express');
const { blockchain, wallet, transactionPool } = require('./instances');

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

  router.get('/transacoes', (req, res) => {
    res.json(transactionPool.transactions);
  });

  router.post('/transacao', (req, res) => {
    const { recipient, amount } = req.body;
    wallet.createTransaction(recipient, amount, transactionPool);

    res.redirect('/transacoes');
  });

  router.get('/chave-publica', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
  });

  return router;
};
