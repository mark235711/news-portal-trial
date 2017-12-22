import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import Login from './Login';
//import EditArticle from './EditArticle';
//import CreateAccount from './CreateAccount';
//import ViewArticles from './ViewArticles';

import Page from './Components/Page';
import Test from './Test';

import {observer, inject} from 'mobx-react';

@observer
class App extends Component {

  constructor(props)
  {
    super(props)
    //fetchJsonGetRequest('http://192.168.10.10/test');
  }

  render() {

    return (
      <div className="App">
        <Page store={this.props.store}/>
        {/*<Test/>*/}
      </div>
    );
  }
}

export default App;
