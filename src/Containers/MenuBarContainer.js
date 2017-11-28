import { connect } from 'react-redux';
import { setPage, resetEditArticle } from '../actions';
import MenuBar from '../Components/MenuBar';

const mapStateToProps = state => {
  return {
    userState: state.page.userState,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setPage: type => {
        dispatch(setPage(type));
    },
    resetEditArticle: () => {
      dispatch(resetEditArticle());
    },
  }
}

const MenuBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar)

export default MenuBarContainer;
