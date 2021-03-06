import {
  RESET_EDIT_ARTICLE,
  SET_TITLE,
  SET_TEASER,
  SET_CONTENT,
  SET_CONTENT_SECTION,
  ADD_CONTENT_SECTION,
  REMOVE_CONTENT_SECTION,
  SET_EDIT_ARTICLE_POPUP,
  editArticlePopups,
  SET_EDIT_ARTICLE_ID,
  SET_EDIT_ARTICLE_PUBLISHED,
  SET_SHOW_CREATE_SECTION_BUTTONS,
  savingInfoTypes,
  SET_SAVING_INFO,
  MOVE_CONTENT_SECTION,
  SWITCH_CONTENT_SECTION,
  moveContentSectionValues,
  SET_EDITOR_EXTRA_CONTROLS,
  editorExtraControlTypes,
  SET_EDITOR_EXTRA_CONTROL_URL,
  SET_EDITOR_FOCUS,
  SET_UPDATE_EDITOR,
  SET_UPDATE_EDITORS,
  SET_AUTOSAVE_COUNTER,
  SET_SHOW_TITLE_TOOLTIP,
  SET_EDIT_ARTICLE_LOADING,
} from '../actions';

const editArticleInitalState = {
  title: '',
  teaser: '',
  editorSectionsContent: [],
  updateEditorSectionsContent: [[false, false], [false, false], [false, false]],
  articleID: null,
  published: 0, //0 means not published
  createMode: false,
  popupType: editArticlePopups.NONE,
  showCreateSectionButtons: false,
  savingInfoType: savingInfoTypes.NONE,
  editorExtraControlType: editorExtraControlTypes.NONE,
  editorExtraControlURL: '',
  editorFocusID: -1,
  autosaveCounter: 0, //counts number of alterations since last save to database
  titleTooltip: false,
  loading: false,
}

const editArticleNullState = {
  value: null,
}

function setUpdateEditorSectionsContentTrue(row) {
  var newRow = [];
  switch(row.length) //determines if the row has 1,2 or 3 Columns
  {
    case 1:
      newRow = [true];
      break;
    case 2:
      newRow = [true, true];
      break;
    case 3:
    newRow = [true, true, true];
      break;
    default:
      break;
  }
  return newRow;
}


