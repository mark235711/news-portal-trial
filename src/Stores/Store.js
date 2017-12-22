import { observable, extendObservable, autorun, action, spy } from 'mobx'
import {
  VIEW_ALL_ARTICLES_URL,
  VIEW_ALL_YOUR_ARTICLES_URL,
  VIEW_ALL_PENDING_ARTICLES_URL,
  VIEW_ALL_PUBLISHED_ARTICLES_URL,
  VIEW_ALL_COMMENTS_FOR_ARTICLE_URL,
  POST_COMMENT_URL,
  DELETE_COMMENT_URL,
} from '../GeneralParameters';

class Store {

  constructor()
  {
    this.user = new UserStore();
    this.data = new DataStore();
    this.viewArticles = new ViewArticlesStore(this);
    this.commentEditor = new CommentEditorStore(this);
    this.editArticle = new EditArticleStore();
    this.currentPage = 'VIEW_ARTICLES';
  }
  //page variables
  @observable _currentPage = ''; //values 'LOGIN', 'CREATE_ACCOUNT', 'EDIT_ARTICLE', 'CREATE_ARTICLE', 'VIEW_ARTICLES', 'VIEW_YOUR_ARTICLES', 'VIEW_ARTICLES_TO_BE_APPROVED', 'VIEW_PUBLISHED_ARTICLES_EDIT_MODE',
  get currentPage() {return this._currentPage;}
  set currentPage(value) {
    this._currentPage = value;
    if(this._currentPage === 'VIEW_ARTICLES' || this._currentPage === 'VIEW_YOUR_ARTICLES'
    || this._currentPage === 'VIEW_ARTICLES_TO_BE_APPROVED' || this._currentPage === 'VIEW_PUBLISHED_ARTICLES_EDIT_MODE')
    {
      this.getArticles();
    }
    if(this._currentPage === 'CREATE_ARTICLE' || this._currentPage === 'EDIT_ARTICLE')
      this.editArticle.resetEditArticle();
  }

  @action getArticles() {

    this.viewArticles.loading = true;
    var url = '';
    if(this.currentPage === 'VIEW_YOUR_ARTICLES')
      url = VIEW_ALL_YOUR_ARTICLES_URL;
    else if(this.currentPage === 'VIEW_ARTICLES_TO_BE_APPROVED')
      url = VIEW_ALL_PENDING_ARTICLES_URL;
    else
      url = VIEW_ALL_PUBLISHED_ARTICLES_URL;

    console.log(url);

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      var newArticles = [];
      if(responseJson !== null)
      {
        var props = this;
        responseJson.forEach(function(article) {
          let id = article.id;
          let title = article.name;
          let teaser = article.teaser;
          let content = JSON.parse(article.content);
          let author = article.author;
          let published_date = article.published_date;
          let published = '';
          if(props.currentPage === 'VIEW_YOUR_ARTICLES')
            published = article.published;
          else if(props.currentPage === 'VIEW_ARTICLES_TO_BE_APPROVED')
            published = 1; //all articles to be approved have a published value of 1
          else
            published = 2;
          let user_id = article.user_id;
          let likes = article.likes;
          let like = article.like;
          var newArticle = {id: id, title: title, teaser: teaser, content: content,
            author: author, published_date: published_date, published: published, user_id: user_id,
            likes: likes, like: like }
          newArticles.push(newArticle);
        });
      }
      this.data.articles = newArticles;
      this.viewArticles.loading = false;
    })
    .catch((error) => {
       console.error(error);
    });
  }
}


class UserStore {
  @observable permissions = '';
  @observable username = '';
  @observable id = null;
}

class DataStore {
  @observable articles = [];

  @observable commentsArticleID = null;
  @observable comments = null;
}

class ViewArticlesStore {
  constructor(parent)
  {
    this.parent = parent;
  }

  @observable _popup = {'visible':false, 'articleID': 1};
  get popup() { return this._popup; }
  set popup(value){
    this._popup = value;
    //console.log(this.);
    if(this._popup.visible === true)
      this.getComments();
  }

  @action getComments() {
    var viewArticles = this;
    fetch(VIEW_ALL_COMMENTS_FOR_ARTICLE_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleID: this.popup.articleID,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var newComments = responseJson;
      viewArticles.parent.data.comments = newComments;
      viewArticles.parent.data.commentsArticleID = viewArticles.popup.articleID;
      viewArticles.showComments = true;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  @action deleteComment(id) {
    fetch(DELETE_COMMENT_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article_id: this.popup.articleID,
        comment_id: id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.getComments();
    })
    .catch((error) => {
      console.error(error);
    });
  }
  @observable loading = true;


  //comments variables
  //belew variable 'loadComments' may not be needed
  @observable loadComments = true; //when set to true the relevent article needs to load/reload the comments
  @observable showComments = false;
  @observable commentsFilter = 'NEWEST'; //values 'MOST_LIKED', 'NEWEST', 'OLDEST'
  @observable commentHover = null;
}

class CommentEditorStore {
  constructor(parent)
  {
    this.parent = parent;
  }

  @action resetCommentEditor() {
    this.visible = false;
    this.content = '<p><br><p>';
    this.linkPopup = false;
    this.loadComment = false;
    this.commentID = null;
    this.userLike = false;
    this.likeCount = 0;
    this.commentWarning = 'NONE';
  }

  @action postComment() {
    fetch(POST_COMMENT_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment_id: this.commentID,
        article_id: this.parent.viewArticles.popup.articleID,
        content: this.content,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.content = '<p><br></p>';
      this.commentID = null;
      this.parent.viewArticles.getComments();
    })
    .catch((error) => {
      console.error(error);
    });
  }


