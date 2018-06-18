import React, { Component } from 'react';
import APIService from '../services/api';
import BootstrapTable from 'react-bootstrap-table-next';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionKey: '',
      transactionAmount: '',
      transactionError: '',
      transactionSuccess: '',
      loadingTransaction: false,
      transactions: [],
      loadingTransactionList: false,
    };

    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.makeTransaction = this.makeTransaction.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }

  handleKeyChange(event) {
    this.setState({
      transactionKey: event.target.value,
      transactionError: '',
      transactionSuccess: '',
    });
  }

  handleAmountChange(event) {
    this.setState({
      transactionAmount: event.target.value,
      transactionError: '',
      transactionSuccess: '',
    });
  }

  makeTransaction() {
    this.setState({ loadingTransaction: true, transactionError: '', transactionSuccess: '' });
    const { transactionKey, transactionAmount } = this.state;

    APIService.makeTransaction(transactionKey, parseFloat(transactionAmount) || 0).then((transfer) => {
      const loadingTransaction = false;

      if (transfer.message) {
        this.setState({ loadingTransaction, transactionError: transfer.message });
      } else {
        this.setState({
          loadingTransaction,
          transactionSuccess: 'Transação realizada com sucesso',
        });
      }
    });

    this.getTransactions();
  }

  getTransactions() {
    this.setState({ loadingTransactionList: true });

    APIService.getTransactions().then((transactionsData) => {
      const transactions = transactionsData.message ? transactionsData.message : transactionsData;

      this.setState({ transactions, loadingTransactionList: false });
    });
  }

  render() {
    const {
      transactionKey,
      transactionAmount,
      transactionError,
      transactionSuccess,
      loadingTransaction,
      transactions,
      loadingTransactionList,
    } = this.state;

    const transactionList = transactions
      .map(t =>
        t.outputs.filter(o => o.address !== t.input.address).map(o => ({
          id: t.id,
          from: t.input.address,
          to: o.address,
          amount: o.amount,
        })))
      .reduce((acc, cur) => [...acc, ...cur], []);

    const columns = [
      {
        dataField: 'id',
        text: 'ID',
      },
      {
        dataField: 'from',
        text: 'De',
      },
      {
        dataField: 'to',
        text: 'Para',
      },
      {
        dataField: 'amount',
        text: 'Valor',
      },
    ];

    const options = {
      noDataText: 'Your_custom_text',
    };

    return (
      <section style={{ marginTop: '25px' }}>
        <h1 className="has-text-grey-dark is-size-3">Transações</h1>
        <h2 className="has-text-grey-dark is-size-4">Realizar transação</h2>
        <main className="columns is-multiline">
          <div className="column is-three-quarters">
            <div className="field is-vertical">
              <div className="field-label is-normal">
                <label className="label has-text-left">Endereço do destinatário</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      value={transactionKey}
                      placeholder="abb3f80f24aa302..."
                      onChange={this.handleKeyChange}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field is-vertical">
              <div className="field-label is-normal">
                <label className="label has-text-left">Quantia</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input"
                      type="number"
                      value={transactionAmount}
                      placeholder="0"
                      onChange={this.handleAmountChange}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-three-quarters">
            <button
              className={`button is-info ${loadingTransaction ? 'is-loading' : ''}`}
              disabled={loadingTransaction || !transactionKey}
              onClick={this.makeTransaction}
            >
              Enviar
            </button>
          </div>
          {transactionSuccess && (
            <div className="column is-three-quarters">
              <p className="has-text-info">{transactionSuccess}</p>
            </div>
          )}
          {transactionError && (
            <div className="column is-three-quarters">
              <p className="has-text-danger">{transactionError}</p>
            </div>
          )}
          <div className="column is-three-quarters">
            <h2 className="has-text-grey-dark is-size-4">Pool de transações</h2>
          </div>

          <BootstrapTable
            keyField="id"
            data={transactionList}
            options={options}
            columns={columns}
            bordered={false}
            id={'transactionsTable'}
            striped
          />

          <div className="column is-three-quarters">
            <button
              className={`button is-info ${loadingTransactionList ? 'is-loading' : ''}`}
              disabled={loadingTransactionList}
              onClick={this.getTransactions}
            >
              Atualizar
            </button>
          </div>
        </main>
      </section>
    );
  }
}

export default Transaction;
