import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import Login from './Login';
//import EditArticle from './EditArticle';
//import CreateAccount from './CreateAccount';
//import ViewArticles from './ViewArticles';

import PageContainer from './Containers/PageContainer';
//import Test from './Test';

// function fetchJsonGetRequest(url)
// {
//   //, {
//   //fetch('http://localhost/test', {
//   //fetch('http://httpbin.org/ip', {
//    //  headders : {
//    //    'Content-Type': 'application/json',
//    //    'Accept': 'application/json',
//    //  }
//   //})
//   fetch(url)
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) =>
//   {
//     return console.log(data);
//   });
// }


class App extends Component {

  constructor(props)
  {
    super(props)
    this.handler = this.handler.bind(this)
    this.state = {
      currentPage: 'CREATEARTICLE',
      otherData: '', //used for passing through otherData when needed
    }
    //fetchJsonGetRequest('http://192.168.10.10/test');

  }

  handler(value, data)
  {
    //e.preventDefault()
    this.setState({otherData: data, currentPage: value});
  }

  render() {

    /*
    var pageToRender;
    switch (this.state.currentPage) {
      case 'LOGIN':
        pageToRender = <Login handler = {this.handler} />
        break;
      case 'CREATEACCOUNT':
      pageToRender = <CreateAccount handler = {this.handler} />
        break;
      case 'EDITARTICLE':
      pageToRender = <EditArticle handler = {this.handler} articleID={this.state.otherData}/>
        break;
      case 'CREATEARTICLE':
      pageToRender = <EditArticle handler = {this.handler} createMode={true}/>
        break;
      case 'VIEWARTICLES':
      pageToRender = <ViewArticles handler = {this.handler} />
        break;
      case 'VIEWYOURARTICLES':
      pageToRender = <ViewArticles handler = {this.handler} yourArticles={true}/>
      break;
      case 'VIEWARTICLESTOBEAPPROVED': //this page should only be accessed by editors
      pageToRender = <ViewArticles handler = {this.handler} viewToBeApproved={true}/>
      break;
      case 'VIEWPUBLISHEDARTICLESEDITMODE': //this page should only be accessed by editors
      pageToRender = <ViewArticles handler = {this.handler} viewPublishedEditMode={true}/>
      break;
      default:
        pageToRender = <h1>error page {this.state.currentPage} not found</h1>
        console.log(this.state.currentPage);
        break;
    }
    */
    return (
      <div className="App">
        {/*pageToRender*/}
        <PageContainer />
      </div>
    );
  }
}
export default App;
