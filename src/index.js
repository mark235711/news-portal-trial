import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import app from './Reducers/RootReducer';
//ReactDOM.render(<App />, document.getElementById('root'));


import { setPage, pageValues } from './actions';

let store = createStore(app);


//logs the inital state
console.log(store.getState());

//sets a subscriber so that each time the state is changed it's logged
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(setPage(pageValues.VIEW_ARTICLES));
//unsubscribe();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
