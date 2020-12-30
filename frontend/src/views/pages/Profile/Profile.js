import React, { Component } from 'react';
import axios from 'axios';

import {
  Redirect,
} from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CLabel,
  CContainer, 
  CButton
} from '@coreui/react'

import { RoleAwareComponent } from 'react-router-role-authorization';

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

const fields = ['#','name', 'last_name']

class Profile extends RoleAwareComponent {
  constructor(props)
  {
    super(props);
    this.state = {      
      user: []          
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_PROFESSOR', 'ROLE_STUDENT', 'ROLE_ADMIN'];

    this.getUser = this.getUser.bind(this);
    this.changePassword = this.changePassword.bind(this)
  }

  componentDidMount(){
    this.getUser()
}

  getUser(){
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token);     
    axios({
      method: 'get',
      url: url + 'user',       
      headers: { "Authorization": AuthStr } ,   
  }).then((response) => {
      console.log(response);
      this.setState({user:response.data})
  }, (error) => {
      console.log(error);
  });
  }

changePassword(){

}

  render() {
    const user = this.state.user;
    let ret = (
      <CCol xs="12" lg="12">
          <CRow>
            <CCol md="1" lg="1" xl="1">
              <CLabel>Name:</CLabel>
            </CCol>
            <CCol md="4" lg="4" xl="4">
               <CLabel>{user.name}</CLabel>
            </CCol>
          </CRow>
            <CRow>
            <CCol md="1" lg="1" xl="1">
              <CLabel>Lastname:</CLabel>
            </CCol>
            <CCol md="4" lg="4" xl="4">
               <CLabel>{user.last_name}</CLabel>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="1" lg="1" xl="1">
              <CLabel>Username:</CLabel>
            </CCol>
            <CCol md="4" lg="4" xl="4">
               <CLabel>{user.username}</CLabel>
            </CCol>
          </CRow>
            <CRow>
            <CCol md="1" lg="1" xl="1">
              <CLabel>Email:</CLabel>
            </CCol>
            <CCol md="4" lg="4" xl="4">
               <CLabel>{user.email}</CLabel>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="2" lg="2" xl="2">
              <CButton id="changePassword" onClick={() => this.changePassword()} color="primary" className="px-4">Change password</CButton>
            </CCol>
          </CRow>
        </CCol>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default Profile;