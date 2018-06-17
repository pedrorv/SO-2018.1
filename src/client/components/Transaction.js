import React, { Component } from 'react';
import APIService from '../services/api';
import BootstrapTable from 'react-bootstrap-table-next';

if (!Array.prototype.last){
  Array.prototype.last = function(){
    if(this.length= 0)
      return this;
      return this[this.length - 1];
  };
};

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
      loadingTransactionList: false
    };

    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.makeTransaction = this.makeTransaction.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.getTransactions();
  }

  handleKeyChange(event) {
    this.setState({
      transactionKey: event.target.value,
      transactionError: '',
      transactionSuccess: '',
    });
    this.getTransactions();
  }

  handleAmountChange(event) {
    this.setState({
      transactionAmount: event.target.value,
      transactionError: '',
      transactionSuccess: '',
    });
    this.getTransactions();
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
    this.setState({loadingTransactionList: true});
    Promise.all([APIService.getTransactions()])
    .then(([transactionsData]) => {
        const transactions = transactionsData.message ? transactionsData.message : transactionsData;
        this.setState({ transactions, loadingTransactionList: false });
    });

  }

  toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
      rv[i] = arr[i];
    return rv;
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

    var transactionList = new Array();
    var transactionIndex = 0;
    console.log("transactions: " + transactions);
    console.log("typeof(transactions) " + typeof(transactions));
    if (transactions != null){
      transactions.forEach(function(transaction, index){
        console.log(transaction.outputs[index]);
        for(var outputIndice = 0; outputIndice < transaction.outputs.length; outputIndice++){
          console.log(transaction.input.address);
          console.log(transaction.outputs[outputIndice].address);
          
          if(transaction.input.address != transaction.outputs[outputIndice].address){
            transactionList.push(new Object);
            transactionList[transactionIndex].id = transaction.id;
            console.log(" transactionList[transactionIndex].id")
            console.log( transactionList[transactionIndex].id);
            transactionList[transactionIndex].from = transaction.input.address;
            transactionList[transactionIndex].to = transaction.outputs[outputIndice].address;
            transactionList[transactionIndex].amount = transaction.outputs[outputIndice].amount;
            transactionIndex++;
          }
        };

      });
    }
    const columns = [{
      dataField: 'id',
      text: 'ID'
    }, {
      dataField: 'from',
      text: 'De'
    }, {
      dataField: 'to',
      text: 'Para'
    }, {
      dataField: 'amount',
      text: 'Valor'
    }];
    console.log("transactions");
    console.log(transactions);
    console.log("transactionList");
console.log(transactionList);
var options = {
  noDataText: 'Your_custom_text'
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
          <BootstrapTable keyField='id' 
                    data={ transactionList } 
                    options={options}
                    columns={ columns } 
                    bordered={false}
                    id={"transactionsTable"}
                    striped
                    ></BootstrapTable>  

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
