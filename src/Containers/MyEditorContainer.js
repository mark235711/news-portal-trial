import { connect } from 'react-redux';
import {
  setContentSection,
  removeContentSection,
  setEditorExtraControls,
  setExtraControlURL,
  setEditorFocus,
  setUpdateEditor,
  moveContentSection,
  switchContentSection,
  setAutosaveCounter,
} from '../actions';
import MyEditor from '../Components/MyEditor';

const mapStateToProps = (state, ownProps) => {
  //console.log(stateToHTML(state.editArticle.editorStates[ownProps.row][ownProps.col].getCurrentContent()));
  return {
    //content: state.editArticle.editorSectionsContent[ownProps.row][ownProps.col],
    editorExtraControlType: state.editArticle.editorExtraControlType,
    editorFocusID: state.editArticle.editorFocusID,
    editorSectionContent: state.editArticle.editorSectionsContent[ownProps.row][ownProps.col],
    updateEditorSectionContent: state.editArticle.updateEditorSectionsContent[ownProps.row][ownProps.col],
    editorSectionsContent: state.editArticle.editorSectionsContent
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setContentSection: (row, col, content) => {
      dispatch(setContentSection(row, col, content));
    },
    removeContentSection: (row, col) => {
      dispatch(removeContentSection(row, col));
    },
    setEditorExtraControls: (editorExtraControlType) => {
      dispatch(setEditorExtraControls(editorExtraControlType));
    },
    setExtraControlURL: (url) => {
      dispatch(setExtraControlURL(url));
    },
    setEditorFocus: (id) => {
      dispatch(setEditorFocus(id));
    },
    setUpdateEditor: (row, col, value) => {
      dispatch(setUpdateEditor(row, col, value));
    },
    moveContentSection: (row, col, moveValue) => {
      dispatch(moveContentSection(row, col, moveValue));
    },
    switchContentSection: (row1, col1, row2, col2) => {
      dispatch(switchContentSection(row1, col1, row2, col2));
    },
    setAutosaveCounter: (autosaveCounter) => {
      dispatch(setAutosaveCounter(autosaveCounter));
    },

  }
}

const MyEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyEditor)

export default MyEditorContainer;
