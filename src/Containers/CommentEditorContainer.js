import { connect } from 'react-redux';
import {
  setCommentVisibility,
  setCommentContent,
  setCommentLinkPopup,
  setLoadComment,
  setLoadComments,
  resetCommentEditor,
} from '../actions';
import CommentEditor from '../Components/CommentEditor';

const mapStateToProps = (state, ownProps) => {
  //console.log(stateToHTML(state.editArticle.editorStates[ownProps.row][ownProps.col].getCurrentContent()));
  return {
    //content: state.editArticle.editorSectionsContent[ownProps.row][ownProps.col],
    linkPopup: state.commentEditor.linkPopup,
    content: state.commentEditor.content,
    updateContent: false,
    loadComment: state.commentEditor.loadComment,
    commentID: state.commentEditor.commentID,
    articleID: state.viewArticles.popup['articleID'],
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setCommentVisibility: (visible) => {
      dispatch(setCommentVisibility(visible));
    },
    setCommentContent: (content) => {
      dispatch(setCommentContent(content));
    },
    setCommentLinkPopup: (linkPopup) => {
      dispatch(setCommentLinkPopup(linkPopup));
    },
    setLoadComment: (value) => {
      dispatch(setLoadComment(value));
    },
    setLoadComments: (value) => {
      dispatch(setLoadComments(value));
    },
    resetCommentEditor: () => {
      dispatch(resetCommentEditor());
    },
  }
}

const CommentEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentEditor)

export default CommentEditorContainer;
