import axios from 'axios';

class APIService {
  call(url, method = 'GET', data = null) {
    const fullUrl = `api/${url}`;

    return axios({
      method,
      url: fullUrl,
      data,
    });
  }

  getBalance() {
    return this.call('saldo')
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar seu saldo.' }));
  }

  getPublicKey() {
    return this.call('chave-publica')
      .then(res => res.data)
      .catch(() =>
        Promise.resolve({ message: 'Ocorreu um erro inesperado ao carregar sua chave pública.' }));
  }
}

export default new APIService();
