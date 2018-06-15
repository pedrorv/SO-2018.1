const Block = require('../block');
const { BASE_DIFFICULTY } = require('../constants');

describe('Classe Block', () => {
  let data;
  let lastBlock;
  let block;

  beforeEach(() => {
    data = 'Dados do bloco';
    lastBlock = Block.genesis();
    block = Block.mine(lastBlock, data);
  });

  describe('construtor', () => {
    it('bloco deve ter a estrutura de dados correta', () => {
      expect(testBlockDataStructure(block)).toBe(true);
    });
  });

  describe('método genesis', () => {
    it('bloco genesis deve ter a estrutura de dados correta', () => {
      expect(testGenesisBlockDataStructure(Block.genesis())).toBe(true);
    });
  });

  describe('método getBlockHash', () => {
    it('dado um bloco, deve retornar seu hash corretamente', () => {
      expect(Block.getBlockHash(block)).toBe(block.hash);
    });
  });

  describe('método mine', () => {
    it('dados do bloco minerado devem ser iguais aos dados passados', () => {
      expect(block.data).toEqual(data);
    });

    it('bloco anterior deve estar correto', () => {
      expect(block.lastHash).toEqual(lastBlock.hash);
    });
  });

  describe('método hashHasRightDifficulty', () => {
    it('dada uma hash deve verificar se a mesma possui a dificuldade correta', () => {
      expect(Block.hashHasRightDifficulty('000ab123a1298abfe', 3)).toBe(true);
      expect(Block.hashHasRightDifficulty('000ab123a1298abfe', 4)).toBe(false);
    });
  });
});

const testBlockDataStructure = block =>
  typeof block.timestamp === 'number' &&
  typeof block.lastHash === 'string' &&
  typeof block.hash === 'string' &&
  typeof block.data === 'string' &&
  typeof block.difficulty === 'number' &&
  typeof block.nonce === 'number';

const testGenesisBlockDataStructure = genesis =>
  genesis.timestamp === null &&
  genesis.lastHash === null &&
  typeof genesis.hash === 'string' &&
  Array.isArray(genesis.data) &&
  genesis.difficulty === BASE_DIFFICULTY &&
  genesis.nonce === 0;