//functions that have are used for action types as they would be to large for the switch statement
function setContent(state, action) {
  let newUpdateEditorSectionsContent = [];
  for(let i = 0; i < action.sectionsContent.length; i++)
  {
    newUpdateEditorSectionsContent[i] = [];
    for(let j = 0; j < action.sectionsContent[i].length; j++)
    {
      newUpdateEditorSectionsContent[i][j] = false;
    }
  }

  return Object.assign({}, state, {
    editorSectionsContent: action.sectionsContent,
    updateEditorSectionsContent: newUpdateEditorSectionsContent,
  });
}
function setContentSection(state, action) {
  let newAutosaveCounter = state.autosaveCounter + 1;
  //makes a deep copy of editorSectionsContent
  var newEditorSectionsContent = [];
  for(let i = 0; i < state.editorSectionsContent.length; i++)
  {
    newEditorSectionsContent[i] = [...state.editorSectionsContent[i].slice()];
  }
  newEditorSectionsContent[action.row][action.col] = action.contentSection;

  return Object.assign({}, state, {
   editorSectionsContent: newEditorSectionsContent,
   autosaveCounter: newAutosaveCounter,
  });
}
function addContentSection(state, action) {
  let newAutosaveCounter = state.autosaveCounter + 1;
  //makes a deep copy of editorSections

  //makes a deep copy of editorSectionsContent and updateEditorSectionsContent
  let newEditorSectionsContent = [];
  let newUpdateEditorSectionsContent = [];
  for(let i = 0; i < state.editorSectionsContent.length; i++)
  {
    newEditorSectionsContent[i] = [...state.editorSectionsContent[i].slice()];
    newUpdateEditorSectionsContent[i] = [...state.updateEditorSectionsContent[i].slice()];
  }

  //depending on the action.sectionType determines what is added to the editor section content
  switch (action.sectionType) {
    case 1:
      newEditorSectionsContent[newEditorSectionsContent.length] = ['<p><br></p>'];
      newUpdateEditorSectionsContent[newUpdateEditorSectionsContent.length] = [false];
      break;
    case 2:
      newEditorSectionsContent[newEditorSectionsContent.length] = ['<p><br></p>', '<p><br></p>'];
      newUpdateEditorSectionsContent[newUpdateEditorSectionsContent.length] = [false, false];
      break;
    case 3:
      newEditorSectionsContent[newEditorSectionsContent.length] = ['<p><br></p>', '<p><br></p>', '<p><br></p>'];
      newUpdateEditorSectionsContent[newUpdateEditorSectionsContent.length] = [false, false, false];
      break;
    default:
      break;
  }
  return Object.assign({}, state, {
    editorSectionsContent: newEditorSectionsContent,
    updateEditorSectionsContent: newUpdateEditorSectionsContent,
    autosaveCounter: newAutosaveCounter,
  });
}
function removeContentSection(state, action) {
  let newAutosaveCounter = state.autosaveCounter + 1;
  let newEditorSectionsContent = [];
  let newUpdateEditorSectionsContent = [];
  let outputPos = 0; //similar to i but doesn't increment when row is skipped
  for(let i = 0; i < state.editorSectionsContent.length; i++)
  {
    if(action.row !== i)
    {
      newEditorSectionsContent[outputPos] = [...state.editorSectionsContent[i].slice()];
      if(action.row > i) //if the row is above it keeps it's previous value
        newUpdateEditorSectionsContent[outputPos] = [...state.updateEditorSectionsContent[i].slice()];
      else //if the row is below the update value is set to true as it needs to be updated
        newUpdateEditorSectionsContent[outputPos] = setUpdateEditorSectionsContentTrue(state.updateEditorSectionsContent[i]);

      outputPos++;
    }
  }
  //returns a new state with the new values
  console.log(newEditorSectionsContent);
  return Object.assign({}, state, {
    editorSectionsContent: newEditorSectionsContent,
    updateEditorSectionsContent: newUpdateEditorSectionsContent,
    autosaveCounter: newAutosaveCounter,
  });
}
function moveContentSection(state, action) {
  let newAutosaveCounter = state.autosaveCounter + 1;
  let newEditorSectionsContent = [];
  let newUpdateEditorSectionsContent = [];

  for(var i = 0; i < state.editorSectionsContent.length; i++)
  {
    newEditorSectionsContent[i] = [...state.editorSectionsContent[i].slice()];
    newUpdateEditorSectionsContent[i] = [...state.updateEditorSectionsContent[i].slice()];
  }

  let value = 0;
  if(action.moveValue === moveContentSectionValues.UP || action.moveValue === moveContentSectionValues.LEFT)
    value = -1;
  else if(action.moveValue === moveContentSectionValues.DOWN || action.moveValue === moveContentSectionValues.RIGHT)
    value = 1;

  switch(action.moveValue)
  {
    case moveContentSectionValues.UP:
    case moveContentSectionValues.DOWN:
    {
      let temprow = newEditorSectionsContent[action.row];
      newEditorSectionsContent[action.row] = newEditorSectionsContent[action.row + value];
      newEditorSectionsContent[action.row + value] = temprow;

      newUpdateEditorSectionsContent[action.row] = setUpdateEditorSectionsContentTrue(newUpdateEditorSectionsContent[action.row]);
      newUpdateEditorSectionsContent[action.row + value] = setUpdateEditorSectionsContentTrue(newUpdateEditorSectionsContent[action.row + value]);
      break;
    }
    case moveContentSectionValues.LEFT:
    case moveContentSectionValues.RIGHT:
    {
      console.log(newEditorSectionsContent);
      let tempcol = newEditorSectionsContent[action.row][action.col];
      newEditorSectionsContent[action.row][action.col] = newEditorSectionsContent[action.row][action.col + value];
      newEditorSectionsContent[action.row][action.col + value] = tempcol;
      console.log(newEditorSectionsContent);
      console.log(action.row);
      console.log(action.col);
      newUpdateEditorSectionsContent[action.row] = setUpdateEditorSectionsContentTrue(newUpdateEditorSectionsContent[action.row]);
      break;
    }
    default:
        break;
    }
    return Object.assign({}, state, {
      editorSectionsContent: newEditorSectionsContent,
      updateEditorSectionsContent: newUpdateEditorSectionsContent,
      autosaveCounter: newAutosaveCounter,
    });
}
function switchContentSection(state, action) {
  let newAutosaveCounter = state.autosaveCounter + 1;
  let newEditorSectionsContent = [];
  let newUpdateEditorSectionsContent = [];

  for(let i = 0; i < state.editorSectionsContent.length; i++)
  {
    newEditorSectionsContent[i] = [...state.editorSectionsContent[i].slice()];
    newUpdateEditorSectionsContent[i] = [...state.updateEditorSectionsContent[i].slice()];
  }
  newUpdateEditorSectionsContent[action.row1][action.col1] = true;
  newUpdateEditorSectionsContent[action.row2][action.col2] = true;
  var temp = newEditorSectionsContent[action.row1][action.col1];
  newEditorSectionsContent[action.row1][action.col1] = newEditorSectionsContent[action.row2][action.col2];
  newEditorSectionsContent[action.row2][action.col2] = temp;

  return Object.assign({}, state, {
    editorSectionsContent: newEditorSectionsContent,
    updateEditorSectionsContent: newUpdateEditorSectionsContent,
    autosaveCounter: newAutosaveCounter,
  });
}
function setUpdateEditor(state, action) {
  //creates an array that stores the new values that determines if each editor us updated
  let updateEditorContent = [];
  for(let i = 0; i < state.updateEditorSectionsContent.length; i++)
  {
    updateEditorContent[i] = [...state.updateEditorSectionsContent[i].slice()];
  }
  updateEditorContent[action.row][action.col] = action.value;
  return Object.assign({}, state, {
    updateEditorSectionsContent: updateEditorContent
  });
}
function setUpdateEditors(state, action) {
  //creates an array that stores the new values that determines if each editor us updated
  let updateEditorContent = [];
  for(let i = 0; i < state.editorSectionsContent.length; i++)
  {
    updateEditorContent[i] = [];
    for(var j = 0; j < state.editorSectionsContent[i].length; j++)
    {
      updateEditorContent[i][j] = action.value;
    }
  }
  return Object.assign({}, state, {
    updateEditorSectionsContent: updateEditorContent
  });
}





