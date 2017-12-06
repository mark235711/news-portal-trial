import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuBarContainer from '../Containers/MenuBarContainer';
import '../Main.css';
import MyEditorContainer from '../Containers/MyEditorContainer';
import ArticleContainer from '../Containers/ArticleContainer';
import {Row, Col, Grid, Button, Modal, Panel, FormControl, Clearfix, Tooltip, Overlay, Fade} from 'react-bootstrap';
import { editArticlePopups , pageValues, savingInfoTypes } from '../actions'
import {
  AUTOSAVE_CHANGE_LIMIT,
  TEASER_TEXT_MAX_LINES,
  TEASER_TEXT_CHAR_LINE_LIMIT,
  MAX_WAIT_AUTOSAVE,
  LOAD_ARTICLE_URL,
  CREATE_ARTICLE_URL,
  EDIT_ARTICLE_URL,
  DELETE_ARTICLE_URL,
  SUBMIT_ARTICLE_FOR_REVIEW_URL,
  PUBLISH_ARTICLE_URL,
  PUSH_BACK_ARTICLE_URL,
} from '../GeneralParameters'
class EditArticle extends Component {

  constructor(props)
  {
    super(props)


    this.titleOnChange = this._titleOnChange.bind(this);
    this.teaserOnChange = this._teaserOnChange.bind(this);
    this.saveArticle = this._saveArticle.bind(this);
    this.savingPopupTimeout = this._savingPopupTimeout.bind(this);
    this.loadArticle = this._loadArticle.bind(this);
    this.deleteArticle = this._deleteArticle.bind(this);
    this.submitForPublishing = this._submitForPublishing.bind(this);
    this.publish = this._publish.bind(this);
    this.pushbackForEditing = this._pushbackForEditing.bind(this);
    this.toggleCreateSectionPopup = this._toggleCreateSectionPopup.bind(this);
    this.loadTemplate = this._loadTemplate.bind(this);
    this.titleTooltipTimeout = this._titleTooltipTimeout.bind(this);
    if(this.props.createMode !== true)
    {
      this.loadArticle();
    }
    else
    { //loads the template popup when a new artice is created
        this.props.setPopupType(editArticlePopups.TEMPLATE_POPUP);
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.autosaveCounter);
    if(nextProps.autosaveCounter >= AUTOSAVE_CHANGE_LIMIT || nextProps.autosaveCounter === -1) //-1 for force autosave
    {
      clearTimeout(this.autsaveTimeout);
      //console.log(this.props.articleID);
      if(this.props.articleID != null)
      {
        this.saveArticle(true);
      }
      else
        console.log('failed to autosave');

      nextProps.setAutosaveCounter(0);
    }
    else if(nextProps.autosaveCounter > this.props.autosaveCounter && this.props.autosaveCounter !== -1)
    {
      if(this.autsaveTimeout != null)
      {
        clearTimeout(this.autsaveTimeout);
      }

      var editArticle = this;
      this.autsaveTimeout = setTimeout(
        function(){

          //sends the update to the redux state
          if(editArticle.props.articleID != null)
          {
            editArticle.saveArticle(true);
          }
          console.log('on autosave update');

      }, MAX_WAIT_AUTOSAVE);
    }
  }

