const Block = require('../block');
const { INITIAL_BALANCE, MINING_REWARD } = require('../constants');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mine(lastBlock, data);
    this.chain.push(block);

    console.log(`
    Bloco adicionado:
    ${block.toString()}
    `);

    return block;
  }

  isChainValid(chain) {
    const listBlocks = chain.reduce((acc, block) => [...acc, ...block.hash], []);
    const newBlockChain = new Blockchain();
    newBlockChain.chain = chain;
    return chain.every((block, index) => {
      if (index === 0) {
        return JSON.stringify(chain[0]) === JSON.stringify(Block.genesis());
      }

      // validar as transações dentro da blockchain
      // verificar se bloco está na blockchain atual
      // se não estiver verificar os saldos dos inputs [utilizar metodo blockchain.getBalance(blockchain, currenttimestamp = new Date())]
      // e se soma dos inputs bate com a soma dos outputs
      if (!listBlocks.includes(block.hash)) {
        const transactions = block.data;
        transactions.forEach((transaction) => {
          if (
            (transaction.input.amount !== newBlockChain.getBalance(transaction.input.address),
            transaction.input.timestamp)
          ) {
            return false;
          }
          if (
            transaction.input.amount != transaction.outputs.reduce((amt, o) => amt + o.amount, 0)
          ) {
            return false;
          }
        });
      }
      const lastBlock = chain[index - 1];
      return block.lastHash === lastBlock.hash && block.hash === Block.getBlockHash(block);
    });
  }

  replaceChain(newChain) {
    const actualChainDifficulty = this.chain.reduce(
      (acc, block) => acc + Math.pow(2, block.difficulty),
      0,
    );
    const newChainDifficulty = this.chain.reduce(
      (acc, block) => acc + Math.pow(2, block.difficulty),
      0,
    );

    if (newChainDifficulty <= actualChainDifficulty) {
      console.log('A nova blockchain não é maior que a blockchain atual.');
      return;
    }

    if (!this.isChainValid(newChain)) {
      console.log('A nova blockchain não é válida.');
      return;
    }

    console.log('Substituindo a blockchain atual pela nova blockchain.');
    this.chain = newChain;
  }

  getBalance(address, currenttimestamp = new Date()) {
    let balance;
    const transactions = this.chain.reduce((acc, block) => [...acc, ...block.data], []);
    const tempestiveTransactions = transactions.filter(t => t.input.timestamp < currenttimestamp);
    const walletInputs = transactions.filter(t => t.input.address === address);
    let mostRecentTimestamp = 0;
    balance = INITIAL_BALANCE;

    if (walletInputs.length) {
      const mostRecentInput = walletInputs.reduce((acc, cur) => (acc.input.timestamp > cur.input.timestamp ? acc : cur));

      balance = mostRecentInput.outputs.reduce(
        (sum, o) => (o.address === address ? sum + o.amount : sum),
        0,
      );

      mostRecentTimestamp = mostRecentInput.input.timestamp;
    }

    return tempestiveTransactions.reduce((acc, t) => {
      if (t.input.timestamp > mostRecentTimestamp) {
        return (
          acc + t.outputs.reduce((sum, o) => (o.address === address ? sum + o.amount : sum), 0)
        );
      }

      return acc;
    }, balance);
  }
}

module.exports = Blockchain;