  //commentEditor variables
  @observable visible = false;
  @observable content = '<p><br /><p>';
  @observable linkPopup = false;
  @observable loadComment = false;
  @observable commentID = null;
  @observable userLike = false;
  @observable likeCount = 0;
  @observable commentWarning = 'NONE'; //valid values 'NONE', 'MAX_CHAR', 'EMPTY'
}

class EditArticleStore {

  resetEditArticle() {
    this.title = '';
    this.teaser = '';
    this.editorSectionsContent = [];
    this.updateEditorSectionsContent = [[false, false], [false, false], [false, false]];
    this.articleID = null;
    this.published = 0; //0 means not published
    this.createMode = false;
    this.popupType = 'NONE'; //values 'NONE', 'DELETE_POPUP', 'SUBMIT_FOR_PUBLISHING_POPUP', 'PUSH_BACK_FOR_EDITING_POPUP', 'PUBLISH_POPUP', 'PREVIEW_POPUP', 'TEMPLATE_POPUP'
    this.showCreateSectionButtons = false;
    this.savingInfoType = 'NONE';  //values 'SAVING', 'SAVECOMPLETE', 'AUTOSAVING', 'NONE', 'ERROR'
    this.editorExtraControlType = 'NONE'; //values 'NONE', 'LINK', 'IMAGE',
    this.editorExtraControlURL = '';
    this.editorFocusID = -1;
    this.autosaveCounter = 0; //counts number of alterations since last save to database
    this.titleTooltip = false;
    this.loading = false;
  }

  @action setUpdateAllEditors(value)
  {
    for(var i = 0; i < this.updateEditorSectionsContent.length; i++)
    {
      for(var j = 0; j < this.updateEditorSectionsContent.length; j++)
      {
        this.updateEditorSectionsContent[i][j] = value;
      }
    }
  }
  //edit article variables
  @observable title = '';
  @observable teaser = '';
  @observable _editorSectionsContent = [];
  get editorSectionsContent() {
    return this._editorSectionsContent;
  }
  set editorSectionsContent(value) {

    this._editorSectionsContent = value;
    var newUpdateEditorSectionsContent = [];
    for(var i = 0; i < this._editorSectionsContent.length; i++)
    {
      newUpdateEditorSectionsContent[i] = [];
      for(var j = 0; j < this._editorSectionsContent.length; j++)
      {
        newUpdateEditorSectionsContent[i][j] = true;
      }
    }
    this.updateEditorSectionsContent = newUpdateEditorSectionsContent;
  }
  @action setEditorSectionContent(row, col, html, update = false) {
    this._editorSectionsContent[row][col] = html;
    this.updateEditorSectionsContent[row][col] = update;
  }
  @action setEditorSectionContentRow(row, rowData) {
    this._editorSectionsContent[row] = rowData;
    for (var i = 0; i < this._editorSectionsContent[row].length; i++) {
      this.updateEditorSectionsContent[row][i] = true;
    }
  }
  @action removeContentRow(row) {
    //this may not be the most efficent method but I was having issues with just using splice on an observable array;
    var newEditorSectionsContent = []; //creates new arrays
    var newUpdateEditorSectionsContent = [];
    var arrayPos = 0; //the arraypos that data should be stored in, slightly different to i
    for (var i = 0; i < this._editorSectionsContent.length; i++) {
      if(i === row) //if it's the row to be skiped skip the current loop
        continue;

      newEditorSectionsContent[arrayPos] = [...this._editorSectionsContent[i].slice()]; //adds the row to the nre array

      newUpdateEditorSectionsContent[arrayPos] = [];
      //for each col a true or false value is added to specify if it needs to be updated
      for (var j = 0; j < this._editorSectionsContent[arrayPos].length; j++) {
        if(i < row)
          newUpdateEditorSectionsContent[arrayPos].push(false); //if the row is before the row to be removed, doesn't move
        else
          newUpdateEditorSectionsContent[arrayPos].push(true); //if the row is after the row to be removed, does move
      }
      arrayPos++;
    }
    this._editorSectionsContent = newEditorSectionsContent;
    this.updateEditorSectionsContent = newUpdateEditorSectionsContent;

    console.log(row);
  }

  @observable updateEditorSectionsContent = []; //[[false, false], [false, false], [false, false]];
  @observable articleID = null;
  @observable published = 0; //0 means not published
  @observable createMode = false;
  @observable popupType = 'NONE'; //values 'NONE', 'DELETE_POPUP', 'SUBMIT_FOR_PUBLISHING_POPUP', 'PUSH_BACK_FOR_EDITING_POPUP', 'PUBLISH_POPUP', 'PREVIEW_POPUP', 'TEMPLATE_POPUP'
  @observable showCreateSectionButtons = false;
  @observable savingInfoType = 'NONE';  //values 'SAVING', 'SAVECOMPLETE', 'AUTOSAVING', 'NONE', 'ERROR'
  @observable editorExtraControlType = 'NONE'; //values 'NONE', 'LINK', 'IMAGE',
  @observable editorExtraControlURL = '';
  @observable editorFocusID = -1;
  @observable autosaveCounter = 0; //counts number of alterations since last save to database
  @observable titleTooltip = false;
  @observable loading = false;
}

//only used for debuging, not needed in final version
var store = window.store = new Store();
spy((event) => {
  if(false)
  {
    if (event.type === 'action') {
      console.log(`${event.name} with args: ${event.arguments}`)
    }
    else if(event.type === 'add')
    {
      console.log('event type: '+ event.type + ' name: ' + event.name,  ' value: ' + event.newValue);
      //console.log(event.object);
    }
    else if(event.spyReportEnd === true)
    {
      //console.log(event);
    }
    else
      console.log('event type: '+ event.type);
  }
  //console.log('testing 123');
  //console.log(`${event.name} with args: ${event.arguments}`);
  //console.log(event);
})


export default store;
