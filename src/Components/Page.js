import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from '../Login';
import EditArticleContainer from '../Containers/EditArticleContainer';
import CreateAccount from '../CreateAccount';
import ViewArticlesContainer from '../Containers/ViewArticlesContainer';

class Page extends Component {

  render()
  {
      var pageToRender;
      switch (this.props.currentPage) {
        case 'LOGIN':
          pageToRender = <Login />
          break;
        case 'CREATEACCOUNT':
          pageToRender = <CreateAccount />
          break;
        case 'EDITARTICLE':
          pageToRender = <EditArticleContainer />
          break;
        case 'CREATEARTICLE':
          pageToRender = <EditArticleContainer createMode={true}/>
          break;
        case 'VIEWARTICLES':
          pageToRender = <ViewArticlesContainer />
          break;
        case 'VIEWYOURARTICLES':
          pageToRender = <ViewArticlesContainer />
          break;
        case 'VIEWARTICLESTOBEAPPROVED': //this page should only be accessed by editors
          pageToRender = <ViewArticlesContainer />
          break;
        case 'VIEWPUBLISHEDARTICLESEDITMODE': //this page should only be accessed by editors
          pageToRender = <ViewArticlesContainer />
          break;
        default:
          pageToRender = <h1>error page {this.props.currentPage} not found</h1>
          break;
      }
    return (
      <div>
        {pageToRender}
      </div>
    );
  }

}

Page.propTypes = {
  currentPage: PropTypes.string.isRequired,
  otherData: PropTypes.string.isRequired,
}




export default Page;
