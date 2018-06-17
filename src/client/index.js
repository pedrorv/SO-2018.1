import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import Blockchain from './components/Blockchain';

const App = () => (
  <div>
    <Header />
    <div className="container">
      <div className="is-flex" style={{ paddingTop: '15px' }}>
        <img src="imgs/riocoin.png" alt="Rio Coin" style={{ margin: '0 auto' }} />
      </div>
      <Wallet />
      <Transaction />
      <Blockchain />
    </div>
  </div>
  
);

ReactDOM.render(<App />, document.getElementById('app'));

