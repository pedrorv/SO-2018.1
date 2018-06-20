const Transaction = require('../transaction');
const Wallet = require('../wallet');
const { hashData } = require('../utilities');
const { MINING_REWARD } = require('../constants');

describe('Classe Transaction', () => {
  let wallet;
  let recipient;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 10;
    recipient = 'destinatário';
  });

  describe('construtor', () => {
    it('transação deve ter a estrutura de dados correta', () => {
      const transaction = new Transaction();

      expect(testTransactionDataStructure(transaction)).toBe(true);
    });
  });

  describe('método create', () => {
    let transaction;

    beforeEach(() => {
      transaction = Transaction.create(wallet, recipient, amount);
    });

    it('adiciona às saídas da transação a quantia enviada subtraída do saldo da carteira', () => {
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('adiciona às saídas da transação a quantia enviada ao destinatário', () => {
      expect(transaction.outputs.find(o => o.address === recipient).amount).toEqual(amount);
    });

    it('não cria a transação caso a quantia enviada exceda o saldo da carteira', () => {
      const invalidTransaction = Transaction.create(wallet, recipient, 1000000);
      expect(invalidTransaction).toEqual(null);
    });
  });

  describe('método sign', () => {
    it('transação deve ser assinada pela carteira criadora da transação', () => {
      const transaction = new Transaction();
      Transaction.sign(transaction, wallet);

      expect(transaction.input).not.toEqual(null);
      expect(transaction.input.signature).toEqual(wallet.sign(hashData(transaction.outputs)));
    });
  });

  describe('método update', () => {
    let transaction;
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      transaction = Transaction.create(wallet, recipient, amount);
      nextAmount = amount * 2;
      nextRecipient = `próximo ${recipient}`;
      transaction = Transaction.update(transaction, wallet, nextRecipient, nextAmount);
    });

    it('atualiza a saída da transação subtraindo a próxima quantia da carteira criadora da transação', () => {
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('adiciona às saídas da transação a próxima quantia enviada ao próximo destinatário', () => {
      expect(transaction.outputs.find(o => o.address === nextRecipient).amount).toEqual(nextAmount);
    });
  });

  describe('método isTransactionValid', () => {
    let transaction;

    beforeEach(() => {
      transaction = Transaction.create(wallet, recipient, amount);
    });

    it('valida uma transação válida', () => {
      expect(Transaction.isTransactionValid(transaction)).toBe(true);
    });

    it('invalida uma transação que foi alterada', () => {
      transaction.outputs[0].amount = amount * 5;
      expect(Transaction.isTransactionValid(transaction)).toBe(false);
    });
  });

  describe('método reward', () => {
    let transaction;

    beforeEach(() => {
      transaction = Transaction.reward(wallet, Wallet.rewardWallet());
    });

    it('cria uma transação de recompensa para uma carteira', () => {
      expect(Transaction.isTransactionValid(transaction)).toBe(true);
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
    });
  });
});

const testTransactionDataStructure = transaction =>
  Array.isArray(transaction.outputs) &&
  typeof transaction.id === 'string' &&
  typeof transaction.input === 'object';
