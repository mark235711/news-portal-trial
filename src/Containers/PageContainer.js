import { connect } from 'react-redux';
import Page from '../Components/Page';


const mapStateToProps = state => {
  return {
      currentPage: state.page.currentPage,
      otherData: state.page.otherData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const PageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)

export default PageContainer;
