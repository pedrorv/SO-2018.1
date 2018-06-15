const Wallet = require('../wallet');
const TransactionPool = require('../transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../constants');

describe('Classe Wallet', () => {
  let wallet;
  let tp;
  let bc;

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
      bc = new Blockchain();
      amount = 10;
      recipient = 'destinatário';
      transaction = wallet.createTransaction(recipient, amount, bc, tp);
    });

    it('cria uma transação a partir de uma carteira', () => {
      expect(transaction).not.toEqual(null);
    });

    it('dobra a quantia enviada e subtrai do saldo da carteira ao repetir transação', () => {
      wallet.createTransaction(recipient, amount, bc, tp);
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(wallet.balance - amount * 2);
    });

    it('cria uma nova saída na transação ao destinatário ao repetir transação', () => {
      wallet.createTransaction(recipient, amount, bc, tp);
      expect(transaction.outputs.filter(o => o.address === recipient).map(o => o.amount)).toEqual([
        amount,
        amount,
      ]);
    });
  });

  describe('método getBalance', () => {
    let amount;
    let repeat;
    let senderWallet;

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
      expect(wallet.getBalance(bc)).toEqual(INITIAL_BALANCE + amount * repeat);
    });

    it('deve calcular corretamente o saldo do remetente após as transações', () => {
      expect(senderWallet.getBalance(bc)).toEqual(INITIAL_BALANCE - amount * repeat);
    });

    it('deve calcular corretamente após novas transações de ambos', () => {
      const recipientTransferAmount = 30;
      const senderTransferAmount = 40;
      const recipientBalance = wallet.getBalance(bc);

      tp.clear();
      wallet.createTransaction(senderWallet.publicKey, recipientTransferAmount, bc, tp);
      bc.addBlock(tp.transactions);
      tp.clear();
      senderWallet.createTransaction(wallet.publicKey, senderTransferAmount, bc, tp);
      bc.addBlock(tp.transactions);

      expect(wallet.getBalance(bc)).toEqual(recipientBalance - recipientTransferAmount + senderTransferAmount);
    });
  });
});

const testWalletDataStructure = wallet =>
  typeof wallet.balance === 'number' &&
  typeof wallet.keyPair === 'object' &&
  typeof wallet.publicKey === 'string';
