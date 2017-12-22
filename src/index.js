import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

//import { Provider } from 'react-redux';
//import { createStore } from 'redux';
//import app from './Reducers/RootReducer';

//import { Provider } from 'mobx-react';
import store from './Stores/Store';

ReactDOM.render(
  <App store={store} />
, document.getElementById('root'));




// ReactDOM.render(
//     <App />
//   , document.getElementById('root'));
// registerServiceWorker();
