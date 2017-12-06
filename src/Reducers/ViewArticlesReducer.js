import {
  SET_ARTICLES,
  SET_VIEW_ARTICLES_LOADING,
  SET_ARTICLE_POPUP,
  SET_LIKE_ARTICLE,
} from '../actions';

const viewArticlesInitalState = {
  articles: [],
  popup: {'visible':false, 'articleID': 1},
  loading: true,
}
function ViewArticlesReducer(state = viewArticlesInitalState, action) {
  switch(action.type)
  {
    case SET_ARTICLES:
      return Object.assign({}, state, {
        articles: action.articles
      });
    case SET_VIEW_ARTICLES_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      });
    case SET_ARTICLE_POPUP:
      return Object.assign({}, state, {
        popup: {'visible':action.visible, 'articleID': action.articleID}
      });
    case SET_LIKE_ARTICLE:

      let newArticles = [];
      newArticles = [];
      for(let i = 0; i < state.articles.length; i++)
      {
        if(state.articles[i]['id'] === state.popup['articleID'])
        {
          var newLikes = state.articles[i]['likes'];
          if(action.value === true)
            newLikes += 1;
          else
            newLikes -= 1;
  
          newArticles[i] = Object.assign({}, state.articles[i], {
            like: action.value,
            likes: newLikes,
          });
        }
        else
        {
          newArticles[i] = Object.assign({}, state.articles[i]);
        }
      }
      return Object.assign({}, state, {
        articles: newArticles,
      });
    default:
        return state;
  }
}
export default ViewArticlesReducer;
