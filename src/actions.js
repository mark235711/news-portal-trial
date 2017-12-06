

//PageReducer
export const SET_PAGE = 'SET_PAGE';
export const SET_OTHER_DATA = 'SET_OTHER_DATA';
export const SET_USER_STATE = 'SET_USER_STATE';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_USER_ID = 'SET_USER_ID';
export const pageValues = {
  LOGIN: 'LOGIN',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  EDIT_ARTICLE: 'EDIT_ARTICLE',
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  VIEW_ARTICLES: 'VIEW_ARTICLES',
  VIEW_YOUR_ARTICLES: 'VIEW_YOUR_ARTICLES',
  VIEW_ARTICLES_TO_BE_APPROVED: 'VIEW_ARTICLES_TO_BE_APPROVED',
  VIEW_PUBLISHED_ARTICLES_EDIT_MODE: 'VIEW_PUBLISHED_ARTICLES_EDIT_MODE',
}
export const userStateValues = {
  VIEWER: 'VIEWER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  EDITOR: 'EDITOR',
}

export function setPage(pageValue) {
  return { type: SET_PAGE, pageValue};
}
export function setData(otherData) {
  return { type: SET_OTHER_DATA, otherData};
}
export function setUserState(userState) {
  return { type: SET_USER_STATE, userState};
}
export function setUsername(username) {
  return { type: SET_USERNAME, username};
}
export function setUserID(id) {
  return { type: SET_USER_ID, id};
}



//ViewArticlesReducer
export const viewArticlesTypes = {
   PUBLISHED_ARTICLES: 'PUBLISHED_ARTICLES',
   YOUR_ARTICLES: 'YOUR_ARTICLES',
   TO_BE_APPROVED: 'TO_BE_APPROVED',
   PUBLISHED_EDIT_MODE: 'PUBLISHED_EDIT_MODE',
}
export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_VIEW_ARTICLES_LOADING = 'SET_VIEW_ARTICLES_LOADING';
export const SET_ARTICLE_POPUP = 'SET_ARTICLE_POPUP';
export const SET_LIKE_ARTICLE = 'SET_LIKE_ARTICLE';

export function setArticles(articles) {
  return { type: SET_ARTICLES, articles}
}
export function setViewArticlesLoading(loading) {
  return { type: SET_VIEW_ARTICLES_LOADING, loading}
}
export function setArticlePopup(articleID, visible) {
  return { type: SET_ARTICLE_POPUP, articleID, visible}
}
export function setLikeArticle(value) {
  return { type: SET_LIKE_ARTICLE, value}
}



//CommentEditorReducer
export const SET_COMMENT_VISIBILITY = 'SET_COMMENT_VISIBILITY';
export const SET_COMMENT_CONTENT = 'SET_COMMENT_CONTENT';
export const SET_COMMENT_LINK_POPUP = 'SET_COMMENT_LINK_POPUP';
export const SET_LOAD_COMMENT = 'SET_LOAD_COMMENT';
export const SET_LIKE_COMMENT = 'SET_LIKE_COMMENT';
export const SET_COMMENT_ID = 'SET_COMMENT_ID';
export const RESET_COMMENT_EDITOR = 'RESET_COMMENT_EDITOR';

export function setCommentVisibility(visible) {
  return { type: SET_COMMENT_VISIBILITY, visible}
}
export function setCommentContent(content) {
  return { type: SET_COMMENT_CONTENT, content}
}
export function setCommentLinkPopup(linkPopup) {
  return { type: SET_COMMENT_LINK_POPUP, linkPopup}
}
export function setLoadComment(value) {
  return { type: SET_LOAD_COMMENT, value}
}
export function setLikeComment(value) {
  return { type: SET_LIKE_COMMENT, value}
}
export function setCommentID(id) {
  return { type: SET_COMMENT_ID, id}
}
export function resetCommentEditor() {
  return { type: RESET_COMMENT_EDITOR}
}



//CommentReducer
export const SET_COMMENTS = 'SET_COMMENTS';
export const SET_COMMENTS_ARTICLE_ID = 'SET_COMMENTS_ARTICLE_ID';
export const SET_LOAD_COMMENTS = 'SET_LOAD_COMMENTS';
export const SET_SHOW_COMMENTS = 'SET_SHOW_COMMENTS';
export const SET_COMMENTS_FILTER = 'SET_COMMENTS_FILTER';
export const commentsFilterValues = {
  MOST_LIKED: 'MOST_LIKED',
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
}
export const SET_COMMENT_HOVER = 'SET_COMMENT_HOVER';

export function setComments(comments) {
  return { type: SET_COMMENTS, comments}
}
export function setCommentsArticleID(articleID) {
  return { type: SET_COMMENTS_ARTICLE_ID, articleID}
}
export function setLoadComments(value) {
  return { type: SET_LOAD_COMMENTS, value}
}
export function setShowComments(value) {
  return { type: SET_SHOW_COMMENTS, value}
}
export function setCommentsFilter(value) {
  return { type: SET_COMMENTS_FILTER, value}
}
export function setCommentHover(id) {
  return { type: SET_COMMENT_HOVER, id}
}


