import React, { Component } from 'react';
import '../Article.css';
import {Button, Modal, Panel, Grid, Row, Col, Glyphicon, ButtonGroup, ToggleButton, ToggleButtonGroup, MenuItem, DropdownButton} from 'react-bootstrap';
import ReactHTMLConverter from 'react-html-converter';
import { pageValues, commentsFilterValues } from '../actions';
import CommentEditorContainer from '../Containers/CommentEditorContainer';
import CommentContainer from '../Containers/CommentContainer';
//import renderHTML from 'react-render-html';
import moment from 'moment';
import { VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, LIKE_ARTICLE_URL} from '../GeneralParameters';


function addImagesAndConvertToJSX(htmlString) {
  //finds all the html img tags and manualy adds in the img

  if(typeof htmlString !== 'string')
    return '';

  //console.log(htmlString);

  const converter = new ReactHTMLConverter();
  var output = [];
  var previousPartEnd = 0;
  for(var i = 0; i < htmlString.length; i++)
  {
    if(htmlString[i] === '<' && htmlString[i+1] === 'i' && htmlString[i+2] === 'm' && htmlString[i+3] === 'g')
    {
      console.log('match');
      output[output.length] = converter.convert(htmlString.substring(previousPartEnd, i));
      var imgStart = i;


      while(htmlString[i] !== '>') //finds the closing img tag
      {
        i++;
      }
      i++;
      output[output.length]=convertStringtoImageJSX(htmlString.substring(imgStart, i));
      previousPartEnd = i;
    }
  }
  output[output.length] = converter.convert(htmlString.substring(previousPartEnd ,htmlString.length - 1));
  //console.log('code is being run');
  //console.log(output);
  return output;
}
function convertStringtoImageJSX(imgString) {
  //return imgString;
  //console.log(imgString);
  var i=0;
  var src = '';
  while(imgString[i] !== 's') //finds the opening s
  {
    i++;
  }
  if(imgString[i] === 's' && imgString[i+1] === 'r' && imgString[i+2] === 'c') //src found
  {
    var quoteStartPos = 0;
    var quoteEndPos = 0;
    var quoteStartChar = '';
    while(imgString[i] !== "'" && imgString[i] !== '"') //finds the opening of src quote
    {
      i++;
    }
    quoteStartChar = imgString[i];
    i++;
    quoteStartPos = i;
    while(imgString[i] !== quoteStartChar) //finds the closing of src quote
    {
      i++;
    }
    quoteEndPos = i;
    //console.log(quoteStartPos+', '+quoteEndPos);
    src = imgString.substring(quoteStartPos, quoteEndPos);
  }
  else
  {
    console.log('error img faliled to find src');
    return '';
  }
  //console.log('../Images/'+src);
  //const image = require('../Images/TestImage.png');
  //const image = require(src);
  var ImageJSX = <img key={src} src={src} width='100%' alt=''/>;
  return ImageJSX;
}

class Article extends Component {

