const express = require('express');
const bodyParser = require('body-parser');
const blockchainRouter = require('./router');
const config = require('./config');
const P2PServer = require('./p2p-server');
const blockchain = require('./serverBlockchain');

const HTTP_PORT = process.env.HTTP_PORT || config.HTTP_PORT;
const P2P_PORT = process.env.P2P_PORT || config.P2P_PORT;

const app = express();
const p2p = new P2PServer(blockchain);

app.use(bodyParser.json());
app.use('/blockchain', blockchainRouter);

app.listen(HTTP_PORT, console.log(`Servidor rodando na porta ${HTTP_PORT}`));
p2p.listen(P2P_PORT, console.log(`Servidor p2p rodando na porta ${P2P_PORT}`));

module.exports = {
  app,
  p2p,
};
