import {
  connect
} from 'react-redux';
import Comment from '../Components/Comment';
import {
  setCommentHover,
  setLoadComment,
  setCommentID,
  setCommentContent,
  setCommentVisibility,
  setLoadComments,
  userStateValues,
} from '../actions.js'

const mapStateToProps = (state, ownProps) => {
  //console.log(ownProps.articleIndex);
  //console.log(ownProps.id);
  return {
   comment: state.comments.comments[ownProps.index],
    canEdit: true, //needs to be changed when login system is implemented to only allow user to edit there own comments
    onHover: state.comments.commentHover === ownProps.index,
    articleID: state.comments.articleID,
    isUsersComment: state.comments.comments[ownProps.index]['user_id'] === state.page.userID,
    userIsEditor: state.page.userState === userStateValues.EDITOR,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setCommentHover: id => {
      dispatch(setCommentHover(id));
    },
    setLoadComment: value => {
      dispatch(setLoadComment(value));
    },
    setCommentID: id => {
      dispatch(setCommentID(id));
    },
    setCommentContent: content => {
      dispatch(setCommentContent(content));
    },
    setCommentVisibility: visibility => {
      dispatch(setCommentVisibility(visibility));
    },
    setLoadComments: (value) => {
      dispatch(setLoadComments(value));
    },
    //needs edit comment and delete comment
  }
}

const CommentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Comment)

export default CommentContainer;
