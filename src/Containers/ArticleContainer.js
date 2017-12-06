import { connect } from 'react-redux';
import { setArticlePopup,
  pageValues,
  setEditArticlePopup,
  editArticlePopups,
  setEditArticleID,
  resetEditArticle,
  setCommentVisibility,
  setLikeArticle,
  setComments,
  setCommentsArticleID,
  setLoadComments,
  setShowComments,
  setCommentsFilter,
  resetCommentEditor,
} from '../actions';
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
    if((state.page.currentPage === pageValues.VIEW_YOUR_ARTICLES && state.viewArticles.articles[index]['published'] === 0) || //if it's your article and it hasn't been submited for publishing yet
    state.page.currentPage === pageValues.VIEW_ARTICLES_TO_BE_APPROVED || state.page.currentPage === pageValues.VIEW_PUBLISHED_ARTICLES_EDIT_MODE)
      canBeEdited = true;

    var likeStatus = 'NONE';
    var commentButton = false;
    var comments = null;
    if((state.page.currentPage === pageValues.VIEW_ARTICLES)) //you can only like and comment in the view articles page
    {
      commentButton = true;
      if(state.viewArticles.articles[index]['like'] === true)
        likeStatus = 'LIKED';
      else if(state.page.userID !== state.viewArticles.articles[index]['user_id'])
          likeStatus = 'SHOW';

      if(state.viewArticles.popup.visible && state.viewArticles.popup.articleID === ownProps.id)
        comments = state.comments.comments;
    }

    return {
      title: state.viewArticles.articles[index]['title'],
      teaser: state.viewArticles.articles[index]['teaser'],
      content: state.viewArticles.articles[index]['content'],
      published: state.viewArticles.articles[index]['published'],
      publishedDate: state.viewArticles.articles[index]['published_date'],
      author: state.viewArticles.articles[index]['author'],
      comments: comments,
      loadComments: state.comments.loadComments,
      showComments: state.comments.showComments,
      commentsFilter: state.comments.commentsFilter,
      editButton: canBeEdited,
      likeStatus: likeStatus,
      likes: state.viewArticles.articles[index]['likes'],
      commentButton: commentButton,
      showPopup: state.viewArticles.popup.visible && state.viewArticles.popup.articleID === ownProps.id,
      showCommentEditor: state.commentEditor.visible,
    }
  }
  else //when preview is used in the editor
  {
    return {
    title: state.editArticle.title,
    teaser: state.editArticle.teaser,
    content: state.editArticle.editorSectionsContent,
    published: state.editArticle.published,
    author: state.page.username,
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
    },
    resetEditArticle: () => {
      dispatch(resetEditArticle());
    },
    setCommentVisibility: (visible) => {
      dispatch(setCommentVisibility(visible));
    },
    setLikeArticle: (value) => {
      dispatch(setLikeArticle(value));
    },
    setComments: (comments) => {
      dispatch(setComments(comments));
    },
    setCommentsArticleID:(id) => {
      dispatch(setCommentsArticleID(id));
    },
    setLoadComments:(value) => {
      dispatch(setLoadComments(value));
    },
    setShowComments:(value) => {
      dispatch(setShowComments(value));
    },
    setCommentsFilter:(value) => {
      dispatch(setCommentsFilter(value));
    },
    resetCommentEditor: () => {
      dispatch(resetCommentEditor());
    },
  }
}

const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Article)

export default ArticleContainer;
