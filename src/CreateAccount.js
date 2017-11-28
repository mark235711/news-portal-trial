import React, { Component } from 'react';
import MenuBarContainer from './Containers/MenuBarContainer';
import './Main.css';
import { Panel,Form ,FormControl, ControlLabel, Grid, Row, Col, Button } from 'react-bootstrap';

class CreateAccount extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      handler: props.handler,
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }

    this.emailOnChange = this._emailOnChange.bind(this);
    this.usernameOnChange = this._usernameOnChange.bind(this);
    this.passwordOnChange = this._passwordOnChange.bind(this);
    this.confirmPasswordOnChange = this._confirmPasswordOnChange.bind(this);

  }

    _emailOnChange(e)
    {
      this.setState({email: e.target.value});
      console.log(this.state);
    }
    _usernameOnChange(e)
    {
      this.setState({username: e.target.value});
    }
    _passwordOnChange(e)
    {
      this.setState({password: e.target.value});
    }
    _confirmPasswordOnChange(e)
    {
      this.setState({confirmPassword: e.target.value});
    }
  render() {
    return (
      <div className='createAccount'>
      <Grid fluid='true'>
        <Row>
          <MenuBarContainer login={true}/>
        </Row>
        <Row>
          <Col sm={4} smOffset={4}>
            <Panel>
              <h2>Create Account</h2>
              <Form horizontal>
              <Col sm={5}><ControlLabel>Email</ControlLabel></Col>
              <Col sm={7}>
                <FormControl
                  label='email'
                  type='text'
                  value={this.state.email}
                  placeholder='Enter Email Address'
                  onChange={this.emailOnChange}/>
              </Col>
                <Col sm={5}><ControlLabel>UserName</ControlLabel></Col>
                <Col sm={7}>
                  <FormControl
                    label='username'
                    type='text'
                    value={this.state.username}
                    placeholder='Enter UserName'
                    onChange={this.usernameOnChange}/>
                </Col>
                <Col sm={5}><ControlLabel>Password</ControlLabel></Col>
                <Col sm={7}>
                  <FormControl
                    type='password'
                    value={this.state.password}
                    placeholder='Enter Password'
                    onChange={this.passwordOnChange}/>
                </Col>
                <Col sm={5}><ControlLabel> Confirm Password</ControlLabel></Col>
                <Col sm={7}>
                  <FormControl
                    type='password'
                    value={this.state.confirmPassword}
                    placeholder='Enter Password'
                    onChange={this.confirmPasswordOnChange}/>
                </Col>
                <Col>
                  <Button onClick = {() => this.props.handler('VIEWARTICLES')}>Create Account</Button>
                </Col>
              </Form>
            </Panel>
          </Col>
        </Row>
      </Grid>
      </div>
    );
  }
}

export default CreateAccount;
