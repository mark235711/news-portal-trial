import React, { Component } from 'react';
import '../Article.css';
import {Button, Modal, Panel, Grid, Row, Col, Glyphicon, ButtonGroup, ToggleButton, ToggleButtonGroup, MenuItem, DropdownButton} from 'react-bootstrap';
import ReactHTMLConverter from 'react-html-converter';
import { pageValues, commentsFilterValues } from '../actions';
import CommentEditor from '../Components/CommentEditor';
import Comment from '../Components/Comment';
//import renderHTML from 'react-render-html';
import moment from 'moment';
import { VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, LIKE_ARTICLE_URL} from '../GeneralParameters';


import {observer, inject} from 'mobx-react';



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

@observer
class Article extends Component {

  constructor(props)
  {
    super(props);

    this.close = this._close.bind(this);
    this.open = this._open.bind(this);
    this.publish = this._publish.bind(this);
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
    console.log('close');
    if(this.props.id !== -1)
    {
      this.props.store.viewArticles.popup =  {'visible':false, 'articleID': this.props.id};
      this.props.store.viewArticles.showComments = false;
      this.props.store.commentEditor.resetCommentEditor();
    }
    else
    {
      this.props.store.editArticle.popupType = 'NONE';
    }
  }
  _open() {

    if(this.props.store.viewArticles.popup.visible === false)
    {
      console.log('open');
      //this.props.setLoadComments(true);
      this.props.store.viewArticles.popup =  {'visible':true, 'articleID': this.props.id};
    }
  }

