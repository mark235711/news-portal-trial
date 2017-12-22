import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, AtomicBlockUtils} from 'draft-js';
import '../MyEditor.css';
import ReactDOM from 'react-dom';
import {Glyphicon, Button, OverlayTrigger, Tooltip, Panel, ButtonGroupOverlay,ButtonGroup, Overlay} from 'react-bootstrap'
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import {findLinkEntities, Link } from './MyEditor';
import {POST_COMMENT_URL, COMMENT_MAX_CHAR_LIMIT} from '../GeneralParameters';

import {observer} from 'mobx-react';

function getCompositeDecorator()
{
  return new CompositeDecorator([ //used to create links
          {
            strategy: findLinkEntities,
            component: Link,
          },
    ]);
}

@observer
class CommentEditor extends React.Component {

  constructor(props) {
    super(props);

    var decorator = getCompositeDecorator();
    if(props.loadComment === false)
    {
      this.state = {
        editorState: EditorState.createWithContent(stateFromHTML(props.store.commentEditor.content), decorator),
      }
    }
    else
    {
      this.state = {
        editorState: EditorState.createWithContent(stateFromHTML(props.store.commentEditor.content),decorator),
      }
    }
    this.onChange = (editorState) =>
    {
      var editor = this;
      this.setState({editorState}, function() { //updates the component state (different the the redux state)
        this.props.store.commentEditor.content = stateToHTML(editor.state.editorState.getCurrentContent());
      });
    }

    //defines functions
    this.onBoldClick = this._onBoldClick.bind(this);
    this.onItalicClick = this._onItalicClick.bind(this);
    this.onUnderlineClick = this._onUnderlineClick.bind(this);
    this.showLinkPopup = this._showLinkPopup.bind(this);
    this.createLink = this._createLink.bind(this);
    this.removeLink = this._removeLink.bind(this);
    this.tooltipTimeout = this._tooltipTimeout.bind(this);
    this.checkPostComment = this._checkPostComment.bind(this);
  }

  componentWillUpdate() {
    if(this.props.store.commentEditor.loadComment === true) //if set to true the component needs to update it's editorstate
    {
      var decorator = getCompositeDecorator();
      this.setState({editorState: EditorState.createWithContent(stateFromHTML(this.props.store.commentEditor.content),decorator)});
      this.props.store.commentEditor.loadComment = false;
    }
  }


  _onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    this.setState({forceUpdate: true});
  }
  _onItalicClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    this.setState({forceUpdate: true});
  }
  _onUnderlineClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    this.setState({forceUpdate: true});
  }


  _showLinkPopup(e) {
    e.preventDefault();
    if(this.props.store.commentEditor.linkPopup === true)
      this.props.store.commentEditor.linkPopup = false;
    else
    this.props.store.commentEditor.linkPopup = true;
  }
  _createLink(e) {
    var url = document.getElementById('linkInput').value;

    e.preventDefault();
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: url}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity});
    this.onChange(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    ));
  }
  _removeLink(e) {
    e.preventDefault();
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    if(!selection.isCollapsed())
    {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  }

  _tooltipTimeout() {
    var editor = this;
    setTimeout( function() {
      editor.props.store.commentEditor.commentWarning = 'NONE';
    }, 2000);
  }
  _checkPostComment(){
    //checks to see if there is anything beside white space in the comment
    var charNumb = 0;
    var elementStarted = false; //set to true when '<' is found and false when '>' is found
    var content = this.props.store.commentEditor.content;
    for (var i = 0; i < content.length; i++) {
      if(content[i] == '<')
        elementStarted = true;
      else if(content[i] == '>')
        elementStarted = false;
      else if(elementStarted === false) //other characters may be needed
      {
        if(content[i] === '&' && content[i+1] === 'n' && content[i+2] === 'b' && content[i+3] === 's' && content[i+4] === 'p' && content[i+5] === ';')
        { // ' ' char, special character '&nbps;'
          i+=5;
          continue;
        }
        if(content[i].charCodeAt(0) === 10)//new line
        {
          continue;
        }
        if(content[i] === '&' && content[i+1] === 'a' && content[i+2] === 'm' && content[i+3] === 'p' && content[i+4] === ';')
        { // '&' char //uses '$amp;' for & as it's already used as part of special characters
          i+=4;
          charNumb++;
          continue;
        }
        charNumb++;
      }
    }
    console.log(charNumb);
    if(charNumb === 0)
      this.props.store.commentEditor.commentWarning = 'EMPTY';
    else if(charNumb > COMMENT_MAX_CHAR_LIMIT)
      this.props.store.commentEditor.commentWarning = 'MAX_CHAR';
    else
    {
      this.props.store.commentEditor.visible = false;
      this.props.store.commentEditor.postComment();
    }
  }
  render() {
    var header =
    <div className='MyEditor' style={{visibility: this.props.id === this.props.editorFocusID ? 'visible' : 'hidden' }}>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Bold</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onBoldClick}><Glyphicon glyph="bold"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Italic</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onItalicClick}><Glyphicon glyph="italic"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">UnderLine</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onUnderlineClick}><u>U</u></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Link</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.showLinkPopup}><Glyphicon glyph="link"/></Button>
      </OverlayTrigger>
      {
        this.props.store.commentEditor.linkPopup === true &&
        <div>
          <Button onMouseDown={this.createLink}>Create Link</Button>
          <Button onMouseDown={this.removeLink}>Remove Link</Button>
          Link<input ref='linkInput' id='linkInput' placeholder='Insert Link Here' defaultValue='https://www.google.com.au/'></input>
        </div>
      }
    </div>;


    return (
      <div>
        <Panel header={header} onBlur={this.handleOnBlur} onFocus={this.handleOnFocus} onClick={this.handleOnFocus}>
          <Overlay target={() => ReactDOM.findDOMNode(this.refs.editor)} show={this.props.store.commentEditor.commentWarning !== 'NONE'}  placement="top" onEntered={this.tooltipTimeout}>
              {
                this.props.store.commentEditor.commentWarning === 'MAX_CHAR' &&
                <Tooltip className='WarningTooltip' id={1}>
                  a comment cannot have more than {COMMENT_MAX_CHAR_LIMIT} characters
                </Tooltip>
              }
              {
                this.props.store.commentEditor.commentWarning === 'EMPTY' &&
                <Tooltip className='WarningTooltip' id={1}>
                  a comment cannot be empty
                </Tooltip>
              }
          </Overlay>
          <div className='contentArea' style={{textAlign: 'left'}}>
            <Editor className='Editor' ref='editor'
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={this.handleBeforeInput}
              onChange={this.onChange}
              spellCheck={true}
              handleDrop={() => {return true;}} //used to prevent error when draging non text onto the editor
            />
          </div>
        </Panel>
        <ButtonGroup>
        {
          this.props.store.commentEditor.commentID !== null &&
          <Button onMouseDown={()=> {this.props.store.commentEditor.visible = false; this.props.store.commentEditor.postComment();}}>Save Comment</Button>
        }
        {
          this.props.store.commentEditor.commentID === null &&
          <Button onMouseDown={this.checkPostComment}>Post Comment</Button>
        }
        <Button onMouseDown={()=> {this.props.store.commentEditor.visible = false; this.props.store.commentEditor.resetCommentEditor();}}>Cancel Comment</Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default CommentEditor;