  constructor(props)
  {
    super(props);

    this.close = this._close.bind(this);
    this.open = this._open.bind(this);
    this.publish = this._publish.bind(this);
    this.loadComments = this._loadComments.bind(this);
    this.loadDate = this._loadDate.bind(this);
    this.onFilterChange = this._onFilterChange.bind(this);
    this.likeArticle = this._likeArticle.bind(this);
    this.changeVisibleCommentEditor = this._changeVisibleCommentEditor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showPopup && nextProps.loadComments === true)
    {
      //console.log(nextProps.loadComments);
      //console.log('testing 123');
      this.props.setLoadComments(false);
      this.loadComments();
    }
  }

  _close() {
      this.props.setArticlePopup(this.props.id, false);
      this.props.setShowComments(false);
      this.props.resetCommentEditor();
    }
  _open() {
      if(this.props.showPopup === false || this.props.showPopup === undefined)
      {
        console.log('open');
        this.props.setLoadComments(true);
        this.props.setArticlePopup(this.props.id, true);
      }
    }

  _publish() {
  }
  _loadComments() {
    fetch(VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleID: this.props.id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var newComments = responseJson;

      this.props.setComments(newComments);
      this.props.setCommentsArticleID(this.props.id);
      this.props.setShowComments(true);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _loadDate() {
    var dateText = '';
    if(this.props.publishedDate != null)
    {
      var time = moment.utc(this.props.publishedDate, 'YYYY-MM-DD HH:mm:ss'); //gets the time
      var time2 = time.local().format('Do MMMM YYYY [at] HH[:]mm a'); //converts it to the correct timezone and displays it

      switch (this.props.published) {
        case 0:
          dateText = 'Article was pushed back for editing by an editor on: ';
          break;
        case 1:
        dateText = 'Article was submited for publishing on: ';

          break;
        case 2:
        dateText = 'Publish Date: ';
          break;
        default:
          break;
      }
      dateText += time2;
    }
    return dateText;
  }
  _onFilterChange(eventKey) {
    switch (eventKey) {
      case 1:
        this.props.setCommentsFilter(commentsFilterValues.MOST_LIKED);
        break;
      case 2:
      this.props.setCommentsFilter(commentsFilterValues.NEWEST);
        break;
      case 3:
      this.props.setCommentsFilter(commentsFilterValues.OLDEST);
        break;
      default:
        break;
    }
  }
  _likeArticle()
  {
    var likeValue = 1;
    if(this.props.likeStatus === 'LIKED')
      likeValue = -1;

    fetch(LIKE_ARTICLE_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article_id: this.props.id,
        value: likeValue,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson['error'] == null)
      {
        if(likeValue === 1)
          this.props.setLikeArticle(true);
        else
          this.props.setLikeArticle(false);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _changeVisibleCommentEditor()
  {
    if(this.props.showCommentEditor === true)
    {
      this.props.setCommentVisibility(false);
      this.props.resetCommentEditor();
    }
    else
    {
      this.props.setCommentVisibility(true);
    }
  }

  render() {
    var articleBody = this.props.content;
    //var maxLength = 200;

    var articlePreview = '';
    var outputArticle = '';

    if(articleBody !== undefined && articleBody.length !== 0)
    {
      const converter = new ReactHTMLConverter();
      articlePreview = (converter.convert(articleBody[0][0])); //.substring(0, maxLength);
      if(this.props.teaser != null)
        articlePreview = this.props.teaser;
      outputArticle = [];

      var rows = articleBody.length;
      for(var i = 0; i < rows; i++)
      {
        var cols = articleBody[i].length;
        var outputRow = [];
        for(var j = 0; j < cols; j++)
        {
          //outputRow.push(<Col sm={12/cols}><div className='ArticleSection'>{converter.convert(articleBody[i][j])}</div></Col>);
          outputRow.push(<Col sm={12/cols} key={j}><div className='ArticleSection' style={{wordWrap: 'break-word'}}>{addImagesAndConvertToJSX(articleBody[i][j])}</div></Col>);
          //console.log(converter.convert(articleBody[i][j]));
        }

        outputArticle.push(<Row key={i} className="show-grid">
        {
          outputRow
        }
        </Row>);
      }
    }


    var articleStyle = "primary"
    switch (this.props.published) {
      case 0:
        articleStyle = 'success';
        break;
      case 1:
        articleStyle = 'info';
        break;
      case 2:
          articleStyle = "primary";
          break;
      default:
        break;
    }

    var cssStyle = {
      visibility: this.props.hidden ? 'hidden' : 'visible',
      wordWrap: 'break-word',
    };

    var likeStyle = 'default';
    if(this.props.likeStatus === 'LIKED')
      likeStyle = 'success';

    var dateText = this.loadDate();

    var likeNumber = this.props.likes;
    var comments = [];
    var filterText = '';

    if(this.props.comments != null && this.props.showComments === true)
    {
      switch (this.props.commentsFilter) {
        case commentsFilterValues.MOST_LIKED:
          filterText = 'Most Liked';
          for(i = 0; i < this.props.comments.length; i++)
          {
            comments[i]=<CommentContainer
              key={this.props.comments[i]['id']}
              index={i}
              id={this.props.comments[i]['id']}
            />;
          }
          let comment = this;
          comments.sort(function(a, b){
            if(comment.props.comments[a['props']['index']]['likes'] < comment.props.comments[b['props']['index']]['likes'])
              return 1;
            else
              return -1;
          })
          break;
        case commentsFilterValues.NEWEST:
          filterText = 'Newest';
          for(i = this.props.comments.length - 1; i >= 0; i--)
          {
            comments[this.props.comments.length - i - 1]=<CommentContainer
              key={this.props.comments[i]['id']}
              index={i}
              id={this.props.comments[i]['id']}
              />;
          }
          break;
        case commentsFilterValues.OLDEST:
          filterText = 'Oldest';
          for(i = 0; i < this.props.comments.length; i++)
          {
            comments[i]=<CommentContainer
              key={this.props.comments[i]['id']}
              index={i}
              id={this.props.comments[i]['id']}
            />;
          }
          break;
        default:
          break;
      }
    }


    var headerText = this.props.title;

    if(this.props.likes != null)
      headerText = <Row><Col xs={3}></Col><Col xs={6}>{this.props.title}</Col><Col xs={3}><Glyphicon pullRight={true} glyph="thumbs-up"/> {likeNumber}</Col></Row>;

    return (
      <Panel header={headerText} onClick= {() => this.open()} bsStyle={articleStyle} style={cssStyle} className='Article'>
        <div>
          {articlePreview}
          </div>
              <Modal show={this.props.showPopup} onHide={this.close} bsSize="large">
                <Modal.Header closeButton>
                  <Modal.Title><p className='articleTitle'>{this.props.title}</p></Modal.Title>
                  <Grid fluid={true}>
                    <Row>
                      <Col xs={6}>
                        {dateText} <br/>Author: {this.props.author}
                      </Col>
                      <Col xs={6}>
                        <div className='pull-right' ><Glyphicon glyph="thumbs-up"/> {likeNumber}</div>
                      </Col>
                    </Row>
                  </Grid>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <Grid fluid = {true}>
                      <div className='Article'>
                        {outputArticle}
                      </div>
                    </Grid>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                <ButtonGroup>
                  {
                    (this.props.likeStatus === 'SHOW' || this.props.likeStatus === 'LIKED') &&
                    <Button bsStyle={likeStyle} onClick={this.likeArticle}><Glyphicon glyph="thumbs-up"/></Button>
                  }
                  {
                    this.props.commentButton === true &&
                    <Button onClick = {this.changeVisibleCommentEditor}><Glyphicon glyph="comment"/></Button>
                  }
                  {
                    this.props.editButton === true &&
                    <Button onClick = {() => {this.props.resetEditArticle(); this.props.setPage(pageValues.EDIT_ARTICLE); this.close(); this.props.setArticleID(this.props.id);}}>Edit</Button>
                  }
                  {
                    this.props.publishButton === true &&
                    <Button>Publish</Button>
                  }
                  <Button onClick={this.close}>Close</Button>
                </ButtonGroup>
                {
                  this.props.showCommentEditor &&
                  <CommentEditorContainer />
                }
                <br />
                {
                  comments.length > 0 &&
                  <DropdownButton title={filterText} type="button" onSelect={this.onFilterChange} name="options" defaultValue={2} id={-10}>
                    <MenuItem eventKey={1}>Most Liked Comments</MenuItem>
                    <MenuItem eventKey={2}>Newest Comments</MenuItem>
                    <MenuItem eventKey={3}>Oldest Comments</MenuItem>
                  </DropdownButton>
                }
                {comments}
                </Modal.Footer>
              </Modal>
      </Panel>
    );
  }
}

export default Article;
