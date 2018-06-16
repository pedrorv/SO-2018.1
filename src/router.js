const express = require('express');
const { blockchain, wallet, transactionPool } = require('./instances');

module.exports = (p2p, miner) => {
  const router = express.Router();

  router.get('/blocos', (req, res) => {
    res.json(blockchain.chain);
  });

  router.get('/blocos/:hash', (req, res) => {
    const block = blockchain.chain.find(b => b.hash === req.params.hash);
    res.json(block || { message: 'Bloco não encontrado.' });
  });

  router.get('/transacoes', (req, res) => {
    res.json(transactionPool.transactions);
  });

  router.get('/transacoes/:id', (req, res) => {
    const transaction = transactionPool.transactions.find(t => t.id === req.params.id);
    res.json(transaction || { message: 'Transação não encontrada.' });
  });

  router.post('/transacao', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);

    if (transaction.message) {
      res.json(transaction);
      return;
    }

    p2p.broadcastTransaction(transaction);

    res.redirect('/transacoes');
  });

  router.get('/chave-publica', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
  });

  router.get('/saldo', (req, res) => {
    res.json({ balance: wallet.getBalance(blockchain) });
  });

  router.get('/minerar-transacoes', (req, res) => {
    miner.mine();

    res.redirect('/blocos');
  });

  return router;
};
