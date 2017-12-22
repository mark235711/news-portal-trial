import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from '../Login';
import EditArticle from '../Components/EditArticle';
import CreateAccount from '../CreateAccount';
import ViewArticles from '../Components/ViewArticles';
import { pageValues, userStateValues } from '../actions';
import { GET_USER_DATA_URL } from '../GeneralParameters';

import {observer, inject} from 'mobx-react';

@observer
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
      this.props.store.user.id = responseJson['user_id'];
      this.props.store.user.username = responseJson['name'];
      if(responseJson['permissions'][0] === 'editor')
        this.props.store.user.permissions = 'EDITOR';
      else if(responseJson['permissions'][0] === 'contributor')
        this.props.store.user.permissions = 'CONTRIBUTOR';
    })
    .catch((error) => {
      console.error(error);
    });

  }


  render()
  {
      console.log(this.props.store.currentPage);
      var pageToRender;
      switch (this.props.store.currentPage) {
        case pageValues.LOGIN: //not currently used
          pageToRender = <Login store={this.props.store}/>
          break;
        case pageValues.CREATE_ACCOUNT: //not currently used
          pageToRender = <CreateAccount store={this.props.store}/>
          break;
        case pageValues.EDIT_ARTICLE:
          pageToRender = <EditArticle store={this.props.store}/>
          break;
        case pageValues.CREATE_ARTICLE:
          pageToRender = <EditArticle store={this.props.store} createMode={true}/>
          break;
        case pageValues.VIEW_ARTICLES:
          pageToRender = <ViewArticles store={this.props.store}/>
          break;
        case pageValues.VIEW_YOUR_ARTICLES :
          pageToRender = <ViewArticles store={this.props.store}/>
          break;
        case pageValues.VIEW_ARTICLES_TO_BE_APPROVED : //this page should only be accessed by editors
          pageToRender = <ViewArticles store={this.props.store}/>
          break;
        case pageValues.VIEW_PUBLISHED_ARTICLES_EDIT_MODE: //this page should only be accessed by editors
          pageToRender = <ViewArticles store={this.props.store}/>
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
// Page.propTypes = {
  // currentPage: PropTypes.string.isRequired,
  // otherData: PropTypes.string.isRequired,
// }

export default Page;
