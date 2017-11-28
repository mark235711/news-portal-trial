import React, { Component } from 'react';
import '../Article.css';
import {Button, Modal, Panel, Grid, Row, Col} from 'react-bootstrap';
import ReactHTMLConverter from 'react-html-converter';
import { pageValues } from '../actions';
//import renderHTML from 'react-render-html';
import moment from 'moment';


function addImagesAndConvertToJSX(htmlString)
{
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
        if(i > 1000)
        {
          console.log('this sounds like an error');
          break;
        }
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

function convertStringtoImageJSX(imgString)
{
  //return imgString;
  console.log(imgString);
  var i=0;
  var src = '';
  while(imgString[i] !== 's') //finds the opening s
   {
     i++;
     if(i > 1000)
     {
       console.log('this sounds like an error');
       break;
     }

  }
  if(imgString[i] === 's' && imgString[i+1] === 'r' && imgString[i+2] === 'c') //src found
  {
    var quoteStartPos = 0;
    var quoteEndPos = 0;
    var quoteStartChar = '';
    while(imgString[i] !== "'" && imgString[i] !== '"') //finds the opening of src quote
    {
      i++;
      if(i > 1000)
      {
        console.log('this sounds like an error');
        break;
      }
    }
    quoteStartChar = imgString[i];
    i++;
    quoteStartPos = i;
    while(imgString[i] !== quoteStartChar) //finds the closing of src quote
    {
      i++;
      if(i > 1000)
      {
        console.log('this sounds like an error');
        break;
      }
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
  console.log('../Images/'+src);
  //const image = require('../Images/TestImage.png');
  //const image = require(src);
  var ImageJSX = <img src={src} width='100%' alt=''/>;
  return ImageJSX;
}

class Article extends Component {

  constructor(props)
  {
    super(props)
    // this.state = {
    //   handler: props.handler,
    //   closeHandler: props.closeHandler,
    //   id: props.id,
    //   title: props.title,
    //   teaser: props.teaser,
    //   content: props.content,
    //   published: props.published,
    //   showPopup: props.showPopup,
    //   hidden: props.hidden,
    //   editButton: props.editButton,
    //   publishButton: props.publishButton
    // }
    this.close = this._close.bind(this);
    this.open = this._open.bind(this);
    this.publish = this._publish.bind(this);
    //addImagesAndConvertToJSX('a');
  }

  _close() {
      this.props.setArticlePopup(this.props.id, false);
      if (this.props.closeHandler !== undefined)
        this.props.closeHandler();
    }
  _open() {
      if(this.props.showPopup === false || this.props.showPopup === undefined)
      {
        this.props.setArticlePopup(this.props.id, true);
      }
    }

  _publish() {
  }

  render() {
    var articleBody = this.props.content;
    //var maxLength = 200;

    var articlePreview = '';
    var outputArticle = '';

    if(articleBody !== undefined)
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
          outputRow.push(<Col sm={12/cols} key={j}><div className='ArticleSection'>{addImagesAndConvertToJSX(articleBody[i][j])}</div></Col>);
          //console.log(converter.convert(articleBody[i][j]));
        }

        outputArticle.push(<Row key={i} className="show-grid">
        {
          outputRow
        }
        </Row>);

      }
    }
    var style = "primary"
    switch (this.props.published) {
      case 0:
        style = 'success';
        break;
      case 1:
        style = 'info';
        break;
      case 2:
          style = "primary";
          break;
      default:
        break;
    }

    //const image = require('./Images/TestImage.png');
    //const image = require('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Google-favicon-2015.png/150px-Google-favicon-2015.png');
    //const image = require('http://localhost:3000/Images/TestImage.png');
    //const converter = new ReactHTMLConverter();
    //var imageTest = renderHTML('<img src="./Images/TestImage.png"/>');
    //imageTest = <img src={image}/>;
    //imageTest ='';


    // .Panel{
    //    word-break:break-all;
    //    overflow:hidden;
    //    border-color: #cccccc;
    //    border-style: solid;
    //    border-radius: 10px;
    //    border-width: 2px
    // }

    var cssStyle = {
      visibility: this.props.hidden ? 'hidden' : 'visible',
      wordWrap: 'break-word',
    };


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

    return (
      <Panel header={this.props.title} onClick= {() => this.open()} bsStyle={style} style={cssStyle} className='Article'>
    <div>
      {articlePreview}
      </div>
              <Modal show={this.props.showPopup} onHide={this.close} bsSize="large">
                <Modal.Header closeButton>
                  <Modal.Title><p className='articleTitle'>{this.props.title}</p></Modal.Title>
                  <p>{dateText}</p>
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
                {
                  this.props.editButton === true &&
                  <Button onClick = {() => {this.props.setPage(pageValues.EDITARTICLE); this.close(); this.props.setArticleID(this.props.id)}}>Edit</Button>
                }
                {
                  this.props.publishButton === true &&
                  <Button>Publish</Button>
                }
                <Button onClick={this.close}>Close</Button>
                {/*<img src='https://i.imgur.com/V8hpbNR.png' alt='this is a test image'/>*/}
                </Modal.Footer>
              </Modal>
      </Panel>
    );
  }
}

export default Article;
