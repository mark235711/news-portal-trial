import React, { Component } from 'react';
import ArticleContainer from '../Containers/ArticleContainer';
import MenuBarContainer from '../Containers/MenuBarContainer';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';
import { viewArticlesTypes } from '../actions';

/*
function textBlobGen() {
  var textBlob = '';
    for(var i = 0; i < 500; i++)
    {
      if(Math.random() < 0.20)
          textBlob +=' ';
        textBlob += String.fromCharCode(97 + (Math.floor(Math.random() * 26)));
    }
  return textBlob;
}
function ArticleGen() {
  var data = [];
  var rowNumber = 1 + Math.floor(Math.random() * 5);
  for(var i = 0; i < rowNumber; i++)
  {
    data[i] = [];
    var colNumber = 1 + Math.floor(Math.random() * 3);
    for(var j = 0; j < colNumber; j++)
    {
      data[i][j] = textBlobGen();
    }
  }
  return data;
}
*/
class ViewArticles extends Component {

  constructor(props)
  {
    super(props)
    this.getArticles = this._getArticles.bind(this);
    this.getArticles();
    //used for testing to create random text articles
    // for(var i = 0; i < 5; i++)
    // {
    //   var article = {};
    //   article['title'] = 'Article '+i;
    //   article['content'] = ArticleGen();
    //   article['id'] = i;
    //
    //   this.articles[i] = article;
    //   //[title:'Article 'i content = {textBlobGen()} focusFunction={() => {this.setArticleFocus(i)} }/>
    // }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.viewArticlesType !== this.props.viewArticlesType)
    {
      this.props = nextProps;
      this.getArticles();
    }
  }

  _getArticles() {

    var url = '';
    if(this.props.viewArticlesType === viewArticlesTypes.YOUR_ARTICLES)
      url = 'http://homestead.app/viewallarticles';
    else if(this.props.viewArticlesType === viewArticlesTypes.TO_BE_APPROVED)
      url = 'http://homestead.app/viewallpendingarticles';
    else
      url = 'http://homestead.app/viewallpublishedarticles';

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      var newArticles = [];
      if(responseJson !== null)
      {
        var props = this.props;
        responseJson.forEach(function(article) {
          var newArticle = [];
          newArticle['id'] = article.id;
          newArticle['title'] = article.name;
          newArticle['teaser'] = article.teaser;
          newArticle['content'] = JSON.parse(article.content);
          newArticle['published_date'] = article.published_date;
          if(props.viewArticlesType === viewArticlesTypes.YOUR_ARTICLES)
            newArticle['published'] = article.published;
          else if(props.viewArticlesType === viewArticlesTypes.TO_BE_APPROVED)
            newArticle['published'] = 1; //all articles to be approved have a published value of 1
          else
            newArticle['published'] = 2;

            newArticles.push(newArticle);
          });
      }
      this.props.setArticles(newArticles);
    })
    .catch((error) => {
       console.error(error);
    });
    /*


      if(this.props.viewArticlesType === viewArticlesTypes.YOUR_ARTICLES)
      {
        console.log('View Your Articles');
        fetch('http://homestead.app/viewallarticles')
        .then((response) => response.json())
        .then((responseJson) => {

           var newArticles = [];
           if(responseJson !== null)
           {
             responseJson.forEach(function(article){
               var newArticle = [];
               newArticle['id'] = article.id;
               newArticle['title'] = article.name;
               newArticle['teaser'] = article.teaser;
               newArticle['content'] = JSON.parse(article.content);
               newArticle['published'] = article.published;
               newArticles.push(newArticle);
             });
          }
          this.props.setArticles(newArticles);
        })
        .catch((error) => {
           console.error(error);
        });
      }
      else if(this.props.viewArticlesType === viewArticlesTypes.TO_BE_APPROVED)
      {
        console.log('View To Be Approved');
      fetch('http://homestead.app/viewallpendingarticles')
      .then((response) => response.json())
      .then((responseJson) => {

         var newArticles = [];
         if(responseJson != null)
         {
           responseJson.forEach(function(article){
             var newArticle = [];
             newArticle['id'] = article.id;
             newArticle['title'] = article.name;
             newArticle['teaser'] = article.teaser;
             newArticle['content'] = JSON.parse(article.content);
             newArticle['published'] = 1; //all articles to be approved have a published value of 1
             newArticles.push(newArticle);
           });
          }
          this.props.setArticles(newArticles);
      })
      .catch((error) => {
         console.error(error);
      });
      }
      // else if(this.state.viewPublishedEditMode === true)
      // {
      //   console.log('View Published Edit Mode');
      // }
      else
      {
          console.log('View Articles');
        fetch('http://homestead.app/viewallpublishedarticles')
        .then((response) => response.json())
        .then((responseJson) => {

           var newArticles = [];
           if(responseJson !== null)
           {
             responseJson.forEach(function(article){
               var newArticle = [];
               newArticle['id'] = article.id;
               newArticle['title'] = article.name;
               newArticle['teaser'] = article.teaser;
               newArticle['content'] = JSON.parse(article.content);
               newArticle['published'] = 2;
               newArticles.push(newArticle);
             });
           }
           this.props.setArticles(newArticles);
        })
        .catch((error) => {
           console.error(error);
        });
      }
      */
  }

  render() {

    var content = [];
      for(var i = 0; i < this.props.articles.length; i++)
      {
        content[i] =
        <div key = {i}>
        <Col xm={12} sm={6} smOffset={0} md={4} mdOffset={0} lg={3} lgOffset={0}>
        <ArticleContainer key = {this.props.articles[i]['id']} //key is only used to force react to update the Article when required
        id = {this.props.articles[i]['id']}
        // title = {this.props.articles[i]['title']}
        // teaser = {this.props.articles[i]['teaser']}
        // content = {this.props.articles[i]['content']}
        // published = {this.props.articles[i]['published']}
        // editButton = {canBeEdited}
        />
        </Col>
        {
          i % 2 === 1 &&
          <Clearfix visibleSmBlock/>
        }
        {
          i % 3 === 2 &&
          <Clearfix visibleMdBlock/>
        }
        {
          i % 4 === 3 &&
          <Clearfix visibleLgBlock/>
        }
        </div>
      }

      var heading;
      switch (this.props.viewArticlesType)
      {
        case viewArticlesTypes.PUBLISHED_ARTICLES:
        heading=<h1>View Articles</h1>;
          break;
        case viewArticlesTypes.YOUR_ARTICLES:
          heading=<h1>View Your Articles</h1>;
          break;
        case viewArticlesTypes.TO_BE_APPROVED:
          heading=<h1>View Articles To Be Approved</h1>;
          break;
        case viewArticlesTypes.PUBLISHED_EDIT_MODE:
          heading=<h1>View Articles (Edit Mode)</h1>;
          break;
        default:
          heading =<h1>error</h1>
          break;
      }

    return (
      <div className='ViewArticles'>
      <Grid fluid={true}>
      <Row>
      <MenuBarContainer
        logout={true}
        createArticle={true}
        viewArticles={true}
        viewYourArticles={true}
        viewToBeApproved={true}
        viewPublishedEditMode={true} />
      </Row>
      <Row>
      {heading}
      </Row>
      <Row>
      {content}
      </Row>
      </Grid>
      </div>
    );
  }
}

export default ViewArticles;
