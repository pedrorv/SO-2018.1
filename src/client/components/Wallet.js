import React, { Component } from 'react';
import APIService from '../services/api';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: null, publicKey: null, loading: null };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });

    Promise.all([APIService.getPublicKey(), APIService.getBalance()]).then(([keyData, balanceData]) => {
      const publicKey = keyData.message ? keyData.message : keyData.publicKey;
      const balance = balanceData.message ? balanceData.message : `${balanceData.balance} moedas`;

      this.setState({ balance, publicKey, loading: false });
    });
  }

  render() {
    const { balance, publicKey, loading } = this.state;

    return (
      <section>
        <h1 className="has-text-grey-dark is-size-3">Carteira</h1>
        <main className="columns">
          <div className="column is-half">
            <h1 className="has-text-grey-dark is-size-4">Chave pública</h1>
            <h2 className="has-text-grey-grey is-size-5" style={{ wordWrap: 'break-word' }}>
              {loading ? 'Carregando sua chave...' : publicKey}
            </h2>
          </div>
          <div className="column is-half">
            <h1 className="has-text-grey-dark is-size-4">Saldo</h1>
            <h2 className="has-text-grey-grey is-size-5" style={{ wordWrap: 'break-word' }}>
              {loading ? 'Carregando seu saldo...' : balance}
            </h2>
          </div>
        </main>
      </section>
    );
  }
}

export default Wallet;
