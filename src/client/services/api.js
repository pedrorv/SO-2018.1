import axios from 'axios';

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
    return this.call('saldo', 'GET', null, { timeout: 3000 })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar seu saldo.' }));
  }

  getPublicKey() {
    return this.call('chave-publica', 'GET', null, { timeout: 3000 })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar sua chave pública.' }));
  }

  makeTransaction(recipient, amount) {
    return this.call('transacao', 'POST', { recipient, amount }, { timeout: 5000 })
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao realizar a transação.' }));
  }
}

export default new APIService();
