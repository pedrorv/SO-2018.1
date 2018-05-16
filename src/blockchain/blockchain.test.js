const Blockchain = require('../blockchain');
const Block = require('../block');

describe('Classe Blockchain', () => {
  let blockchain1;
  let blockchain2;
  const blockData1 = 'bloco 1';
  const blockData2 = 'bloco 2';

  beforeEach(() => {
    blockchain1 = new Blockchain();
    blockchain2 = new Blockchain();
  });

  describe('construtor', () => {
    it('blockchain deve ter a estrutura de dados correta', () => {
      expect(testBlockchainDataStructure(blockchain1)).toBe(true);
    });

    it('blockchain deve começar com o bloco genesis', () => {
      expect(blockchain1.chain[0]).toEqual(Block.genesis());
    });
  });

  describe('método addBlock', () => {
    it('deve adicionar novo bloco à blockchain', () => {
      const data = 'dados do novo bloco';
      blockchain1.addBlock(data);
      const lastBlock = blockchain1.chain[blockchain1.chain.length - 1];

      expect(blockchain1.chain.length).toBe(2);
      expect(lastBlock.data).toBe(data);
    });
  });

  describe('método isChainValid', () => {
    it('deve invalidar blockchain com bloco genesis modificado', () => {
      blockchain1.chain[0].data = 'Não-Genesis';

      expect(blockchain2.isChainValid(blockchain1.chain)).toBe(false);
    });

    it('deve invalidar blockchain com bloco diferente do genesis modificado', () => {
      blockchain1.addBlock(blockData1);
      blockchain1.chain[1].data = blockData2;

      expect(blockchain2.isChainValid(blockchain1.chain)).toBe(false);
    });

    it('deve validar blockchain válida', () => {
      blockchain1.addBlock(blockData1);

      expect(blockchain2.isChainValid(blockchain1.chain)).toBe(true);
    });
  });

  describe('método replaceChain', () => {
    it('deve substituir blockchain por uma maior e válida', () => {
      blockchain1.addBlock(blockData1);
      blockchain2.replaceChain(blockchain1.chain);

      expect(blockchain2.chain).toBe(blockchain1.chain);
    });

    it('não deve substituir blockchain por uma menor', () => {
      blockchain1.addBlock(blockData1);
      blockchain1.replaceChain(blockchain2.chain);

      expect(blockchain1.chain).not.toBe(blockchain2.chain);
    });

    it('não deve substituir blockchain por uma inválida', () => {
      blockchain1.addBlock(blockData1);
      blockchain1.chain[1].data = blockData2;
      blockchain2.replaceChain(blockchain1.chain);

      expect(blockchain2.chain).not.toBe(blockchain1.chain);
    });
  });
});

const testBlockchainDataStructure = blockchain => Array.isArray(blockchain.chain);
