import React, { Component } from 'react';
import MenuBarContainer from './Containers/MenuBarContainer';
import { Panel,Form ,FormControl, ControlLabel, Grid, Row, Col, Button } from 'react-bootstrap';
import './Main.css';

class Login extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      handler: props.handler,
      username: '',
      password: ''
    }
    this.usernameOnChange = this._usernameOnChange.bind(this);
    this.passwordOnChange = this._passwordOnChange.bind(this);
  }

  _usernameOnChange(e) {
    this.setState({username: e.target.value})
  }
  _passwordOnChange(e) {
    this.setState({password: e.target.value})
  }
  render() {
    return (
      <div className='Login'>
        <Grid fluid='true'>
          <Row>
            <MenuBarContainer createAccount={true}/>
          </Row>
          <Row>
            <Col sm={4} smOffset={4}>
              <Panel>
                <h2>Login</h2>
                <Form horizontal>
                  <Col sm={3}><ControlLabel>UserName</ControlLabel></Col>
                  <Col sm={9}>
                    <FormControl
                      label='username'
                      type='text'
                      value={this.state.username}
                      placeholder='Enter UserName'
                      onChange={this.usernameOnChange}/>
                  </Col>
                  <Col sm={3}><ControlLabel>Password</ControlLabel></Col>
                  <Col sm={9}>
                    <FormControl
                      type='password'
                      value={this.state.password}
                      placeholder='Enter Password'
                      onChange={this.passwordOnChange}/>
                  </Col>

                  <Button onClick = {() => this.props.handler('VIEWARTICLES')}>Login</Button>
                </Form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Login;
