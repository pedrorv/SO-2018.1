const express = require("express");
const Blockchain = require("./blockchain");

const router = express.Router();
const blockchain = new Blockchain();

router.get("/blocos", (req, res) => {
  res.json(blockchain.chain);
});

router.post("/minerar", (req, res) => {
  blockchain.addBlock(req.body.data);

  res.redirect("blocos");
});

module.exports = router;
