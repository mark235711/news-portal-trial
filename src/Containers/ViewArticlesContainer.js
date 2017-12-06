import { connect } from 'react-redux';
import { viewArticlesTypes, setArticles , pageValues, setViewArticlesLoading} from '../actions';
import ViewArticles from '../Components/ViewArticles';

function getViewArticlesType(page)
{
  switch(page.currentPage)
  {
    case pageValues.VIEW_ARTICLES:
      return viewArticlesTypes.PUBLISHED_ARTICLES;
    case pageValues.VIEW_YOUR_ARTICLES:
      return viewArticlesTypes.YOUR_ARTICLES;
    case pageValues.VIEW_ARTICLES_TO_BE_APPROVED:
      return viewArticlesTypes.TO_BE_APPROVED;
    case pageValues.VIEW_PUBLISHED_ARTICLES_EDIT_MODE:
      return viewArticlesTypes.PUBLISHED_EDIT_MODE;
    default:
      break;
  }
}

const mapStateToProps = state => {
  return {
      viewArticlesType: getViewArticlesType(state.page),
      articles: state.viewArticles.articles,
      loading: state.viewArticles.loading,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setArticles: articles => {
        dispatch(setArticles(articles));
    },
    setViewArticlesLoading: loading => {
        dispatch(setViewArticlesLoading(loading));
    },
  }
}

const ViewArticlesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewArticles)

export default ViewArticlesContainer;
