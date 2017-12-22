//this file contains variables that can easly be changed all in one place

//used in EditArticle, the number of redux state chages it gets before it updates
export const AUTOSAVE_CHANGE_LIMIT = 10;

//used in EditArticle, the maximum number of lines the teaser text can have
export const TEASER_TEXT_MAX_LINES = 4;

//used in EditArticle, the maximum number of characters on one line for the teaser text
export const TEASER_TEXT_CHAR_LINE_LIMIT = 40;


//used in MyEditor, the max number of chars before an update is pushed to the redux state, (also waits for end of word)
export const MAX_CHAR_NOT_UPDATED = 15;

//used in MyEditor and EDitArticle, the maximum amount of time before an autosave can occur
export const MAX_WAIT_AUTOSAVE = 10000; //in miliseconds, 1000 = 1 sec

export const COMMENT_MAX_CHAR_LIMIT = 1000; //the maximum number of characters that can be used in a comment

//urls used for different functionality

export const GET_USER_DATA_URL = 'http://homestead.app/getuserdata'; //only used for testing

//urls used in the EditArticle
export const LOAD_ARTICLE_URL = 'http://homestead.app/loadarticle';
export const CREATE_ARTICLE_URL = 'http://homestead.app/createarticle';
export const EDIT_ARTICLE_URL = 'http://homestead.app/editarticle';
export const DELETE_ARTICLE_URL = 'http://homestead.app/deletearticle';
export const SUBMIT_ARTICLE_FOR_REVIEW_URL = 'http://homestead.app/submitarticleforreview';
export const PUBLISH_ARTICLE_URL = 'http://homestead.app/publisharticle';
export const PUSH_BACK_ARTICLE_URL = 'http://homestead.app/pushbackarticle';


//urls used in ViewArticles
export const VIEW_ALL_ARTICLES_URL = 'http://homestead.app/viewallarticles';
export const VIEW_ALL_YOUR_ARTICLES_URL = 'http://homestead.app/viewallyourarticles';
export const VIEW_ALL_PENDING_ARTICLES_URL = 'http://homestead.app/viewallpendingarticles';
export const VIEW_ALL_PUBLISHED_ARTICLES_URL = 'http://homestead.app/viewallpublishedarticles';

export const POST_COMMENT_URL = 'http://homestead.app/commentOnArticle';
export const DELETE_COMMENT_URL = 'http://homestead.app/deleteComment';
export const LIKE_COMMENT_URL = 'http://homestead.app/likeComment';
export const LIKE_ARTICLE_URL = 'http://homestead.app/likeArticle';
//urls used in Article
export const VIEW_ALL_COMMENTS_FOR_ARTICLE_URL = 'http://homestead.app/viewAllArticleComments';
