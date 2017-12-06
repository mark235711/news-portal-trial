import {
  SET_COMMENT_VISIBILITY,
  SET_COMMENT_CONTENT,
  SET_COMMENT_LINK_POPUP,
  SET_LOAD_COMMENT,
  SET_LIKE_COMMENT,
  SET_COMMENT_ID,
  RESET_COMMENT_EDITOR,
} from '../actions';

  const commentEditorIntialState = {
    visible: false,
    content: '<p><br /><p>',
    linkPopup: false,
    loadComment: false,
    commentID: null,
    userLike: false,
    likeCount: 0,
  }
  function CommentEditorReducer(state = commentEditorIntialState, action)
  {
    switch(action.type)
    {
    case SET_COMMENT_VISIBILITY:
      return Object.assign({}, state, {
        visible: action.visible
      });
    case SET_COMMENT_CONTENT:
      return Object.assign({}, state, {
        content: action.content
      });
    case SET_COMMENT_LINK_POPUP:
      return Object.assign({}, state, {
        linkPopup: action.linkPopup
      });
    case SET_LOAD_COMMENT:
      return Object.assign({}, state, {
        loadComment: action.value
      });
    case SET_LIKE_COMMENT:
      let newLikeCount = state.likeCount + 1;
      return Object.assign({}, state, {
      userLike: action.value,
        likeCount: newLikeCount,
      });
    case SET_COMMENT_ID:
      return Object.assign({}, state, {
        commentID: action.id,
      });
    case RESET_COMMENT_EDITOR:
      let newState = commentEditorIntialState;
      return newState;
    default:
      return state;
   }
 }
export default CommentEditorReducer;
