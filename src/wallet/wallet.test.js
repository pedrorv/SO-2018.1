const Wallet = require('../wallet');
const TransactionPool = require('../transaction-pool');

describe('Classe Wallet', () => {
  let wallet;
  let tp;

  describe('constructor', () => {
    it('carteira deve ter a estrutura de dados correta', () => {
      expect(testWalletDataStructure(new Wallet())).toBe(true);
    });
  });

  describe('método createTransaction', () => {
    let transaction;
    let amount;
    let recipient;

    beforeEach(() => {
      wallet = new Wallet();
      tp = new TransactionPool();
      amount = 10;
      recipient = 'destinatário';
      transaction = wallet.createTransaction(recipient, amount, tp);
    });

    it('cria uma transação a partir de uma carteira', () => {
      expect(transaction).not.toEqual(null);
    });

    it('dobra a quantia enviada e subtrai do saldo da carteira ao repetir transação', () => {
      wallet.createTransaction(recipient, amount, tp);
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(wallet.balance - amount * 2);
    });

    it('cria uma nova saída na transação ao destinatário ao repetir transação', () => {
      wallet.createTransaction(recipient, amount, tp);
      expect(transaction.outputs.filter(o => o.address === recipient).map(o => o.amount)).toEqual([
        amount,
        amount,
      ]);
    });
  });
});

const testWalletDataStructure = wallet =>
  typeof wallet.balance === 'number' &&
  typeof wallet.keyPair === 'object' &&
  typeof wallet.publicKey === 'string';
