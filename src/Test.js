import React, { Component } from 'react';
import './Main.css';
import {Button, Modal, OverlayTrigger, Popover, Tooltip, SplitButton, MenuItem} from 'react-bootstrap';
import {VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, LIKE_ARTICLE_URL, LIKE_COMMENT_URL, DELETE_COMMENT_URL, POST_COMMENT_URL, CREATE_ARTICLE_URL, LOAD_ARTICLE_URL, DELETE_ARTICLE_URL, SUBMIT_ARTICLE_FOR_REVIEW_URL, PUBLISH_ARTICLE_URL, PUSH_BACK_ARTICLE_URL, VIEW_ALL_ARTICLES_URL, VIEW_ALL_PENDING_ARTICLES_URL} from './GeneralParameters';

class Test extends Component {


  render() {
    fetch(VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleID: 1,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });

    return (
      <p>this is a test page</p>
    );
  }
  }

  export default Test;
