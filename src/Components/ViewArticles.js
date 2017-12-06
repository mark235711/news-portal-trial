import React, { Component } from 'react';
import ArticleContainer from '../Containers/ArticleContainer';
import MenuBarContainer from '../Containers/MenuBarContainer';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';
import { viewArticlesTypes } from '../actions';
import {
  VIEW_ALL_ARTICLES_URL,
  VIEW_ALL_YOUR_ARTICLES_URL,
  VIEW_ALL_PENDING_ARTICLES_URL,
  VIEW_ALL_PUBLISHED_ARTICLES_URL,
} from '../GeneralParameters';

class ViewArticles extends Component {

  constructor(props)
  {
    super(props)
    this.getArticles = this._getArticles.bind(this);
    this.getArticles();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.viewArticlesType !== this.props.viewArticlesType)
    {
      this.props = nextProps;
      this.getArticles();
    }
  }

  _getArticles() {

    this.props.setViewArticlesLoading(true);
    var url = '';
    if(this.props.viewArticlesType === viewArticlesTypes.YOUR_ARTICLES)
      url = VIEW_ALL_YOUR_ARTICLES_URL;
    else if(this.props.viewArticlesType === viewArticlesTypes.TO_BE_APPROVED)
      url = VIEW_ALL_PENDING_ARTICLES_URL;
    else
      url = VIEW_ALL_PUBLISHED_ARTICLES_URL;


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
          newArticle['author'] = article.author;
          newArticle['published_date'] = article.published_date;
          if(props.viewArticlesType === viewArticlesTypes.YOUR_ARTICLES)
            newArticle['published'] = article.published;
          else if(props.viewArticlesType === viewArticlesTypes.TO_BE_APPROVED)
            newArticle['published'] = 1; //all articles to be approved have a published value of 1
          else
            newArticle['published'] = 2;
          newArticle['user_id'] = article.user_id;
          newArticle['likes'] = article.likes;
          newArticle['like'] = article.like;
          newArticles.push(newArticle);
        });
      }
      this.props.setArticles(newArticles);
      this.props.setViewArticlesLoading(false);
    })
    .catch((error) => {
       console.error(error);
    });
  }

  render() {

    var content = [];
    if(this.props.loading === false)
    {
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
    }
    else
    {
        content = <h3>loading</h3>;
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
