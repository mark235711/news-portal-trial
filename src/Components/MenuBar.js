import React, { Component } from 'react';
import '../MenuBar.css';
import {Navbar, Nav, NavItem } from 'react-bootstrap';
import { pageValues, userStateValues } from '../actions';
import PropTypes from 'prop-types';

class MenuBar extends Component {

  render() {
    return (
      <Navbar fluid>
      <Nav bsStyle="tabs" activeKey={0} stacked={false}>
      {
        this.props.login === true &&
        <NavItem eventKey={1} onClick = {() => this.props.setPage(pageValues.LOGIN)} >Login</NavItem>
      }
      {
        this.props.logout === true &&
        <NavItem eventKey={2} onClick = {() => this.props.setPage(pageValues.LOGIN)}>Logout</NavItem>
      }
      {
        this.props.createAccount === true &&
        <NavItem eventKey={3} onClick = {() => this.props.setPage(pageValues.CREATEACCOUNT)}>Create Account</NavItem>
      }
      {
        this.props.createArticle === true && (this.props.userState === userStateValues.CONTRIBUTOR || this.props.userState === userStateValues.EDITOR) &&
        <NavItem eventKey={4} onClick = {() => {this.props.resetEditArticle(); this.props.setPage(pageValues.CREATEARTICLE);}}>Create Article</NavItem>
      }
      {
        this.props.editArticle === true &&
        <NavItem eventKey={5} onClick = {() => this.props.setPage(pageValues.EDITARTICLE)}>Edit Article</NavItem>
      }
      {
        this.props.viewArticles === true &&
        <NavItem eventKey={6} onClick = {() => this.props.setPage(pageValues.VIEWARTICLES)}>View Articles</NavItem>
      }
      {
        this.props.viewYourArticles === true && (this.props.userState === userStateValues.CONTRIBUTOR || this.props.userState === userStateValues.EDITOR) &&
        <NavItem eventKey={6} onClick = {() => this.props.setPage(pageValues.VIEWYOURARTICLES)}>View Your Articles</NavItem>
      }
      {
        this.props.viewToBeApproved === true && this.props.userState === userStateValues.EDITOR &&
        <NavItem eventKey={7} onClick = {() => this.props.setPage(pageValues.VIEWARTICLESTOBEAPPROVED)}>View Articlcs to be Approved</NavItem>
      }
      {
        this.props.viewPublishedEditMode === true && this.props.userState === userStateValues.EDITOR &&
        <NavItem eventKey={8} onClick = {() => this.props.setPage(pageValues.VIEWPUBLISHEDARTICLESEDITMODE)}>View Published Articles (Edit Mode)</NavItem>
      }
      </Nav>
      </Navbar>
    );
  }
}

MenuBar.propTypes = {
  logout: PropTypes.bool,
  login: PropTypes.bool,
  createAccount: PropTypes.bool,
  createArticle: PropTypes.bool,
  editArticle: PropTypes.bool,
  viewArticles: PropTypes.bool,
  viewYourArticles: PropTypes.bool,
  viewToBeApproved: PropTypes.bool,
  viewPublishedEditMode: PropTypes.bool,
}
export default MenuBar;
