import React, { Component } from 'react';
import '../MenuBar.css';
import {Grid, Row, Col, Glyphicon, Button, Image, Media } from 'react-bootstrap';
import { pageValues, userStateValues } from '../actions';
import placeholder from '../Images/Placeholder.png';
import PropTypes from 'prop-types';
import ReactHTMLConverter from 'react-html-converter';
import {DELETE_COMMENT_URL, LIKE_COMMENT_URL} from '../GeneralParameters';
import moment from 'moment';

import {observer} from 'mobx-react';

@observer
class Comment extends Component {


  constructor(props)
  {
    super(props)

    this.onEnter = this._onEnter.bind(this);
    this.onLeave = this._onLeave.bind(this);
    this.onEdit = this._onEdit.bind(this);
    this.loadDate = this._loadDate.bind(this);
    this.likeComment = this._likeComment.bind(this);

  }

  _onEnter() {
    this.props.store.viewArticles.commentHover = this.props.index;
  }
  _onLeave() {
    this.props.store.viewArticles.commentHover = null;
  }
  _onEdit() {
    this.props.store.commentEditor.loadComment = true;
    this.props.store.commentEditor.commentID = this.props.id;
    this.props.store.commentEditor.content = this.props.store.data.comments[this.props.index].content;
    this.props.store.commentEditor.visible = true;
  }

  _loadDate() {
    var comment = this.props.store.data.comments[this.props.index];
    var dateText = '';
    if(comment['created_at']['date'] != null)
    {
      var time = moment.utc(comment['created_at']['date'], 'YYYY-MM-DD HH:mm:ss'); //gets the time
      var time2 = time.local().format('Do MMMM YYYY [at] HH[:]mm a'); //converts it to the correct timezone and displays it

      dateText += time2;
    }
    return dateText;
  }
  _likeComment() {
    var likeValue = 1;
    if(this.props.store.data.comments[this.props.index]['like'] === true)
      likeValue = -1;

    fetch(LIKE_COMMENT_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment_id: this.props.id,
        value: likeValue,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.store.viewArticles.getComments();
    })
    .catch((error) => {
      console.error(error);
    });
  }
  render() {
    const converter = new ReactHTMLConverter();

    var date = this.loadDate();
    var comment = this.props.store.data.comments[this.props.index];
    var isUsersComment = comment.user_id === this.props.store.user.id;
    var hover = this.props.store.viewArticles.commentHover === this.props.index;
    var userIsEditor = this.props.store.user.permissions === 'EDITOR';

    var bsStyle = 'default';
    if(comment['like'] === true)
      bsStyle = 'success';

    return (
      <div onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        <Media>
          <Media.Left>
            <Image width= '60' src={placeholder} alt='need to add a default icon' rounded/>
          </Media.Left>
          <Media.Body style={{textAlign: 'left'}}>
            <Media.Heading><strong>{comment['username']}</strong> commented at {date}</Media.Heading>
            {converter.convert(comment['content'])}

            <Grid fluid={true}>
              <Row>
                <Col xs={6}><Glyphicon glyph="thumbs-up"/>{comment['likes']}</Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                  {
                    hover && isUsersComment &&
                    <Button bsSize='small' onMouseDown={this.onEdit}><Glyphicon glyph="pencil"/></Button>
                  }
                  {
                    hover && (isUsersComment || userIsEditor) &&
                    <Button bsSize='small' onMouseDown={() => this.props.store.viewArticles.deleteComment(this.props.id)}><Glyphicon glyph="trash"/></Button>
                  }
                  <Button bsStyle={bsStyle} style={{visibility: isUsersComment ? 'hidden' : 'visible'}} onClick={this.likeComment} bsSize='small'><Glyphicon glyph="thumbs-up"/></Button>
                </Col>
              </Row>
            </Grid>
          </Media.Body>
        </Media>
      </div>
    );
  }
}

export default Comment;
