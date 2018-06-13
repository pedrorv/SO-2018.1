const Transaction = require('../transaction');
const Wallet = require('../wallet');
const { hashData } = require('../utilities');

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
});

const testTransactionDataStructure = transaction =>
  Array.isArray(transaction.outputs) &&
  typeof transaction.id === 'string' &&
  typeof transaction.input === 'object';
