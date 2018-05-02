const express = require("express");
const bodyParser = require("body-parser");
const blockchainRouter = require("./router");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use("/blockchain", blockchainRouter);

app.listen(PORT, console.log(`Servidor rodando na porta ${PORT}`));