  _titleOnChange(e) {
    if(e.target.value.length === 255)
      alert('max character limit reached for title');
    this.props.setTitle(e.target.value, true);
  }
  _teaserOnChange(e) {
    var output = '';
    var currentLines = 1;
    var currentRow = 0;
    var characterLimitReached = false;
    for(var i = 0; i < e.target.value.length; i++)
    {
      if(e.target.value[i] === '\n') //newLine
      {
        if(currentLines < TEASER_TEXT_MAX_LINES)
        {
            currentLines++;
            currentRow = 0;
            output+= e.target.value[i];
          }
        }
        else
        {
          if(currentRow < TEASER_TEXT_CHAR_LINE_LIMIT)
          {
            output+= e.target.value[i];
            currentRow++;
          }
          else if(currentLines < TEASER_TEXT_MAX_LINES)
          {
            currentLines++;
            currentRow = 0;
            output+= e.target.value[i];
          }
          else
          characterLimitReached = true;
        }
      }
      if(e.target.value.length === 255 || characterLimitReached)
      alert('max character limit reached for teaser Text');
      //this.setState({teaser: output});
      this.props.setTeaser(output, true);
  }
  _loadArticle() {
    if(this.props.articleID != null) //load the article
    {
      this.props.setEditArticleLoading(true);
      fetch(LOAD_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        var title = responseJson.name;
        var teaser = responseJson.teaser;
        var content = JSON.parse(responseJson.content);
        var newPublished = responseJson.published;
        var newEditorSections = [];
        content.forEach(function(row) {
          var size = row.length;
          if(size === 0)
            size = 1;
            newEditorSections.push(size);
        });
        this.props.setTitle(title, false);
        this.props.setTeaser(teaser, false);
        this.props.setContent(content);
        this.props.setEditArticlePublished(newPublished);
        this.props.setUpdateEditors(true);
        this.props.setEditArticleLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _saveArticle(autosaving = false) {
    if(this.props.title === '')
    {
      this.props.setShowTitleTooltip(true);
      return;
    }

    if(this.props.articleID == null) //create new article
    {
      this.props.setSavingInfo(savingInfoTypes.SAVING);

      fetch(CREATE_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.props.title,
          teaser: this.props.teaser,
          content: JSON.stringify(this.props.editorSectionsContent),
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.setArticleID(responseJson.id);
        console.log(responseJson);

        this.props.setSavingInfo(savingInfoTypes.SAVECOMPLETE);
        this.savingPopupTimeout();
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else //save to esisting entry
    {
      if(autosaving)
        this.props.setSavingInfo(savingInfoTypes.AUTOSAVING);
      else
        this.props.setSavingInfo(savingInfoTypes.SAVING);

      fetch(EDIT_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
          name: this.props.title,
          teaser: this.props.teaser,
          content: JSON.stringify(this.props.editorSectionsContent),
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.setSavingInfo(savingInfoTypes.SAVECOMPLETE);
        this.savingPopupTimeout();
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _savingPopupTimeout() {

    var editArticle = this;

    setTimeout(function() {
      editArticle.props.setSavingInfo(savingInfoTypes.NONE);
    }, 2000);
  }
  _deleteArticle() {
    this.props.setPopupType(editArticlePopups.NONE);

    if(this.props.articleID != null) //load the article
    {
      fetch(DELETE_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.setPage(pageValues.VIEW_ARTICLES);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _submitForPublishing() {
    this.props.setPopupType(editArticlePopups.NONE);
    if(this.props.articleID != null) //load the article
    {
      this.saveArticle(false);
      fetch(SUBMIT_ARTICLE_FOR_REVIEW_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.setPage(pageValues.VIEW_ARTICLES);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _publish() {
    this.props.setPopupType(editArticlePopups.NONE);
    if(this.props.articleID != null) //load the article
    {
      this.saveArticle(false);
      fetch(PUBLISH_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.setPage(pageValues.VIEW_ARTICLES);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _pushbackForEditing() {
    this.props.setPopupType(editArticlePopups.NONE);
    if(this.props.articleID != null) //load the article
    {
      this.saveArticle(false);
      fetch(PUSH_BACK_ARTICLE_URL, {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleID: this.props.articleID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.setPage(pageValues.VIEW_ARTICLES);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  _toggleCreateSectionPopup() {
    if(this.props.showCreateSectionButtons === false)
      this.props.setShowCreateSectionButtons(true);
    else
      this.props.setShowCreateSectionButtons(false);
  }
  _loadTemplate(templateValue) {
    var content = [];
    this.props.setPopupType(editArticlePopups.NONE);
    for(var i = 0; i < templateValue.length; i++)
    {
      if(templateValue[i] === 1)
      {
        content.push(['<p><br></p>']);
      }
      else if(templateValue[i] === 2)
      {
        content.push(['<p><br></p>', '<p><br></p>']);
      }
      else if(templateValue[i] === 3)
      {
        content.push(['<p><br></p>', '<p><br></p>', '<p><br></p>']);
      }
    }
    this.props.setContent(content);
    this.props.setUpdateEditors(true);
  }
  _titleTooltipTimeout()
  {
    var editor = this;
    setTimeout( function() {
      editor.props.setShowTitleTooltip(false);
    }, 2000);
  }
  render() {

    var heading;
    if(this.props.loading === true)
      heading = <h1>Loading</h1>;
    else if(this.props.createMode === true)
      heading=<h1>Create Article</h1>;
    else
      heading=<h1>Edit Article</h1>;


    var id = 0;
    var editors = [];

    if(this.props.loading === false)
    {

      for(var i = 0; i < this.props.editorSectionsContent.length; i++)
      {
        var lastRow = false;
        if(i === this.props.editorSectionsContent.length - 1)
          lastRow = true;

          if(this.props.editorSectionsContent[i].length === 1)
          {
            editors[i] =
            <Row className="show-grid" key={id}>
              <Col xs={12} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={0} lastCol={true} lastRow={lastRow} />
              </Col>
            </Row>;
          }
          else if(this.props.editorSectionsContent[i].length === 2)
          {
            editors[i] =
            <Row className="show-grid" key={id}>
              <Col xs={12} sm={6} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={0} lastCol={false} lastRow={lastRow} />
              </Col>
              <Col xs={12} sm={6} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={1} lastCol={true} lastRow={lastRow} />
              </Col>
            </Row>;
          }
          else if(this.props.editorSectionsContent[i].length === 3)
          {
            editors[i] =
            <Row className="show-grid" key={id}>
              <Col xs={12}  sm={4} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={0} lastCol={false} lastRow={lastRow} />
              </Col>
              <Col xs={12} sm={4} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={1} lastCol={false} lastRow={lastRow} />
              </Col>
              <Col xs={12} sm={4} key={id}>
                <MyEditorContainer key={id} id={id++} row={i} col={2} lastCol={true} lastRow={lastRow} />
              </Col>
            </Row>;
          }
      }
    }
    //the following code creates the template icons (there currently just html code)
    //the following variables are static and therefore don't use keys
    const oneColOneLine = <div style ={{fontSize: '6px'}}>^^^^^^^^^^^^^^^^^^^^<br/></div>;
    const twoColOneLine = <div style ={{fontSize: '6px'}}>^^^^^^^^^^&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^^^^^^^^^^<br/></div>;
    const threeColOneLine = <div style ={{fontSize: '6px'}}>^^^^^^&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^^^^^^&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^^^^^^<br/></div>;

    var oneCol = [];
    for (let i = 0; i < 10; i++)
      oneCol[i] = oneColOneLine;

    var twoCol = [];
    for (let i = 0; i < 10; i++)
        twoCol[i] = twoColOneLine;

    var threeCol = [];
    for (let i = 0; i < 10; i++)
      threeCol[i] = threeColOneLine;

    var oneColTwoRow = [];
    for (let i = 0; i < 9; i++)
    {
      if(i===4)
        oneColTwoRow[i] = <br/>;
      else
        oneColTwoRow[i] = oneColOneLine;
    }

    var twoColTwoRow = [];
    for (let i = 0; i < 9; i++)
    {
      if(i===4)
        twoColTwoRow[i] = <br/>;
      else
        twoColTwoRow[i] = twoColOneLine;
    }

    var threeColTwoRow = [];
    for (let i = 0; i < 9; i++)
    {
      if(i===4)
        threeColTwoRow[i] = <br/>;
      else
        threeColTwoRow[i] = threeColOneLine;
    }

    var oneColThreeRow = [];
    for (let i = 0; i < 8; i++)
    {
      if(i===2 || i===5)
        oneColThreeRow[i] = <br/>;
      else
        oneColThreeRow[i] = oneColOneLine;
    }

    var twoColThreeRow = [];
    for (let i = 0; i < 8; i++)
    {
      if(i===2 || i===5)
        twoColThreeRow[i] = <br/>;
      else
        twoColThreeRow[i] = twoColOneLine;
    }

    var threeColThreeRow = [];
    for (let i = 0; i < 8; i++)
    {
      if(i===2 || i===5)
        threeColThreeRow[i] = <br/>;
      else
        threeColThreeRow[i] = threeColOneLine;
    }


    var oneColTwoCol = [];
    for (let i = 0; i < 9; i++)
    {
      if(i<4)
        oneColTwoCol[i] = oneColOneLine;
      else if(i>4)
        oneColTwoCol[i] = twoColOneLine;
      else
        oneColTwoCol[i] = <br/>;

    }

    var oneColTwoColThreeCol = [];
    for (let i = 0; i < 8; i++)
    {
      if(i<2)
        oneColTwoColThreeCol[i] = oneColOneLine;
      else if(i>2 && i<5)
        oneColTwoColThreeCol[i] = twoColOneLine;
      else if(i>5)
        oneColTwoColThreeCol[i] = threeColOneLine;
      else
        oneColTwoColThreeCol[i] = <br/>;
    }

    var oneColTwoColOneCol = [];
    for (let i = 0; i < 8; i++)
    {
      if(i<2)
        oneColTwoColOneCol[i] = oneColOneLine;
      else if(i>2 && i<5)
        oneColTwoColOneCol[i] = twoColOneLine;
      else if(i>5)
        oneColTwoColOneCol[i] = oneColOneLine;
      else
        oneColTwoColOneCol[i] = <br/>;
    }

    return (
      <div className='EditArticle'>
      <MenuBarContainer viewArticles={true}/>
      {heading}
      <div>
        <Grid>
          <Row>
            <Overlay target={() => ReactDOM.findDOMNode(this.refs.titleInput)} show={this.props.titleTooltip}  placement="top" onEntered={this.titleTooltipTimeout}>
            <Tooltip className='WarningTooltip' id={1}>
              Title Cannot Be Empty
            </Tooltip>
            </Overlay>
            <input maxLength='255' value={this.props.title} onChange={this.titleOnChange} placeholder='Insert Title Here' ref='titleInput'></input>
          </Row>
          <Row>
            <Col xs={6} xsOffset={3}>
            <Panel collapsible header="Teaser Text (optional)">
              <FormControl componentClass='textarea' value={this.props.teaser} maxLength='255' rows="4" cols="50" placeholder='insert a short teaser for the article' onChange={this.teaserOnChange}/>
            </Panel>
            </Col>
          </Row>
          <Row>
            <p>Article</p>
          </Row>
        </Grid>
        <Grid>
        {editors}
        </Grid>
      </div>
      <Button onClick={this.toggleCreateSectionPopup}>Create Section</Button>
      <Button onClick={() => {this.props.setPopupType(editArticlePopups.PREVIEW_POPUP); this.props.setShowTitleTooltip(false);}}>Preview</Button>
      <Button onClick={() => this.saveArticle(false)}>Save</Button>
      {
        this.props.articleID !== null &&
        <Button onClick={() => {this.props.setPopupType(editArticlePopups.DELETE_POPUP); this.props.setShowTitleTooltip(false);}}>Delete</Button>
      }
      {
        this.props.articleID !== null && this.props.published === 0 &&
        <Button onClick={() => {this.props.setPopupType(editArticlePopups.SUBMIT_FOR_PUBLISHING_POPUP); this.props.setShowTitleTooltip(false);}}>Submit For Publishing</Button>
      }
      {
        this.props.articleID !== null && this.props.published === 1 &&
        <Button onClick={() => {this.props.setPopupType(editArticlePopups.PUSH_BACK_FOR_EDITING_POPUP); this.props.setShowTitleTooltip(false);}}>Push Back For Editing</Button>
      }
      {
        this.props.articleID !== null && this.props.published === 1 &&
        <Button onClick={() => {this.props.setPopupType(editArticlePopups.PUBLISH_POPUP); this.props.setShowTitleTooltip(false);}}>Publish</Button>
      }

      {
        this.props.showCreateSectionButtons === true &&
        <div>
          <Button onClick={() => {this.props.addContentSection(1)}}>One Column</Button>
          <Button onClick={() => {this.props.addContentSection(2)}}>Two Columns</Button>
          <Button onClick={() => {this.props.addContentSection(3)}}>Three Columns</Button>
        </div>
      }
      <Modal show={this.props.popupType === editArticlePopups.DELETE_POPUP} onHide={() => this.props.setPopupType(editArticlePopups.NONE)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this article? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.setPopupType(editArticlePopups.NONE)}>No</Button>
          <Button bsStyle="primary" onClick={this.deleteArticle}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.props.popupType === editArticlePopups.SUBMIT_FOR_PUBLISHING_POPUP} onHide={() => this.props.setPopupType(editArticlePopups.NONE)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit your article for publishing (it will still have to be approved by an editor before being shown)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.setPopupType(editArticlePopups.NONE)}>No</Button>
          <Button bsStyle="primary" onClick={this.submitForPublishing}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.props.popupType === editArticlePopups.PUBLISH_POPUP} onHide={this.hidePublishPopup}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to publish this article?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.setPopupType(editArticlePopups.NONE)}>No</Button>
          <Button bsStyle="primary" onClick={this.publish}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.props.popupType === editArticlePopups.PUSH_BACK_FOR_EDITING_POPUP} onHide={() => this.props.setPopupType(editArticlePopups.NONE)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to pushback this article for editing to the contributor?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.setPopupType(editArticlePopups.NONE)}>No</Button>
          <Button bsStyle="primary" onClick={this.pushbackForEditing}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.props.popupType === editArticlePopups.TEMPLATE_POPUP} onHide={() => this.props.setPopupType(editArticlePopups.NONE)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid fluid = {true}>
            <Row>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1])}>
                  <div> {oneCol} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([2])}>
                  <div> {twoCol} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([3])}>
                  <div> {threeCol} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1, 2])}>
                  <div> {oneColTwoCol} </div>
                </Panel>
              </Col>
              <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1, 1])}>
                  <div> {oneColTwoRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([2, 2])}>
                  <div> {twoColTwoRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([3, 3])}>
                  <div> {threeColTwoRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1, 2, 3])}>
                  <div> {oneColTwoColThreeCol} </div>
                </Panel>
              </Col>
              <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1, 1, 1])}>
                  <div> {oneColThreeRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([2, 2, 2])}>
                  <div> {twoColThreeRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([3, 3, 3])}>
                  <div> {threeColThreeRow} </div>
                </Panel>
              </Col>
              <Col xs={6} sm={3}>
                <Panel className='articleTemplate' onClick={() => this.loadTemplate([1, 2, 1])}>
                  <div> {oneColTwoColOneCol} </div>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      <Fade in={this.props.savingInfoType !== savingInfoTypes.NONE}>
      <Panel style={{position: 'fixed', top: 20, right: 20}}>
        {this.props.savingInfoType === savingInfoTypes.SAVING && <p>saving...</p>}
        {this.props.savingInfoType === savingInfoTypes.SAVECOMPLETE && <p>save complete</p>}
        {this.props.savingInfoType === savingInfoTypes.AUTOSAVING && <p>autosaving...</p>}
      </Panel>
    </Fade>
      {
          this.props.popupType === editArticlePopups.PREVIEW_POPUP &&
          <ArticleContainer hidden={true} id={-1}/>
      }
      </div>
    );
  }
}

export default EditArticle;