//EditArticleReducer
export const RESET_EDIT_ARTICLE = 'RESET_EDIT_ARTICLE';
export const SET_TITLE = 'SET_TITLE';
export const SET_TEASER = 'SET_TEASER';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_CONTENT_SECTION = 'SET_CONTENT_SECTION';
export const ADD_CONTENT_SECTION = 'ADD_CONTENT_SECTION';
export const REMOVE_CONTENT_SECTION = 'REMOVE_CONTENT_SECTION';
export const SET_EDIT_ARTICLE_ID = 'SET_EDIT_ARTICLE_ID';
export const SET_EDIT_ARTICLE_PUBLISHED = 'SET_EDIT_ARTICLE_PUBLISHED';
export const SET_EDIT_ARTICLE_POPUP = 'SET_EDIT_ARTICLE_POPUP';
export const editArticlePopups = {
  NONE: 'NONE',
  DELETE_POPUP: 'DELETE_POPUP',
  SUBMIT_FOR_PUBLISHING_POPUP: 'SUBMIT_FOR_PUBLISHING_POPUP',
  PUSH_BACK_FOR_EDITING_POPUP: 'PUSH_BACK_FOR_EDITING_POPUP',
  PUBLISH_POPUP: 'PUBLISH_POPUP',
  PREVIEW_POPUP: 'PREVIEW_POPUP',
  TEMPLATE_POPUP: 'TEMPLATE_POPUP',
}
export const SET_SHOW_CREATE_SECTION_BUTTONS = 'SET_SHOW_CREATE_SECTION_BUTTONS';
export const SET_SAVING_INFO = 'SET_SAVING_INFO';
export const savingInfoTypes = {
  SAVING: 'SAVING',
  SAVECOMPLETE: 'SAVECOMPLETE',
  AUTOSAVING: 'AUTOSAVING',
  NONE: 'NONE',
  ERROR: 'ERROR',
}
export const MOVE_CONTENT_SECTION = 'MOVE_CONTENT_SECTION';
export const moveContentSectionValues = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}
export const SWITCH_CONTENT_SECTION = 'SWITCH_CONTENT_SECTION';
export const SET_EDITOR_EXTRA_CONTROLS = 'SET_EDITOR_EXTRA_CONTROLS';
export const editorExtraControlTypes = {
  NONE: 'NONE',
  LINK: 'LINK',
  IMAGE: 'IMAGE',
}
export const SET_EDITOR_EXTRA_CONTROL_URL = 'SET_EDITOR_EXTRA_CONTROL_URL';
export const SET_EDITOR_FOCUS = 'SET_EDITOR_FOCUS';
export const SET_UPDATE_EDITOR = 'SET_UPDATE_EDITOR';
export const SET_UPDATE_EDITORS = 'SET_UPDATE_EDITORS'
export const SET_AUTOSAVE_COUNTER = 'SET_AUTOSAVE_COUNTER';
export const SET_SHOW_TITLE_TOOLTIP = 'SET_SHOW_TITLE_TOOLTIP';
export const SET_EDIT_ARTICLE_LOADING = 'SET_EDIT_ARTICLE_LOADING';



export function resetEditArticle() {
  return { type: RESET_EDIT_ARTICLE}
}
export function setTitle(title, useCounter) {
  return { type: SET_TITLE, title, useCounter}
}
export function setTeaser(teaser, useCounter) {
  return { type: SET_TEASER, teaser, useCounter}
}
export function setContent(sectionsContent) {
  return { type: SET_CONTENT, sectionsContent}
}
export function setContentSection(row, col, contentSection) {
  return { type: SET_CONTENT_SECTION, row, col, contentSection}
}
export function addContentSection(sectionType) {
  return { type: ADD_CONTENT_SECTION, sectionType}
}
export function removeContentSection(row, col) {
  return { type: REMOVE_CONTENT_SECTION, row, col}
}
export function setEditArticlePopup(popupType) {
  return { type: SET_EDIT_ARTICLE_POPUP, popupType}
}
export function setEditArticleID(articleID) {
  return { type: SET_EDIT_ARTICLE_ID, articleID}
}
export function setEditArticlePublished(published) {
  return { type: SET_EDIT_ARTICLE_PUBLISHED, published}
}
export function setShowCreateSectionButtons(value) {
  return { type: SET_SHOW_CREATE_SECTION_BUTTONS, value}
}
export function setSavingInfo(value) {
  return { type: SET_SAVING_INFO, value}
}
export function moveContentSection(row, col, moveValue) {
  return { type: MOVE_CONTENT_SECTION, row, col, moveValue}
}
export function switchContentSection(row1, col1, row2, col2) {
  return { type: SWITCH_CONTENT_SECTION, row1, col1, row2, col2}
}
export function setEditorExtraControls(editorExtraControlType) {
  return { type: SET_EDITOR_EXTRA_CONTROLS, editorExtraControlType}
}
export function setExtraControlURL(url) {
  return { type: SET_EDITOR_EXTRA_CONTROL_URL, url}
}
export function setEditorFocus(id) {
  return { type: SET_EDITOR_FOCUS, id}
}
export function setUpdateEditor(row, col, value) {
  return { type: SET_UPDATE_EDITOR, row, col, value}
}
export function setUpdateEditors(value) {
  return { type: SET_UPDATE_EDITORS, value}
}
export function setAutosaveCounter(autosaveCounter) {
  return { type: SET_AUTOSAVE_COUNTER, autosaveCounter}
}
export function setShowTitleTooltip(value) {
  return { type: SET_SHOW_TITLE_TOOLTIP, value}
}
export function setEditArticleLoading(loading) {
  return { type: SET_EDIT_ARTICLE_LOADING, loading}
}
