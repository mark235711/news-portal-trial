import { connect } from 'react-redux';
import { setArticlePopup, pageValues, setEditArticlePopup, editArticlePopups, setEditArticleID } from '../actions';
import Article from '../Components/Article';
import { setPage } from '../actions';

function findIndexWithID(state, id)
{
  for (var i = 0; i < state.viewArticles.articles.length; i++) {
    if(state.viewArticles.articles[i]['id'] === id)
      return i;
  }
  return null;
}

const mapStateToProps = (state, ownProps) => {
  if(ownProps.id !== -1) //-1 is used to represent the article is in the editor
  {
    var index = findIndexWithID(state, ownProps.id);

    var canBeEdited = false;
    if((state.page.currentPage === pageValues.VIEWYOURARTICLES && state.viewArticles.articles[index]['published'] === 0) || //if it's your article and it hasn't been submited for publishing yet
    state.page.currentPage === pageValues.VIEWARTICLESTOBEAPPROVED || state.page.currentPage === pageValues.VIEWPUBLISHEDARTICLESEDITMODE)
      canBeEdited = true;

    return {
      title: state.viewArticles.articles[index]['title'],
      teaser: state.viewArticles.articles[index]['teaser'],
      content: state.viewArticles.articles[index]['content'],
      published: state.viewArticles.articles[index]['published'],
      publishedDate: state.viewArticles.articles[index]['published_date'],
      editButton: canBeEdited,
      showPopup: state.viewArticles.popup.visible && state.viewArticles.popup.articleID === ownProps.id,
    }
  }
  else //when preview is used in the editor
  {
    return {
    title: state.editArticle.title,
    teaser: state.editArticle.teaser,
    content: state.editArticle.editorSectionsContent,
    published: state.editArticle.published,
    editButton: false,
    showPopup: true,
    }
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setArticlePopup: (id, visible) => {
      if(id !== -1) //article is in the viewarticles page
        dispatch(setArticlePopup(id, visible));
      else //article is in editor
        dispatch(setEditArticlePopup(editArticlePopups.NONE));
    },
    setPage: type => {
        dispatch(setPage(type));
    },
    setArticleID: id => {
      dispatch(setEditArticleID(id));
    }
  }
}

const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Article)

export default ArticleContainer;
