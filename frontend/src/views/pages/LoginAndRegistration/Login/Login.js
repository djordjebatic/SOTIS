import './Login.css'
import React, { Component } from 'react';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CLink,
    CRow
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {NotificationManager, NotificationContainer} from 'react-notifications';
import {withRouter} from 'react-router-dom';

import 'react-notifications/lib/notifications.css';

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class Login extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.SendLoginRequest = this.SendLoginRequest.bind(this);
  
        this.state = {
            username: '',
            password: ''
        }
    }

    SendLoginRequest = event => {
        event.preventDefault();

        axios.post(url + 'login', this.state)
        .then((resp) => {
            //TODO authorization and role checking
            localStorage.setItem("loggedInUser", resp.data.auth_token);
            localStorage.setItem("role", resp.data.role);
            this.props.history.push('/newTest')
        })
        .catch((error) => NotificationManager.error('Wrong username or password', 'Error!', 4000))
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    render(){
        return (
        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
              {/*  <div className="col-4 welcome">
                          <div className="logo">
                              <h1 className="title"></h1>
                          </div>
                      </div>
        */}
                  <CForm onSubmit={this.SendLoginRequest}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput required 
                              type="text" 
                              className="form-control" 
                              id="username" 
                              name="username"
                              aria-describedby="usernameHelp"
                              onChange={this.handleChange} 
                              placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput 
                                  required
                                  type="password" 
                                  className="form-control" 
                                  id="password" 
                                  name="password"
                                  onChange={this.handleChange}
                                  autoComplete="current-password"
                                  placeholder="Password"/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                      <CButton id="confirmButton" color="primary" type="submit" className="px-4">Log In</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CLink to="/register">Don't have an account?</CLink>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <NotificationContainer/>
          </div>
          );
      }
}

export default withRouter (Login);