  _publish() {
  }
  _loadDate() {
    var dateText = '';
    var article = this.props.store.data.articles[this.props.index];
    if(article.publishedDate != null)
    {
      var time = moment.utc(this.props.publishedDate, 'YYYY-MM-DD HH:mm:ss'); //gets the time
      var time2 = time.local().format('Do MMMM YYYY [at] HH[:]mm a'); //converts it to the correct timezone and displays it

      switch (article.published) {
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
        this.props.store.viewArticles.commentsFilter = 'MOST_LIKED';
        break;
      case 2:
      this.props.store.viewArticles.commentsFilter = 'NEWEST';
        break;
      case 3:
      this.props.store.viewArticles.commentsFilter = 'OLDEST';
        break;
      default:
        break;
    }
  }
  _likeArticle()
  {
    var article = this.props.store.data.articles[this.props.index];
    var likeValue = 1;
    if(article.like === true)
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
          article.like = true;
        else
          article.like = false;
          article.likes += likeValue;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _changeVisibleCommentEditor()
  {
    if(this.props.store.commentEditor.visible === true)
    {
      this.props.store.commentEditor.visible = false;
      this.props.store.commentEditor.resetCommentEditor();
    }
    else
    {
      this.props.store.commentEditor.visible = true;
    }
  }

  render() {
    var store = this.props.store;
    var article = [];
    var articleBody;
    var dateText = '';
    if(this.props.id != -1)
    {
      article = this.props.store.data.articles[this.props.index];
      articleBody = article.content;
       dateText = this.loadDate();
    }
    else
    {
      console.log('article in editor');
      article.title = this.props.store.editArticle.title;
      article.teaser = this.props.store.editArticle.teaser;
      article.author = this.props.store.user.username;
      articleBody = this.props.store.editArticle.editorSectionsContent;
    }

    var showPopup = false;
    if(store.viewArticles.popup.visible === true && store.viewArticles.popup.articleID === this.props.id || this.props.id === -1)
      showPopup = true;

    var currentPage = store.currentPage;
    var editButton = false;
    if((currentPage === 'VIEW_YOUR_ARTICLES' && article.published === 0) || //if it's your article and it hasn't been submited for publishing yet
      currentPage === 'VIEW_ARTICLES_TO_BE_APPROVED' || currentPage === 'VIEW_PUBLISHED_ARTICLES_EDIT_MODE')
        editButton = true;

    var likeStatus = 'NONE';
    var commentButton = false;
    if(currentPage === 'VIEW_ARTICLES') //you can only like and comment in the view articles page
    {
      commentButton = true;
      if(article.like === true)
        likeStatus = 'LIKED';
      else if(this.props.store.user.id !== article.user_id) //to prevent the user from liking there own articles
        likeStatus = 'SHOW';
    }



    //var maxLength = 200;

    var articlePreview = '';
    var outputArticle = '';

    if(articleBody !== undefined && articleBody.length !== 0)
    {
      const converter = new ReactHTMLConverter();
      articlePreview = (converter.convert(articleBody[0][0])); //.substring(0, maxLength);
      if(article.teaser != null)
        articlePreview = article.teaser;
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
    switch (article.published) {
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
      visibility: this.props.id === -1 ? 'hidden' : 'visible',
      visibiltiy: 'visible',
      wordWrap: 'break-word',
    };

    var likeStyle = 'default';
    if(likeStatus === 'LIKED')
      likeStyle = 'success';

    var likeNumber = article.likes;
    var displayComments = [];
    var filterText = '';

    var comments = store.data.comments;
    if(store.data.commentsArticleID == this.props.id && store.viewArticles.showComments === true && store.data.comments != null)
    {
      switch (store.viewArticles.commentsFilter) {
        case 'MOST_LIKED':
          filterText = 'Most Liked';
          for(i = 0; i < comments.length; i++)
          {
            displayComments[i]=<Comment
              key={comments[i]['id']}
              index={i}
              id={comments[i]['id']}
              store={store}
            />;
          }
          let comment = this;
          displayComments.sort(function(a, b){
            if(comments[a['props']['index']]['likes'] < comments[b['props']['index']]['likes'])
              return 1;
            else
              return -1;
          })
          break;
        case 'NEWEST':
          filterText = 'Newest';
          for(i = comments.length - 1; i >= 0; i--)
          {
            displayComments[comments.length - i - 1]=<Comment
              key={comments[i]['id']}
              index={i}
              id={comments[i]['id']}
              store={store}
              />;
          }
          break;
        case commentsFilterValues.OLDEST:
          filterText = 'Oldest';
          for(i = 0; i < comments.length; i++)
          {
            displayComments[i]=<Comment
              key={comments[i]['id']}
              index={i}
              id={comments[i]['id']}
              store={store}
            />;
          }
          break;
        default:
          break;
      }
    }


    var headerText = article.title;
    if(article.likes != null)
      headerText = <Row><Col xs={3}></Col><Col xs={6}>{article.title}</Col><Col xs={3}><Glyphicon glyph="thumbs-up"/> {likeNumber}</Col></Row>;

    return (
      <div>
        <Panel header={headerText} onClick= {() => this.open()} bsStyle={articleStyle} style={cssStyle} className='Article'>
          {articlePreview}
        </Panel>
        <Modal show={showPopup} onHide={this.close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title><p className='articleTitle'>{article.title}</p></Modal.Title>
            <Grid fluid={true}>
              <Row>
                <Col xs={6}>
                  {dateText} <br/>Author: {article.author}
                </Col>
                <Col xs={6}>
                  {
                    this.props.id !== -1 &&
                    <div className='pull-right' ><Glyphicon glyph="thumbs-up"/> {likeNumber}</div>
                  }
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
              (likeStatus === 'SHOW' || likeStatus === 'LIKED') &&
              <Button bsStyle={likeStyle} onClick={this.likeArticle}><Glyphicon glyph="thumbs-up"/></Button>
            }
            {
              commentButton === true &&
              <Button onClick = {this.changeVisibleCommentEditor}><Glyphicon glyph="comment"/></Button>
            }
            {
              editButton === true &&
              <Button onClick = {() => {this.props.store.editArticle.resetEditArticle(); this.props.store.currentPage = 'EDIT_ARTICLE'; this.close(); this.props.store.editArticle.articleID = this.props.id;}}>Edit</Button>
            }
            {
              //this is not currently used and was part of a planed feature to allow publishing without editing
              this.props.publishButton === true &&
              <Button>Publish</Button>
            }
            <Button onClick={this.close}>Close</Button>
          </ButtonGroup>
          {
            this.props.store.commentEditor.visible &&
            <CommentEditor store={this.props.store}/>
          }
          <br />
          {
            displayComments.length > 0 &&
            <DropdownButton title={filterText} type="button" onSelect={this.onFilterChange} name="options" defaultValue={2} id={-10}>
              <MenuItem eventKey={1}>Most Liked Comments</MenuItem>
              <MenuItem eventKey={2}>Newest Comments</MenuItem>
              <MenuItem eventKey={3}>Oldest Comments</MenuItem>
            </DropdownButton>
          }
          {displayComments}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Article;
