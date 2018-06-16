import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';

const App = () => (
  <div>
    <Header />
    <div className="container">
      <Wallet />
      <Transaction />
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
