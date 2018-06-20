const TransactionPool = require('../transaction-pool');
const Transaction = require('../transaction');
const Wallet = require('../wallet');
const Blockchain = require('../blockchain');

describe('Classe TransactionPool', () => {
  describe('construtor', () => {
    it('transaction pool deve ter a estrutura de dados correta', () => {
      const tp = new TransactionPool();
      expect(testTransactionPoolDataStructure(tp)).toBe(true);
    });
  });

  let tp;
  let wallet;
  let transaction;
  let bc;
  const recipient = 'destinatário';
  const amount = 10;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction(recipient, amount, bc, tp);
    tp.addOrUpdateTransaction(transaction);
  });

  describe('método addOrUpdateTransaction', () => {
    const nextRecipient = `próximo ${recipient}`;
    const nextAmount = amount * 2;

    it('adiciona uma transação nova à transaction pool', () => {
      expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('atualiza uma transação já existente na transaction pool', () => {
      const oldTransaction = JSON.stringify(transaction);
      const newTransaction = Transaction.update(transaction, wallet, nextRecipient, nextAmount);
      tp.addOrUpdateTransaction(newTransaction);

      expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });
  });

  describe('método clear', () => {
    it('limpa todas as transações de uma transaction pool', () => {
      tp.clear();
      expect(tp.transactions).toEqual([]);
    });
  });

  describe('método getValidTransactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      let createTransactions = 6;

      while (createTransactions) {
        wallet = new Wallet();
        transaction = wallet.createTransaction(recipient, amount, bc, tp);

        if (createTransactions % 2 === 0) {
          transaction.input.amount = 1000000;
        } else {
          validTransactions.push(transaction);
        }

        createTransactions -= 1;
      }
    });

    it('há diferença entre as transações válidas e inválidas', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('retorna somente as transações válidas', () => {
      expect(tp.getValidTransactions()).toEqual(validTransactions);
    });
  });
});

const testTransactionPoolDataStructure = transactionPool =>
  Array.isArray(transactionPool.transactions);
