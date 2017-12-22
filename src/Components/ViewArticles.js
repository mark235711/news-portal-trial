import React, { Component } from 'react';
import Article from '../Components/Article';
import MenuBar from '../Components/MenuBar';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';
import { viewArticlesTypes } from '../actions';
import {
  VIEW_ALL_ARTICLES_URL,
  VIEW_ALL_YOUR_ARTICLES_URL,
  VIEW_ALL_PENDING_ARTICLES_URL,
  VIEW_ALL_PUBLISHED_ARTICLES_URL,
} from '../GeneralParameters';

import {observer, inject} from 'mobx-react';
import mobx from 'mobx';


@observer
class ViewArticles extends Component {

  constructor(props)
  {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.viewArticlesType !== this.props.viewArticlesType)
    {
      this.props = nextProps;
    }
  }

  render() {

    var content = [];
    if(this.props.store.viewArticles.loading === false)
    {
      for(var i = 0; i < this.props.store.data.articles.length; i++)
      {
        content[i] =
        <div key = {i}>
        <Col xm={12} sm={6} smOffset={0} md={4} mdOffset={0} lg={3} lgOffset={0}>
        <Article key = {this.props.store.data.articles[i]['id']} store={this.props.store} //key is only used to force react to update the Article when required
        id = {this.props.store.data.articles[i]['id']}
        index = {i}
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
    switch (this.props.store.currentPage)
    {
      case 'VIEW_ARTICLES':
      heading=<h1>View Articles</h1>;
        break;
      case 'VIEW_YOUR_ARTICLES':
        heading=<h1>View Your Articles</h1>;
        break;
      case 'VIEW_ARTICLES_TO_BE_APPROVED':
        heading=<h1>View Articles To Be Approved</h1>;
        break;
      case 'VIEW_PUBLISHED_ARTICLES_EDIT_MODE':
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
      <MenuBar store={this.props.store}
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
