import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, AtomicBlockUtils} from 'draft-js';
import '../MyEditor.css';
import {Glyphicon, Button, OverlayTrigger, Tooltip, Panel} from 'react-bootstrap'
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import {editorExtraControlTypes, moveContentSectionValues} from '../actions';
//import {clientID, clientSecret} from '../ImgurInfo'; //commented out as the following 2 files are not inculded in the git repository
//import ImgurUpload from '../ImgurUpload';
import {MAX_CHAR_NOT_UPDATED, MAX_WAIT_AUTOSAVE} from '../GeneralParameters';
//used as part of image plugin
//import Editor from 'draft-js-plugins-editor';
//import createImagePlugin from 'draft-js-image-plugin';

export function getCompositeDecorator()
{
  return new CompositeDecorator([ //used to create links
          {
            strategy: findLinkEntities,
            component: Link,
          },
          {
            strategy: findImageEntities,
            component: Image,
          },
        ]);
}

class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    var decorator = getCompositeDecorator();
     this.state = {
       editorState: EditorState.createWithContent(stateFromHTML(props.editorSectionContent), decorator),
       lastChar: null, //the last char, used as normal saving is done on ' ' so that saving doesn't save half a word, also used to store backspace as 'backspace'
       charNumberNotUpdated: 0, //used to count the number of normal chars not saved to the redux state
       forceUpdate: false,
    };
    this.autosaveTimeout = null;

    this.onChange = (editorState) =>
    {
      this.setState({editorState}, function() { //updates the component state (different the the redux state)
        if((this.state.charNumberNotUpdated > MAX_CHAR_NOT_UPDATED && (this.state.lastChar === ' ' || this.state.lastChar.length > 1)) || this.state.forceUpdate) //if the state hasn't changed don't update it
        {
          //resets variables used to determine if save is required
          this.setState({ charNumberNotUpdated: 0, forceUpdate: false});

          //clears the autosaveTimeout
          if(this.autosaveTimeout != null)
          {
            clearTimeout(this.autosaveTimeout);
            this.autosaveTimeout = null; //null the timeout so you can tell if the timer is running
          }

          //sends the update to the redux state
          var html = stateToHTML(this.state.editorState.getCurrentContent());
          this.props.setContentSection(this.props.row, this.props.col, html);
          console.log('on change update');
        }
        else if(stateToHTML(this.state.editorState.getCurrentContent()) !== this.props.editorSectionContent && this.state.lastChar !== '')
        {
          if(this.autosaveTimeout !== null)
          {
            clearTimeout(this.autosaveTimeout);
            this.autosaveTimeout = null; //null the timeout so you can tell if the timer is running
          }

          var editor = this;
          this.autosaveTimeout = setTimeout(
            function(){
              //sends the update to the redux state
              var html = stateToHTML(editor.state.editorState.getCurrentContent());
              editor.props.setContentSection(editor.props.row, editor.props.col, html);
              editor.props.setAutosaveCounter(-1);
              console.log('autosave update');
              editor.autosaveTimeout = null;
          }, MAX_WAIT_AUTOSAVE);
        }
      });
    }

    //defines functions
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.onBoldClick = this._onBoldClick.bind(this);
    this.onItalicClick = this._onItalicClick.bind(this);
    this.onUnderlineClick = this._onUnderlineClick.bind(this);
    this.toggleCode = this._toggleCode.bind(this);
    this.onHeading1 = this._onHeading1.bind(this);
    this.onHeading2 = this._onHeading2.bind(this);
    this.onHeading3 = this._onHeading3.bind(this);
    this.toggleUnorderedList = this._toggleUnorderedList.bind(this);
    this.toggleOrderedList = this._toggleOrderedList.bind(this);
    this.handleOnFocus = this._handleOnFocus.bind(this);
    this.handleOnBlur = this._handleOnBlur.bind(this);
    this.clearFormating = this._clearFormating.bind(this);
    this.showLinkPopup = this._showLinkPopup.bind(this);
    this.createLink = this._createLink.bind(this);
    this.removeLink = this._removeLink.bind(this);
    this.onMoveClick = this._onMoveClick.bind(this);
    this.showImagePopup = this._showImagePopop.bind(this);
    this.onCreateImage = this._onCreateImage.bind(this);
    this.onDropImage = this._onDropImage.bind(this);
    this.onDropContent = this._onDropContent.bind(this);
    this.onDragContent = this._onDragContent.bind(this);
    this.handleImageUpload = this._handleImageUpload.bind(this);
    //not currently working
    this.onTab = this._onTab.bind(this);
    this.onUpArrow=this._onUpArrow.bind(this);
    this.onDownArrow=this._onDownArrow.bind(this);
    this.onLeftArrow=this._onLeftArrow.bind(this);
    this.onRightArrow=this._onRightArrow.bind(this);

  }
  componentWillReceiveProps(nextProps) {

    if(nextProps.updateEditorSectionContent === true) //if set to true the component needs to update it's editorstate
    {
        var decorator = getCompositeDecorator();
        this.setState({editorState: EditorState.createWithContent(stateFromHTML(nextProps.editorSectionContent),decorator)});
        this.props.setUpdateEditor(this.props.row, this.props.col, false);
    }
  }

  handleKeyCommand(command, editorState) {
    //used to determine is a state update to redux is required
    //this is done as onTab currently does nothing
    if(command !== 'onTab')
    {
      //used so that wheater you press backspace once or 10 tiems only one redux update is called
      if(this.state.lastChar !== command)
        this.setState({forceUpdate: true, lastChar: command});
      else
      { //used to prevent 100 presses of backspace from not updating the redux state
        var newCharNumberNotUpdated = this.state.charNumberNotUpdated + 1;
        this.setState({charNumberNotUpdated: newCharNumberNotUpdated});
      }
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleBeforeInput(chars, editorState)
  {
    //used to count up the number of new chars since the last redux state update
    var newCharNumberNotUpdated = this.state.charNumberNotUpdated + 1;
    this.setState({charNumberNotUpdated: newCharNumberNotUpdated, lastChar: chars});
    return 'not-handled';
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
  _toggleCode(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleCode(this.state.editorState));
    this.setState({forceUpdate: true});
  }
  _onTab(e) //doesn't currently work, not sure why
  {
    e.preventDefault();
    console.log('onTab');
    //const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, 4));
  }
  _onUpArrow() {
    this.setState({lastChar: ''});
  }
  _onDownArrow() {
    this.setState({lastChar: ''});
  }
  _onLeftArrow() {
    this.setState({lastChar: ''});
  }
  _onRightArrow() {
    this.setState({lastChar: ''});
  }

  _onHeading1(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-one'));
    this.setState({forceUpdate: true});
  }
  _onHeading2(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-two'));
    this.setState({forceUpdate: true});
  }
  _onHeading3(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'));
    this.setState({forceUpdate: true});
  }
  _toggleUnorderedList(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
    this.setState({forceUpdate: true});
  }
  _toggleOrderedList(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
    this.setState({forceUpdate: true});
  }
  _clearFormating(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unstyled'));
    this.setState({forceUpdate: true});
  }
  _handleOnFocus(e) {
    if(e.target.nodeName === 'DIV') //prevents this from calling when buttion is pressed
    {
      if(this.props.editorFocusID !== this.props.id)
      {
        this.props.setEditorFocus(this.props.id);
        this.props.setEditorExtraControls(editorExtraControlTypes.NONE);
      }
      this.setState({editorState: EditorState.moveFocusToEnd(this.state.editorState)});
      //console.log('editor Focus');
      //console.log('focus');
    }
  }
  _handleOnBlur(e) {
    //const ReactDOM = require('react-dom');
    //var editor = this;
    //uses timeout as when function is called the new dom element is not in focus

    /*
    setTimeout(function() {

      //if(editor.props.set)
      if(document.activeElement === ReactDOM.findDOMNode(editor.refs.linkInput))
      {
        //if the user clicks in the link input focus is not lost
      }
      else if(document.activeElement.parentElement.parentElement === ReactDOM.findDOMNode(editor.refs.editor))
      {
        //if the link input was in focus and the input was clicked, only the link popup is hidden
        //editor.setState({linkPopup: false});
        editor.props.setEditorExtraControls(editorExtraControlTypes.NONE);
      }
      else
      {
        //standard focus loss
        //editor.setState({hasFocus:false, linkPopup: false});
        editor.props.setEditorExtraControls(editorExtraControlTypes.NONE);
        editor.props.setEditorFocus(-1);
      }

    }, 100);
    */
    if(this.autosaveTimeout != null)
      this.setState({forceUpdate: true});
    console.log(this.autosaveTimeout);
  }

  _showLinkPopup(e) {
    e.preventDefault();
    if(this.props.editorExtraControlType === editorExtraControlTypes.LINK)
      this.props.setEditorExtraControls(editorExtraControlTypes.NONE);
    else
    this.props.setEditorExtraControls(editorExtraControlTypes.LINK);
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
    this.setState({forceUpdate: true});
  }
  _removeLink(e) {
    e.preventDefault();
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    if(!selection.isCollapsed())
    {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      this.setState({forceUpdate: true});
    }
  }

  _onMoveClick(e, moveValue) {
    e.preventDefault();
    //this.props.handleMove(this.state.row, this.state.col, value);
    if(moveValue === 'DEL') //delete
    {
      this.props.removeContentSection(this.props.row, this.props.col);
      this.props.setEditorExtraControls(editorExtraControlTypes.NONE);
    }
    else
    {
      this.onChange(this.state.editorState);
      this.setState({forceUpdate: true}, function()
      {
        this.props.moveContentSection(this.props.row, this.props.col, moveValue);
        if(moveValue === moveContentSectionValues.LEFT)
          this.props.setEditorFocus(this.props.id - 1);
        else if(moveValue === moveContentSectionValues.RIGHT)
          this.props.setEditorFocus(this.props.id + 1);
        else if(moveValue === moveContentSectionValues.DOWN)
          this.props.setEditorFocus(this.props.id + this.props.editorSectionsContent[this.props.row + 1].length);
        else if(moveValue === moveContentSectionValues.UP)
          this.props.setEditorFocus(this.props.id - this.props.editorSectionsContent[this.props.row - 1].length);
      });
    }
  }

  _showImagePopop(e) {
    e.preventDefault();
    if(this.props.editorExtraControlType === editorExtraControlTypes.IMAGE)
      this.props.setEditorExtraControls(editorExtraControlTypes.NONE);
    else
      this.props.setEditorExtraControls(editorExtraControlTypes.IMAGE);
  }
  _onCreateImage(e, value) {

    var src = '';

    if(e !== null)
    {
      e.preventDefault();
      src = document.getElementById('ImageInput').value;
    }
    else
    {
      src = value;
    }

    const {editorState, urlValue, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      //{src: 'https://i.imgur.com/V8hpbNR.png'}
      {src: src}

    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
    }, function(){
    this.onChange(this.state.editorState); //manualy calls onchange as it doesn't get called automaticaly
    });
  }

  _onDropImage(e) {
    e.preventDefault();
    if(e.dataTransfer.types[0] === 'Files')
    {
      var files = e.dataTransfer.files;
      for(var i = 0; i < files.length; i++)
      {
        if(files[i].type.startsWith('image/'))
        {
          this.handleImageUpload(files[i]);
        }
      }
    }
    /*console.log('it works');
    var file = e.dataTransfer.files[0];
    //console.log(e.dataTransfer.files[0]);


    var reader = new FileReader();

    var editor = this;
    reader.onload = function(e) {

      // editor.setState({temp: e.target.result}, function()
      // {
      //   console.log(editor.state.temp);
      // });
      editor.onCreateImage(null, e.target.result);
    }
    reader.readAsDataURL(file);
    */
  }

  _onDropContent(e) {
    //when things are dropped on the contentSection

    e.preventDefault();

    console.log(e.dataTransfer.types[0]);
    if(e.dataTransfer.types[0] === 'Files')
    {
      var files = e.dataTransfer.files;
      for(var i = 0; i < files.length; i++)
      {
        if(files[i].type.startsWith('image/'))
        {
          this.handleImageUpload(files[i]);
        }
      }
    }
    else if(e.dataTransfer.types[0] === 'text/plain')
    {
      var rowCol = e.dataTransfer.getData('text');
      var row = (rowCol.split(' '))[0];
      var col = (rowCol.split(' '))[1];
      if(row == parseInt(row, 10) && col == parseInt(col, 10)) //have to use == here as only == considers 0 the same as '0'
      {
        this.props.switchContentSection(this.props.row, this.props.col, row, col);
      }
      else
      {
        console.log(row+', '+parseInt(row, 10));
        console.log(col+', '+parseInt(col, 10));
      }
    }
  }
  _onDragContent(e) {
    //e.preventDefault();
    this.onChange(this.state.editorState);
    this.setState({forceUpdate: true});
    e.dataTransfer.setData('text', this.props.row + ' ' + this.props.col);
  }

  _handleImageUpload(file) {
    //currently doesn't upload the images
    const maxFileSize = 10000000; //in bytes, 10 mb

    if(file.size > maxFileSize)
    {
      console.log('file is to big');
      return;
    }

    var reader = new FileReader();

    var editor = this;
    reader.onload = function(e) {
      editor.setState({forceUpdate: true});
      editor.onCreateImage(null, e.target.result);
    }
    reader.readAsDataURL(file);
  }


  render() {
    var header =
    <div className='MyEditor' style={{visibility: this.props.id === this.props.editorFocusID ? 'visible' : 'hidden' }}>
      {
        this.props.row > 0 &&
        <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Move Row Up</Tooltip>} delayShow={200}>
        <Button onMouseDown={(e) => {this.onMoveClick(e, moveContentSectionValues.UP)}}><Glyphicon glyph="arrow-up"/></Button>
        </OverlayTrigger>
      }
      {
        this.props.lastRow === false &&
        <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Move Row Down</Tooltip>} delayShow={200}>
        <Button onMouseDown={(e) => {this.onMoveClick(e, moveContentSectionValues.DOWN)}}><Glyphicon glyph="arrow-down"/></Button>
        </OverlayTrigger>

      }
      {
        this.props.col > 0 &&
        <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Move Row Left</Tooltip>} delayShow={200}>
        <Button onMouseDown={(e) => {this.onMoveClick(e, moveContentSectionValues.LEFT)}}><Glyphicon glyph="arrow-left"/></Button>
        </OverlayTrigger>
      }
      {
        this.props.lastCol === false &&
        <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Move Row Right</Tooltip>} delayShow={200}>
        <Button onMouseDown={(e) => {this.onMoveClick(e, moveContentSectionValues.RIGHT)}}><Glyphicon glyph="arrow-right"/></Button>
        </OverlayTrigger>
      }
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Delete Row</Tooltip>} delayShow={200}>
        <Button onMouseDown={(e) => {this.onMoveClick(e, 'DEL')}}><Glyphicon glyph="trash"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Bold</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onBoldClick}><Glyphicon glyph="bold"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Italic</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onItalicClick}><Glyphicon glyph="italic"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">UnderLine</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onUnderlineClick}><u>U</u></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Make Selection Look Like Code Block</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.toggleCode}>Code</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Link</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.showLinkPopup}><Glyphicon glyph="link"/></Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Clear Formating</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.clearFormating}>Clear</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Heading 1</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onHeading1}>h1</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Heading 2</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onHeading2}>h2</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Heading 3</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.onHeading3}>h3</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Unoredered List</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.toggleUnorderedList}>UL</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Ordered List</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.toggleOrderedList}>OL</Button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip">Insert Image</Tooltip>} delayShow={200}>
        <Button onMouseDown={this.showImagePopup}><Glyphicon glyph="picture"/></Button>
      </OverlayTrigger>
      {/*}
      <Button onMouseDown={(e) =>{
        e.preventDefault();

        var imgurUpload = new ImgurUpload(clientID, clientSecret);
        imgurUpload.getAccessToken();
      }
      }>Imgur Test</Button>
      <Button onMouseDown={(e) =>{
        e.preventDefault();

        var imgurUpload = new ImgurUpload(clientID, clientSecret);

        imgurUpload._readAccessToken();
      }
      }>Imgur Test 2</Button>
      */}
      {
        this.props.editorExtraControlType === editorExtraControlTypes.LINK && this.props.editorFocusID === this.props.id &&
        <div>
          <Button onMouseDown={this.createLink}>Create Link</Button>
          <Button onMouseDown={this.removeLink}>Remove Link</Button>
          Link<input ref='linkInput' id='linkInput' placeholder='Insert Link Here' defaultValue='https://www.google.com.au/'></input>
        </div>
      }
      {
        this.props.editorExtraControlType === editorExtraControlTypes.IMAGE && this.props.editorFocusID === this.props.id &&
        <div>
          <Panel draggable='true' onDragOver={(e) => e.preventDefault()} onDrop={this.onDropImage}>
            <br/><br/><br/><br/>
            <p>Drag your image here for image upload<br/>You can also drag images directly into the editor
            <br/>Warning it is recomended not to save currently when images have been uploaded as they save directly to the server</p>
            <br/><br/><br/><br/>
          </Panel>
          URL<input ref='ImageInput' id='ImageInput' placeholder='Insert Image URL Here'></input>
          <Button onMouseDown={this.onCreateImage}>Add Image</Button>
        </div>
      }
    </div>;

    return (
      <Panel header={header} onBlur={this.handleOnBlur} onFocus={this.handleOnFocus} onClick={this.handleOnFocus}>
          <div className='contentArea' draggable='true' onDragStart={this.onDragContent} onDragOver={(e) => e.preventDefault()} onDrop={this.onDropContent}>
            <Editor className='Editor' ref='editor'
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={this.handleBeforeInput}
              onChange={this.onChange}
              onTab={this.onTab}
              onUpArrow={this.onUpArrow}
              onDownArrow={this.onDownArrow}
              onLeftArrow={this.onLeftArrow}
              onRightArrow={this.onRightArrow}
              spellCheck={true}
              handleDrop={() => {return true;}} //used to prevent error when draging non text onto the editor
              />
        </div>
      </Panel>
    );
  }
}



// used when creating links
//got from example on draft git
export function findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'LINK'
            );
          },
          callback
        );
      }
export const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  const tooltip = <Tooltip id="tooltip">{url}</Tooltip>
  return (
    <OverlayTrigger placement='top' overlay={tooltip}>
    <a href={url}>
      {props.children}
    </a>
    </OverlayTrigger>
    );
};
export function findImageEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'IMAGE'
            );
          },
          callback
        );
      }
export const Image = (props) => {
  const src = props.contentState.getEntity(props.entityKey).getData();
  return (
    <img src={src.src} width ='100%' alt=''/>
    );
};

export default MyEditor;
