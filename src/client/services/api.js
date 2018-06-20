import axios from 'axios';

const { SECOND, MINUTE } = require('../../constants');

class APIService {
  call(url, method = 'GET', data = null, customOptions = {}) {
    const fullUrl = `api/${url}`;

    return axios({
      method,
      url: fullUrl,
      data,
      ...customOptions,
    });
  }

  getBalance() {
    return this.call('saldo', 'GET', null, { timeout: 15 * SECOND })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar seu saldo.' }));
  }

  getPublicKey() {
    return this.call('chave-publica', 'GET', null, { timeout: 3 * SECOND })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar sua chave pública.' }));
  }

  makeTransaction(recipient, amount) {
    return this.call('transacao', 'POST', { recipient, amount }, { timeout: 5 * SECOND })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao realizar a transação.' }));
  }

  getTransaction(transactionID) {
    return this.call('transacoes', 'GET', transactionID, { timeout: 10 * SECOND })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar a transação.' }));
  }

  getTransactions() {
    return this.call('transacoes', 'GET', null, { timeout: 3 * SECOND })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({
          message: 'Ocorreu um erro inesperado ao carregar a lista de transações.',
        }));
  }

  mine() {
    return this.call('minerar-transacoes', 'GET', null, { timeout: 5 * MINUTE })
      .then(res => res.data)
      .catch(() => Promise.resolve({ message: 'Ocorreu um erro inesperado ao minerar o bloco.' }));
  }

  getBlockchain() {
    return this.call('blocos', 'GET', null, { timeout: 15 * MINUTE })
      .then(res => res.data)
      .catch(() => Promise.resolve({ message: 'Ocorreu um erro inesperado ao minerar o bloco.' }));
  }
}

export default new APIService();
