import { connect } from 'react-redux';
import { viewArticlesTypes, setArticles , pageValues} from '../actions';
import ViewArticles from '../Components/ViewArticles';

function getViewArticlesType(page)
{
  switch(page.currentPage)
  {
    case pageValues.VIEWARTICLES:
      return viewArticlesTypes.PUBLISHED_ARTICLES;
    case pageValues.VIEWYOURARTICLES:
      return viewArticlesTypes.YOUR_ARTICLES;
    case pageValues.VIEWARTICLESTOBEAPPROVED:
      return viewArticlesTypes.TO_BE_APPROVED;
    case pageValues.VIEWPUBLISHEDARTICLESEDITMODE:
      return viewArticlesTypes.PUBLISHED_EDIT_MODE;
    default:
      break;
  }
}

const mapStateToProps = state => {
  return {
      viewArticlesType: getViewArticlesType(state.page),
      articles: state.viewArticles.articles,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setArticles: articles => {
        dispatch(setArticles(articles));
    }
  }
}

const ViewArticlesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewArticles)

export default ViewArticlesContainer;
