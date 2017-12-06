import {
  SET_COMMENTS,
  SET_COMMENTS_ARTICLE_ID,
  SET_LOAD_COMMENTS,
  SET_SHOW_COMMENTS,
  SET_COMMENTS_FILTER,
  commentsFilterValues,
  SET_COMMENT_HOVER,
} from '../actions';


const commentsInitalState = {
  articleID: null,
  comments: null,
  loadComments: true, //when set to true the relevent article needs to load/reload the comments
  showComments: false,
  commentsFilter: commentsFilterValues.NEWEST,
  commentHover: null,
}
function CommentsReducer(state = commentsInitalState, action) {

  switch(action.type)
  {
    case SET_COMMENTS:
      return Object.assign({}, state, {
        comments: action.comments
      });
    case SET_COMMENTS_ARTICLE_ID:
      return Object.assign({}, state, {
        articleID: action.articleID
      });
    case SET_LOAD_COMMENTS:
      return Object.assign({}, state, {
        loadComments: action.value
      });
    case SET_SHOW_COMMENTS:
      return Object.assign({}, state, {
        showComments: action.value
      });
    case SET_COMMENTS_FILTER:
      return Object.assign({}, state, {
        commentsFilter: action.value
      });
    case SET_COMMENT_HOVER:
      return Object.assign({}, state, {
        commentHover: action.id
      });
    default:
        return state;
  }
}
 export default CommentsReducer;
