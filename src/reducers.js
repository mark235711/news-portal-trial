



/*
list of reducers needed
app: needed for managing what page is shown

article:used to store it's title ,teaser, content published status , several popup and button states
viewArticles: 3 boolean values to show what types of articles to show and what actions to allow and an array of articles




//following 2 may not be needed
login: used for managing the username and password fields
createAccount: similar to login but with username email password and confurm password

*/

import { combineReducers } from 'redux';
import {
  SET_PAGE,
  pageValues,
  SET_OTHER_DATA,
  SET_USER_STATE,
  userStateValues,
  SET_ARTICLES,
  SET_ARTICLE_POPUP,
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
  MOVE_CONTENT_SECTION,
  SWITCH_CONTENT_SECTION,
  moveContentSectionValues,
  SET_EDITOR_EXTRA_CONTROLS,
  editorExtraControlTypes,
  SET_EDITOR_EXTRA_CONTROL_URL,
  SET_EDITOR_FOCUS,
  SET_UPDATE_EDITOR,
  SET_UPDATE_EDITORS,
 } from './actions';


const pageInitalState = {
  currentPage: pageValues.LOGIN,
  otherData: '',
  userState: userStateValues.EDITOR,
}
function page(state = pageInitalState, action) {

  switch(action.type)
  {
    case SET_PAGE:
       return Object.assign({}, state, {
         currentPage: action.pageValue
       });
    case SET_OTHER_DATA:
      return Object.assign({}, state, {
        otherData: action.otherData
      });
    case SET_USER_STATE:
      return Object.assign({}, state, {
        userState: action.userState
      });
    default:
        return state;
  }
}

const viewArticlesInitalState = {
  articles: [],
  popup: {'visible':false, 'articleID': 1},
}
function viewArticles(state = viewArticlesInitalState, action)
{
  switch(action.type)
  {
    case SET_ARTICLES:
      return Object.assign({}, state, {
        articles: action.articles
      });
    case SET_ARTICLE_POPUP:
      return Object.assign({}, state, {
        popup: {'visible':action.visible, 'articleID': action.articleID}
      });
    default:
        return state;
  }
}




const editArticleInitalState = {
  title: '',
  teaser: '',
  editorSectionsContent: [['<p><br></p>', '<p><br></p>'], ['<p><br></p>', '<p><br></p>'], ['<p><br></p>', '<p><br></p>']],
  updateEditorSectionsContent: [[false, false], [false, false], [false, false]],
  articleID: null,
  published: 0, //0 means not published
  createMode: false,
  popupType: editArticlePopups.NONE,
  showCreateSectionButtons: false,
  editorExtraControlType: editorExtraControlTypes.NONE,
  editorExtraControlURL: '',
  editorFocusID: -1,
}

function setUpdateEditorSectionsContentTrue(row)
{
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

function editArticle(state = editArticleInitalState, action)
{
  switch (action.type) {
    case RESET_EDIT_ARTICLE:
    {
      var newState = editArticleInitalState;
      return newState;
    }
    case SET_TITLE:
    {
        return Object.assign({}, state, {
        title: action.title
      });
    }
    case SET_TEASER:
    {
        return Object.assign({}, state, {
        teaser: action.teaser
      });
    }
    case SET_CONTENT:
    {
        let newUpdateEditorSectionsContent = [];
        for(let i = 0; i < action.sectionsContent.length; i++)
        {
          newUpdateEditorSectionsContent[i] = [];
          for(let j = 0; j < action.sectionsContent[i].length; j++)
          {
            newUpdateEditorSectionsContent[i][j] = 'false';
          }
        }

        return Object.assign({}, state, {
        editorSectionsContent: action.sectionsContent,
        updateEditorSectionsContent: newUpdateEditorSectionsContent,
      });
    }
    case SET_CONTENT_SECTION:
    {
      //makes a deep copy of editorSectionsContent
      var newEditorSectionsContent = [];
      for(let i = 0; i < state.editorSectionsContent.length; i++)
      {
        newEditorSectionsContent[i] = [...state.editorSectionsContent[i].slice()];
      }
      newEditorSectionsContent[action.row][action.col] = action.contentSection;

      return Object.assign({}, state, {
       editorSectionsContent: newEditorSectionsContent
      });
    }
    case ADD_CONTENT_SECTION:
    {
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
        updateEditorSectionsContent: newUpdateEditorSectionsContent
      });
    }
    case REMOVE_CONTENT_SECTION:
    {
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

      return Object.assign({}, state, {
        editorSectionsContent: newEditorSectionsContent,
        updateEditorSectionsContent: newUpdateEditorSectionsContent
      });
    }
    case SET_EDIT_ARTICLE_POPUP:
    {
      return Object.assign({}, state, {
        popupType: action.popupType
      });
    }
    case SET_EDIT_ARTICLE_ID:
    {
      return Object.assign({}, state, {
        articleID: action.articleID
      });
    }
    case SET_EDIT_ARTICLE_PUBLISHED:
    {
      return Object.assign({}, state, {
        published: action.published
      });
    }
    case SET_SHOW_CREATE_SECTION_BUTTONS:
    {
      return Object.assign({}, state, {
        showCreateSectionButtons: action.value
      });
    }
    case MOVE_CONTENT_SECTION:
    {
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
          updateEditorSectionsContent: newUpdateEditorSectionsContent
        });
    }
    case SWITCH_CONTENT_SECTION:
    {
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
        updateEditorSectionsContent: newUpdateEditorSectionsContent
      });
    }
    case SET_EDITOR_EXTRA_CONTROLS:
    {
      return Object.assign({}, state, {
        editorExtraControlType: action.editorExtraControlType
      });
    }
    case SET_EDITOR_EXTRA_CONTROL_URL:
    {
      return Object.assign({}, state, {
        editorExtraControlURL: action.url
      });
    }
    case SET_EDITOR_FOCUS:
    {
      return Object.assign({}, state, {
        editorFocusID: action.id
      });
    }
    // case SET_EDITOR_STATE:
    //   console.log('set editor state');
    //   console.log("!!ERROR THIS SHOULDN'T BE CALLED!!");
    //   //makes a deep copy of editorStates
    //   var newEditorStates = [];
    //   for(var i = 0; i < state.editorStates.length; i++)
    //   {
    //     newEditorStates[i] = [...state.editorStates[i].slice()];
    //   }
    //   //newEditorStates[action.row][action.col] = convertToRaw(action.editorState.getCurrentContent());
    //
    //   console.log(stateToHTML(action.editorState.getCurrentContent()));
    //
    //   return Object.assign({}, state, {
    //     editorStates: newEditorStates
    //   });
    // case SET_EDITOR_STATES:
    // console.log("!!ERROR THIS SHOULDN'T BE CALLED!!");
    //
    // var editorStates = [];
    // for(var i = 0; i < action.editorStates.length; i++)
    // {
    //   editorStates[i] = [];
    //   for(var j = 0; j < action.editorStates[i].length; j++)
    //   {
    //     //editorStates[i][j] = convertToRaw(action.editorStates[i][j].getCurrentContent());
    //   }
    // }
    // console.log('did this work?');
    // //console.log(stateToHTML(action.editorStates[0][0].getCurrentContent()));
    //
    //   return Object.assign({}, state, {
    //     editorStates: editorStates
    //   });

    case SET_UPDATE_EDITOR:
    {
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
    case SET_UPDATE_EDITORS:
    {
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
    default:
      return state;
  }
}



const app = combineReducers({
  page,
  viewArticles,
  editArticle
})

export default app;
