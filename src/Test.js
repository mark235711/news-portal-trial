import React, { Component } from 'react';
import './Main.css';
import {Button, Modal, OverlayTrigger, Popover, Tooltip, SplitButton, MenuItem} from 'react-bootstrap';

class Test extends Component {


  render() {

    return (
      <div>
        <p>testing 1 2 3</p>
      
        <SplitButton title="Dropdown right" pullRight id="split-button-pull-right">
          <MenuItem eventKey="1">Action</MenuItem>
          <MenuItem eventKey="2">Another action</MenuItem>
          <MenuItem eventKey="3">Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4">Separated link</MenuItem>
        </SplitButton>
      </div>
    );
  }
  }

  export default Test;
