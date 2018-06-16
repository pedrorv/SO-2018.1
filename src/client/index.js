import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Wallet from './components/Wallet';

const App = () => (
  <div>
    <Header />
    <div className="container">
      <Wallet />
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
