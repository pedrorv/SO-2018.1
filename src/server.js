const express = require('express');
const bodyParser = require('body-parser');
const appRouter = require('./router');
const config = require('./config');
const P2PServer = require('./p2p-server');
const { blockchain, transactionPool, wallet } = require('./instances');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || config.HTTP_PORT;
const P2P_PORT = process.env.P2P_PORT || config.P2P_PORT;

const app = express();
const p2p = new P2PServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2p);

app.use(bodyParser.json());
app.use(appRouter(p2p, miner));

app.listen(HTTP_PORT, console.log(`Servidor http rodando na porta ${HTTP_PORT}`));
p2p.listen(P2P_PORT, console.log(`Servidor p2p rodando na porta ${P2P_PORT}`));