function EditArticleReducer(state = editArticleNullState, action)
{
  switch (action.type) {
    case RESET_EDIT_ARTICLE:
    {
      let newState = editArticleInitalState;
      return newState;
    }
    case SET_TITLE:
    {
      let newAutosaveCounter = state.autosaveCounter;
      if(action.useCounter)
        newAutosaveCounter++;

      return Object.assign({}, state, {
        title: action.title,
        autosaveCounter: newAutosaveCounter,
      });
    }
    case SET_TEASER:
    {
      let newAutosaveCounter = state.autosaveCounter;
      if(action.useCounter)
        newAutosaveCounter++;

      return Object.assign({}, state, {
        teaser: action.teaser,
        autosaveCounter: newAutosaveCounter,
      });
    }
    case SET_CONTENT:
      return setContent(state, action);
    case SET_CONTENT_SECTION:
      return setContentSection(state, action);
    case ADD_CONTENT_SECTION:
      return addContentSection(state, action);
    case REMOVE_CONTENT_SECTION:
      return removeContentSection(state, action);
    case SET_EDIT_ARTICLE_POPUP:
      return Object.assign({}, state, {
        popupType: action.popupType
      });
    case SET_EDIT_ARTICLE_ID:
      return Object.assign({}, state, {
        articleID: action.articleID
      });
    case SET_EDIT_ARTICLE_PUBLISHED:
      return Object.assign({}, state, {
        published: action.published
      });
    case SET_SHOW_CREATE_SECTION_BUTTONS:
      return Object.assign({}, state, {
        showCreateSectionButtons: action.value
      });
    case SET_SAVING_INFO:
      return Object.assign({}, state, {
        savingInfoType: action.value
      });
    case MOVE_CONTENT_SECTION:
      return moveContentSection(state, action);
    case SWITCH_CONTENT_SECTION:
      return switchContentSection(state, action);
    case SET_EDITOR_EXTRA_CONTROLS:
      return Object.assign({}, state, {
        editorExtraControlType: action.editorExtraControlType
      });
    case SET_EDITOR_EXTRA_CONTROL_URL:
      return Object.assign({}, state, {
        editorExtraControlURL: action.url
      });
    case SET_EDITOR_FOCUS:
      return Object.assign({}, state, {
        editorFocusID: action.id
      });
    case SET_UPDATE_EDITOR:
      return setUpdateEditor(state, action);
    case SET_UPDATE_EDITORS:
      return setUpdateEditors(state, action);
    case SET_AUTOSAVE_COUNTER:
      return Object.assign({}, state, {
        autosaveCounter: action.autosaveCounter
      });
    case SET_SHOW_TITLE_TOOLTIP:
      return Object.assign({}, state, {
        titleTooltip: action.value,
      });
    case SET_EDIT_ARTICLE_LOADING:
      return Object.assign({}, state, {
        loading: action.loading,
      });
    default:
      return state;
  }
}
export default EditArticleReducer;
