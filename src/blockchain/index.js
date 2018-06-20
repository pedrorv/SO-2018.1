const fs = require('fs');
const Block = require('../block');
const { INITIAL_BALANCE, MINING_REWARD, BACKUP_CHAIN_FREQUENCY } = require('../constants');
const { isProduction } = require('../utilities');

const BLOCKCHAIN_PATH = './src/blockchain/blockchain.json';

const saveChain = (chain) => {
  fs.writeFileSync(BLOCKCHAIN_PATH, JSON.stringify(chain));
};

const loadChain = () => JSON.parse(fs.readFileSync(BLOCKCHAIN_PATH));

class Blockchain {
  constructor() {
    const shouldLoadChain = isProduction() && fs.existsSync(BLOCKCHAIN_PATH);

    this.chain = shouldLoadChain ? loadChain() : [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];

    const block = Block.mine(lastBlock, data);
    this.chain.push(block);

    if (this.chain.length % BACKUP_CHAIN_FREQUENCY === 0) {
      saveChain(this.chain);
    }

    console.log(`
      Bloco adicionado:
      ${block.toString()}
    `);

    return block;
  }

  isChainValid(chain) {
    const listBlocks = chain.map(b => b.hash);

    return chain.every((block, index) => {
      if (index === 0) {
        return JSON.stringify(chain[0]) === JSON.stringify(Block.genesis());
      }

      if (!listBlocks.includes(block.hash) && block.data.length > 0) {
        const transactions = block.data;
        const rewardsCount = transactions.filter(t => t.isReward).length;

        if (rewardsCount !== 1) {
          return false;
        }

        if (
          !transactions.reduce((acc, t) => {
            if (
              t.input.amount !== this.getBalance(t.input.address, t.input.timestamp) &&
              !t.isReward
            ) {
              return acc && false;
            }

            if (t.isReward && t.input.amount !== MINING_REWARD) {
              return acc && false;
            }

            if (t.input.amount !== t.outputs.reduce((sum, o) => sum + o.amount, 0)) {
              return acc && false;
            }

            return acc && true;
          }, true)
        ) {
          return false;
        }
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
    const newChainDifficulty = newChain.reduce(
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

  getBalance(address, currentTimestamp = new Date()) {
    let balance;
    const transactions = this.chain.reduce((acc, block) => [...acc, ...block.data], []);
    const tempestiveTransactions = transactions.filter(t => t.input.timestamp < currentTimestamp);
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
