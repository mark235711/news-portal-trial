import { connect } from 'react-redux';
import {
  setPage,
  setTitle,
  setTeaser,
  setContent,
  addContentSection,
  setEditArticlePopup,
  setShowCreateSectionButtons,
  setEditArticleID,
  setEditArticlePublished,
  setUpdateEditors,
} from '../actions';
import EditArticle from '../Components/EditArticle';


const mapStateToProps = (state, ownProps) => {
  return {
    title: state.editArticle.title,
    teaser: state.editArticle.teaser,
    editorSectionsContent: state.editArticle.editorSectionsContent,
    //editorSections: state.editArticle.editorSections,
    //editorStates: state.editArticle.editorStates,
    published: state.editArticle.published,
    popupType: state.editArticle.popupType,
    articleID: state.editArticle.articleID,
    showCreateSectionButtons: state.editArticle.showCreateSectionButtons,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setPage: type => {
      console.log(type);

        dispatch(setPage(type));
    },
    setTitle: title => {
        dispatch(setTitle(title));
    },
    setTeaser: teaser => {
        dispatch(setTeaser(teaser));
    },
    setContent: (sectionsContent) => {
      dispatch(setContent(sectionsContent));
    },
    addContentSection: sectionType => {
      dispatch(addContentSection(sectionType));
    },
    setPopupType: popupType => {
      dispatch(setEditArticlePopup(popupType));
    },
    setShowCreateSectionButtons: value => {
      dispatch(setShowCreateSectionButtons(value));
    },
    setArticleID: id => {
      dispatch(setEditArticleID(id));
    },
    setEditArticlePublished: published => {
      dispatch(setEditArticlePublished(published));
    },

    setUpdateEditors: value => {
      dispatch(setUpdateEditors(value));
    },

  }
}

const EditArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticle)

export default EditArticleContainer;
