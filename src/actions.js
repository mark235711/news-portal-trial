

//action types for Page
export const SET_PAGE = 'SET_PAGE';
export const SET_OTHER_DATA = 'SET_OTHER_DATA';
export const SET_USER_STATE = 'SET_USER_STATE';
export const pageValues = {
  LOGIN: 'LOGIN',
  CREATEACCOUNT: 'CREATEACCOUNT',
  EDITARTICLE: 'EDITARTICLE',
  CREATEARTICLE: 'CREATEARTICLE',
  VIEWARTICLES: 'VIEWARTICLES',
  VIEWYOURARTICLES: 'VIEWYOURARTICLES',
  VIEWARTICLESTOBEAPPROVED: 'VIEWARTICLESTOBEAPPROVED',
  VIEWPUBLISHEDARTICLESEDITMODE: 'VIEWPUBLISHEDARTICLESEDITMODE',
}
export const userStateValues = {
  VIEWER: 'VIEWER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  EDITOR: 'EDITOR',
}
//actions types for ViewArticles and Article
export const viewArticlesTypes = {
   PUBLISHED_ARTICLES: 'PUBLISHED_ARTICLES',
   YOUR_ARTICLES: 'YOUR_ARTICLES',
   TO_BE_APPROVED: 'TO_BE_APPROVED',
   PUBLISHED_EDIT_MODE: 'PUBLISHED_EDIT_MODE',
}
export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_POPUP = 'SET_ARTICLE_POPUP';
//action types for EditArticle and MyEditor
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

//Page action creators
export function setPage(pageValue) {
  return { type: SET_PAGE, pageValue};
}
export function setData(otherData) {
  return { type: SET_OTHER_DATA, otherData};
}
export function setUserState(userState) {
  return { type: SET_USER_STATE, userState};
}

export function setArticles(articles) {
  return { type: SET_ARTICLES, articles}
}
export function setArticlePopup(articleID, visible) {
  return { type: SET_ARTICLE_POPUP, articleID, visible}
}

//action types for EditArticle and MyEditor
export function resetEditArticle() {
  return { type: RESET_EDIT_ARTICLE}
}
export function setTitle(title) {
  return { type: SET_TITLE, title}
}
export function setTeaser(teaser) {
  return { type: SET_TEASER, teaser}
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
