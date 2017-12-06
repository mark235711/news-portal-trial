import { combineReducers } from 'redux';
import page from './PageReducer';
import viewArticles from './ViewArticlesReducer';
import commentEditor from './CommentEditorReducer';
import comments from './CommentsReducer';
import editArticle from './EditArticleReducer';

const app = combineReducers({
  page,
  viewArticles,
  commentEditor,
  comments,
  editArticle,
})

export default app;
