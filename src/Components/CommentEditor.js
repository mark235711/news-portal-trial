import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, AtomicBlockUtils} from 'draft-js';
import '../MyEditor.css';
import {Glyphicon, Button, OverlayTrigger, Tooltip, Panel, ButtonGroup} from 'react-bootstrap'
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import {findLinkEntities, Link } from './MyEditor';
import {POST_COMMENT_URL} from '../GeneralParameters';


function getCompositeDecorator()
{
  return new CompositeDecorator([ //used to create links
          {
            strategy: findLinkEntities,
            component: Link,
          },
    ]);
}

class CommentEditor extends React.Component {

  constructor(props) {
    super(props);

    var decorator = getCompositeDecorator();
    if(props.loadComment === false)
    {
      this.state = {
        editorState: EditorState.createWithContent(stateFromHTML(props.content), decorator),
      }
    }
    else
    {
      this.state = {
        editorState: EditorState.createWithContent(stateFromHTML(props.content),decorator),
      }
    }
    this.onChange = (editorState) =>
    {
      var editor = this;
      this.setState({editorState}, function() { //updates the component state (different the the redux state)
        this.props.setCommentContent(stateToHTML(editor.state.editorState.getCurrentContent()));
      });
    }

    //defines functions
    this.postComment = this._postComment.bind(this);
    this.onBoldClick = this._onBoldClick.bind(this);
    this.onItalicClick = this._onItalicClick.bind(this);
    this.onUnderlineClick = this._onUnderlineClick.bind(this);
    this.showLinkPopup = this._showLinkPopup.bind(this);
    this.createLink = this._createLink.bind(this);
    this.removeLink = this._removeLink.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    //console.log(props.loadComment);
    if(nextProps.loadComment === true) //if set to true the component needs to update it's editorstate
    {
      var decorator = getCompositeDecorator();
      this.setState({editorState: EditorState.createWithContent(stateFromHTML(nextProps.content),decorator)});
      this.props.setLoadComment(false);
    }
  }



  _postComment(id) {
    fetch(POST_COMMENT_URL, {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment_id: id,
        article_id: this.props.articleID,
        content: this.props.content,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.setLoadComments(true);
      this.props.setCommentContent('<p><br /></p>');
    })
    .catch((error) => {
      console.error(error);
    });
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
    if(this.props.linkPopup === true)
      this.props.setCommentLinkPopup(false);
    else
    this.props.setCommentLinkPopup(true);
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
        this.props.linkPopup === true &&
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
          this.props.commentID !== null &&
          <Button onMouseDown={()=> {this.props.setCommentVisibility(false); this.postComment(this.props.commentID);}}>Save Comment</Button>
        }
        {
          this.props.commentID === null &&
          <Button onMouseDown={()=> {this.props.setCommentVisibility(false); this.postComment(null);}}>Post Comment</Button>
        }
        <Button onMouseDown={()=> {this.props.setCommentVisibility(false); this.props.resetCommentEditor();}}>Cancel Comment</Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default CommentEditor;
