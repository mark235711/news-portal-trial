import React, { Component } from 'react';
import '../MenuBar.css';
import {Grid, Row, Col, Glyphicon, Button, Image, Media } from 'react-bootstrap';
import { pageValues, userStateValues } from '../actions';
import placeholder from '../Images/Placeholder.png';
import PropTypes from 'prop-types';
import ReactHTMLConverter from 'react-html-converter';
import {DELETE_COMMENT_URL, LIKE_COMMENT_URL} from '../GeneralParameters';
import moment from 'moment';


class Comment extends Component {


  constructor(props)
  {
    super(props)

    this.onEnter = this._onEnter.bind(this);
    this.onLeave = this._onLeave.bind(this);
    this.onEdit = this._onEdit.bind(this);
    this.onDelete = this._onDelete.bind(this);
    this.loadDate = this._loadDate.bind(this);
    this.likeComment = this._likeComment.bind(this);

  }

  _onEnter() {
    this.props.setCommentHover(this.props.index);
  }
  _onLeave() {
    this.props.setCommentHover(null);
  }
  _onEdit() {
    this.props.setLoadComment(true);
    this.props.setCommentID(this.props.id);
    this.props.setCommentContent(this.props.comment['content']);
    this.props.setCommentVisibility(true);
  }
  _onDelete() {
    fetch(DELETE_COMMENT_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article_id: this.props.articleID,
        comment_id: this.props.id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.setLoadComments(true);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _loadDate() {
    var dateText = '';
    if(this.props.comment['created_at']['date'] != null)
    {
      var time = moment.utc(this.props.comment['created_at']['date'], 'YYYY-MM-DD HH:mm:ss'); //gets the time
      var time2 = time.local().format('Do MMMM YYYY [at] HH[:]mm a'); //converts it to the correct timezone and displays it

      dateText += time2;
    }
    return dateText;
  }
  _likeComment() {
    var likeValue = 1;
    if(this.props.comment['like'] === true)
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
      this.props.setLoadComments(true);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  render() {
    const converter = new ReactHTMLConverter();
    //console.log(this.props.comment);
    var date = this.loadDate();

    var bsStyle = 'default';
    if(this.props.comment['like'] === true)
      bsStyle = 'success';

    return (
      <div onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        <Media>
          <Media.Left>
            <Image width= '60' src={placeholder} alt='need to add a default icon' rounded/>
          </Media.Left>
          <Media.Body style={{textAlign: 'left'}}>
            <Media.Heading><strong>{this.props.comment['username']}</strong> commented at {date}</Media.Heading>
            {converter.convert(this.props.comment['content'])}

            <Grid fluid={true}>
              <Row>
                <Col xs={6}><Glyphicon glyph="thumbs-up"/>{this.props.comment['likes']}</Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                  {
                    this.props.onHover && this.props.isUsersComment &&
                    <Button bsSize='small' onMouseDown={this.onEdit}><Glyphicon glyph="pencil"/></Button>
                  }
                  {
                    this.props.onHover && (this.props.isUsersComment || this.props.userIsEditor) &&
                    <Button bsSize='small' onMouseDown={this.onDelete}><Glyphicon glyph="trash"/></Button>
                  }
                  <Button bsStyle={bsStyle} style={{visibility: this.props.isUsersComment ? 'hidden' : 'visible'}} onClick={this.likeComment} bsSize='small'><Glyphicon glyph="thumbs-up"/></Button>
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
