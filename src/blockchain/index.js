const Block = require('../block');

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
    return chain.every((block, index) => {
      if (index === 0) {
        return JSON.stringify(chain[0]) === JSON.stringify(Block.genesis());
      }

      const lastBlock = chain[index - 1];

      return (
        block.lastHash === lastBlock.hash &&
        block.hash === Block.getBlockHash(block)
      );
    });
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
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
}

module.exports = Blockchain;
