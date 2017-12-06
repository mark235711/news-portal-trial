import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from '../Login';
import EditArticleContainer from '../Containers/EditArticleContainer';
import CreateAccount from '../CreateAccount';
import ViewArticlesContainer from '../Containers/ViewArticlesContainer';
import { pageValues, userStateValues } from '../actions';
import { GET_USER_DATA_URL } from '../GeneralParameters';
class Page extends Component {

  constructor(props)
  {
    super(props);
    this.getUserData = this._getUserData.bind(this);
    this.getUserData();
  }

  _getUserData()
  {
    fetch(GET_USER_DATA_URL, {
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.setUserID(responseJson['user_id']);
      this.props.setUsername(responseJson['name']);
      if(responseJson['permissions'][0] === 'editor')
        this.props.setUserState(userStateValues.EDITOR);
      else if(responseJson['permissions'][0] === 'contributor')
        this.props.setUserState(userStateValues.CONTRIBUTOR);
    })
    .catch((error) => {
      console.error(error);
    });

  }


  render()
  {
      var pageToRender;
      switch (this.props.currentPage) {
        case pageValues.LOGIN:
          pageToRender = <Login />
          break;
        case pageValues.CREATE_ACCOUNT:
          pageToRender = <CreateAccount />
          break;
        case pageValues.EDIT_ARTICLE:
          pageToRender = <EditArticleContainer />
          break;
        case pageValues.CREATE_ARTICLE:
          pageToRender = <EditArticleContainer createMode={true}/>
          break;
        case pageValues.VIEW_ARTICLES:
          pageToRender = <ViewArticlesContainer />
          break;
        case pageValues.VIEW_YOUR_ARTICLES :
          pageToRender = <ViewArticlesContainer />
          break;
        case pageValues.VIEW_ARTICLES_TO_BE_APPROVED : //this page should only be accessed by editors
          pageToRender = <ViewArticlesContainer />
          break;
        case pageValues.VIEW_PUBLISHED_ARTICLES_EDIT_MODE: //this page should only be accessed by editors
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
