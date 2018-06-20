import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import APIService from '../services/api';

class Blockchain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chain: null,
      chainError: '',
      loadingChain: false,
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
    this.setState({ loadingChain: true });

    APIService.getBlockchain().then((blockchainData) => {
      this.setState({
        loadingChain: false,
        chain: blockchainData.message ? null : blockchainData,
        chainError: blockchainData.message || '',
      });
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
          miningSuccess: '',
        });
      } else {
        this.setState({
          loadingMine,
          miningSuccess: 'Bloco minerado com sucesso',
          miningError: '',
        });
      }
    });

    this.loadData();
  }

  render() {
    const { chain, loadingMine } = this.state;

    if (chain != null) {
      chain.forEach((block) => {
        block.datetime = `${new Date(block.timestamp).toLocaleDateString()}` + ' ' + `${new Date(block.timestamp).toLocaleTimeString('it-IT')}` ;
      });
    }

    const columns = [
      {
        dataField: 'hash',
        text: 'Hash',
      },
      {
        dataField: 'datetime',
        text: 'Hora',
      },
      {
        dataField: 'data.length',
        text: 'Transações',
      },
    ];

    return (
      <section>
        <h1 className="has-text-grey-dark is-size-3">Blocos</h1>
        <main className="columns is-multiline" style={{ paddingTop: 10 }}>
          <BootstrapTable
            keyField="hash"
            data={chain || []}
            columns={columns}
            is-striped={true}
            bordered={false}
            id={'blockchainTable'}
            striped
          />

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
