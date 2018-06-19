const Blockchain = require('../blockchain');
const Block = require('../block');
const Wallet = require('../wallet');
const { INITIAL_BALANCE } = require('../constants');
const TransactionPool = require('../transaction-pool');

describe('Classe Blockchain', () => {
  let blockchain1;
  let blockchain2;
  let bc;
  let tp;
  const blockData1 = [];
  const blockData2 = {};

  beforeEach(() => {
    blockchain1 = new Blockchain();
    blockchain2 = new Blockchain();
    bc = new Blockchain();
    tp = new TransactionPool();
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

  describe('método getBalance', () => {
    let amount;
    let repeat;
    let senderWallet;
    let wallet;

    beforeEach(() => {
      wallet = new Wallet();
      senderWallet = new Wallet();
      amount = 10;
      repeat = 5;

      for (let i = 0; i < repeat; i += 1) {
        senderWallet.createTransaction(wallet.publicKey, amount, bc, tp);
      }

      bc.addBlock(tp.transactions);
    });

    it('deve calcular corretamente o saldo do destinatário após as transações', () => {
      expect(bc.getBalance(wallet.publicKey)).toEqual(INITIAL_BALANCE + amount * repeat);
    });

    it('deve calcular corretamente o saldo do remetente após as transações', () => {
      expect(bc.getBalance(senderWallet.publicKey)).toEqual(INITIAL_BALANCE - amount * repeat);
    });

    it('deve calcular corretamente após novas transações de ambos', () => {
      const recipientTransferAmount = 30;
      const senderTransferAmount = 40;
      const recipientBalance = bc.getBalance(wallet.publicKey);

      tp.clear();
      wallet.createTransaction(senderWallet.publicKey, recipientTransferAmount, bc, tp);
      bc.addBlock(tp.transactions);
      tp.clear();
      senderWallet.createTransaction(wallet.publicKey, senderTransferAmount, bc, tp);
      bc.addBlock(tp.transactions);

      expect(bc.getBalance(wallet.publicKey)).toEqual(recipientBalance - recipientTransferAmount + senderTransferAmount);
    });
  });
});

const testBlockchainDataStructure = blockchain => Array.isArray(blockchain.chain);
