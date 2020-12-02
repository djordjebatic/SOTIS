import './Login.css'
import React, { Component } from 'react';
import axios from 'axios';
import { Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText } from 'react-sidebar-ui'
import {
    Row, Col, Card, CardHeader, CardBody, FormGroup, Label, Form, Input, InputGroup, InputGroupAddon,
    InputGroupText, Button, Collapse, FormText, Dropdown, DropdownToggle, DropdownMenu, ListGroup, ListGroupItem,
    Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";
import {NotificationManager} from 'react-notifications';
import {withRouter, Link} from 'react-router-dom';


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
            localStorage.setItem('loggedInUserId', resp.data.id);
            this.props.history.push('/newTest')
        })
        .catch((error) => NotificationManager.error('Wrong username or password', 'Error!', 4000))
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    render(){
        return (
          <div className="Login">
              <div className="row">
                  <div className="col-4 welcome">
                      <div className="logo">
                          <h1 className="title"></h1>
                      </div>
                  </div>
                  <div className="col-8 login">
                      <form onSubmit={this.SendLoginRequest}>
                          <div className="row1">
                          <div className="username">
                              <label>Username</label>
                              <input 
                                  required
                                  type="text" 
                                  className="form-control" 
                                  id="username" 
                                  name="username"
                                  aria-describedby="usernameHelp"
                                  onChange={this.handleChange} 
                                  placeholder="Username"/>
                          </div>
                          <div className="password">
                              <label>Password</label>
                              <input 
                                  required
                                  type="password" 
                                  className="form-control" 
                                  id="password" 
                                  name="password"
                                  onChange={this.handleChange}
                                  placeholder="Password"/>
                              </div>
                          </div>
                          <div className="submitbtn">
                          <small id="newAccount" className="form-text text-muted"><Link to="/register">Don't have an account?</Link></small>
                          <Button id="confirmButton" type="submit" className="btn">Log In</Button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
          );
      }
}

export default withRouter (Login);