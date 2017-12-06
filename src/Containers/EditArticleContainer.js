import { connect } from 'react-redux';
import {
  setPage,
  setTitle,
  setTeaser,
  setContent,
  addContentSection,
  setEditArticlePopup,
  setShowCreateSectionButtons,
  setSavingInfo,
  setEditArticleID,
  setEditArticlePublished,
  setUpdateEditors,
  setAutosaveCounter,
  setShowTitleTooltip,
  setEditArticleLoading,
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
    savingInfoType: state.editArticle.savingInfoType,
    autosaveCounter: state.editArticle.autosaveCounter,
    titleTooltip: state.editArticle.titleTooltip,
    loading: state.editArticle.loading,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setPage: type => {
      console.log(type);
      dispatch(setPage(type));
    },
    setTitle: (title, useCounter) => {
        dispatch(setTitle(title, useCounter));
    },
    setTeaser: (teaser, useCounter) => {
        dispatch(setTeaser(teaser, useCounter));
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
    setSavingInfo: value => {
      dispatch(setSavingInfo(value));
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
    setAutosaveCounter: autosaveCounter => {
      dispatch(setAutosaveCounter(autosaveCounter));
    },
    setShowTitleTooltip: value => {
      dispatch(setShowTitleTooltip(value));
    },
    setEditArticleLoading: value => {
      dispatch(setEditArticleLoading(value));
    },
  }
}

const EditArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticle)

export default EditArticleContainer;
