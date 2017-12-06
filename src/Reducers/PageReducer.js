import {
  SET_PAGE,
  pageValues,
  SET_OTHER_DATA,
  SET_USER_STATE,
  userStateValues,
  SET_USERNAME,
  SET_USER_ID,
} from '../actions';


const pageInitalState = {
  currentPage: pageValues.LOGIN,
  otherData: '', //may not be needed, look into
  userState: userStateValues.EDITOR, //used to store weather the user is an contributor editor or viewer
  username: '',
  userID: null,
}
function PageReducer(state = pageInitalState, action) {

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
    case SET_USERNAME:
      return Object.assign({}, state, {
        username: action.username
      });
    case SET_USER_ID:
      return Object.assign({}, state, {
        userID: action.id
      });
    default:
        return state;
  }
}
 export default PageReducer;
