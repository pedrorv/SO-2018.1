const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const appRouter = require('./router');
const config = require('./config');
const P2PServer = require('./p2p-server');
const { blockchain, transactionPool, wallet } = require('./instances');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || config.HTTP_PORT;
const P2P_PORT = process.env.P2P_PORT || config.P2P_PORT;
const HOST = process.env.HOST || 'localhost';

const app = express();
const p2p = new P2PServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2p);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/dist/public')));

app.use('/api', appRouter(p2p, miner));
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '/dist/index.html')));

app.listen(HTTP_PORT, console.log(`Servidor http rodando na porta ${HTTP_PORT}`));
p2p.listen(P2P_PORT, HOST, console.log(`Servidor p2p rodando na porta ${P2P_PORT}`));

process.on('uncaughtException', () => console.log(''));
