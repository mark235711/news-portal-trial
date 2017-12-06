import { connect } from 'react-redux';
import Page from '../Components/Page';
import {setUsername, setUserID, setUserState} from '../actions';


const mapStateToProps = state => {
  return {
      currentPage: state.page.currentPage,
      otherData: state.page.otherData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUsername: username => {
      dispatch(setUsername(username));
    },
    setUserID: id => {
      dispatch(setUserID(id));
    },
    setUserState: userState => {
      dispatch(setUserState(userState));
    },
  }
}

const PageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)

export default PageContainer;
