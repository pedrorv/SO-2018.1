const Block = require("../block");

describe("Classe Block", () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = "Dados do bloco";
    lastBlock = Block.genesis();
    block = Block.mine(lastBlock, data);
  });

  describe("construtor", () => {
    it("bloco deve ter a estrutura de dados correta", () => {
      expect(testBlockDataStructure(block)).toBe(true);
    });
  });

  describe("método genesis", () => {
    it("bloco genesis deve ter a estrutura de dados correta", () => {
      expect(testGenesisBlockStructure(Block.genesis())).toBe(true);
    });
  });

  describe("método getBlockHash", () => {
    it("dado um bloco, deve retornar seu hash corretamente", () => {
      expect(Block.getBlockHash(block)).toBe(block.hash);
    });
  });

  describe("método mine", () => {
    it("dados do bloco minerado devem ser iguais aos dados passados", () => {
      expect(block.data).toEqual(data);
    });

    it("bloco anterior deve estar correto", () => {
      expect(block.lastHash).toEqual(lastBlock.hash);
    });
  });
});

const testBlockDataStructure = block =>
  typeof block.timestamp === "number" &&
  typeof block.hash === "string" &&
  typeof block.lastHash === "string" &&
  typeof block.data === "string";

const testGenesisBlockStructure = genesis =>
  genesis.timestamp === null &&
  typeof genesis.hash === "string" &&
  genesis.lastHash === null &&
  typeof genesis.data === "string";
