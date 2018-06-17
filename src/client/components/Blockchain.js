import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import APIService from '../services/api';


class Blockchain extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        balance: null, 
        publicKey: null, 
        loading: null,
        chain: null,
        miningError: '',
        miningSuccess: '',
        loadingMine: false,
    };
  }

  componentDidMount() {
    this.loadData();
    this.mine = this.mine.bind(this);
  }

  loadData() {
    this.setState({ loading: true });

    Promise.all([APIService.getPublicKey(), APIService.getBalance(), APIService.getBlockchain()])
    .then(([keyData, balanceData, blockchainData]) => {
        const publicKey = keyData.message ? keyData.message : keyData.publicKey;
        const balance = balanceData.message ? balanceData.message : `${balanceData.balance} moedas`;
        const chain = blockchainData.message ? blockchainData.message : blockchainData;
        this.setState({ balance, publicKey, loading: false, chain });
    });
  }

  mine() {
    this.setState({ loadingMine: true, miningError: '', miningSuccess: '' });

    APIService.mine().then((miner) => {
      const loadingMine = false;

      if (miner.message) {
        this.setState({ 
          loadingMine, 
          miningError: miner.message, 
          miningSuccess: '' 
        });
      } else {
        this.setState({
          loadingMine,
          miningSuccess: 'Bloco minerado com sucesso',
          miningError: ''
        });
      }
    });
    this.loadData();
}

  render() {
    const { 
        balance, 
        publicKey, 
        loading, 
        chain,
        miningError,
        miningSuccess,
        loadingMine,
    } = this.state;
    var opt;
    // const chain = [{hash:"absdadc", timestamp: 1529183427182, data: [0,1]}, {hash:"fesfd", timestamp: 1529183427182, data: [2,3]}];
    if (chain != null){
        chain.forEach(function(block, index){block.datetime = new Date(block.timestamp).toLocaleDateString() + ' ' + new Date(block.timestamp).toLocaleTimeString();
            console.log(block.data); });
    }
    const columns = [{
      dataField: 'hash',
      text: 'Hash'
    }, {
      dataField: 'datetime',
      text: 'Hora'
    }, {
      dataField: 'data.length',
      text: 'transacoes'
    }];
    

    return (
        <section>
            <h1 className="has-text-grey-dark is-size-3">Blocos</h1>
            <main className="columns is-multiline" style={{paddingTop: 10}} >
                <div className="column">
                <BootstrapTable keyField='hash' 
                    data={ chain?chain:[] } 
                    columns={ columns }  
                    options={{ noDataText: 'Erro' }}
                    striped={true}/>  
                </div>              
                <div className="column is-three-quarters">
                <button
                className={`button is-info ${loadingMine ? 'is-loading' : ''}`}
                disabled={loadingMine}
                onClick={this.mine}
                >
                    Minerar
                </button>
                </div>
            </main>
        </section>
    );
  }
}

export default Blockchain;