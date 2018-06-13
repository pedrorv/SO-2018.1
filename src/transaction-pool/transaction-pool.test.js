const TransactionPool = require('../transaction-pool');
const Transaction = require('../transaction');
const Wallet = require('../wallet');

describe('Classe TransactionPool', () => {
  describe('construtor', () => {
    it('transaction pool deve ter a estrutura de dados correta', () => {
      const tp = new TransactionPool();
      expect(testTransactionPoolDataStructure(tp)).toBe(true);
    });
  });

  describe('método addOrUpdateTransaction', () => {
    let tp;
    let wallet;
    let transaction;
    const recipient = 'destinatário';
    const amount = 10;
    const nextRecipient = `próximo ${recipient}`;
    const nextAmount = amount * 2;

    beforeEach(() => {
      tp = new TransactionPool();
      wallet = new Wallet();
      transaction = Transaction.create(wallet, recipient, amount);
      tp.addOrUpdateTransaction(transaction);
    });

    it('adiciona uma transação nova à transaction pool', () => {
      expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('atualiza uma transação já existente na transaction pool', () => {
      const oldTransaction = JSON.stringify(transaction);
      const newTransaction = transaction.update(wallet, nextRecipient, nextAmount);
      tp.addOrUpdateTransaction(newTransaction);

      expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });
  });
});

const testTransactionPoolDataStructure = transactionPool =>
  Array.isArray(transactionPool.transactions);
