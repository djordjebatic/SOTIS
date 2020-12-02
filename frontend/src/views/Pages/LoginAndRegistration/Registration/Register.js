import './Register.css'
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

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  
  const phoneRegex = RegExp(
      /06[0-9]{7,8}$/
  );
  
  const capitalLetterRegex = RegExp(
      /^([A-Z][a-z]+)+$/
  );

  const medicalNumberRegex = RegExp(
    /[0-9]{9,10}$/
);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });
  
    return valid;
  };

  class Register extends Component {
    constructor(props){
        super(props);
  
        this.handleChange = this.handleChange.bind(this);
        this.SendRegisterRequest = this.SendRegisterRequest.bind(this);
  
        this.state = {
              username: '',
              password: '',
              email: '',
              firstName: '',
              lastName: '',
              studentId:'',
              passwordConfirm:'',
              formErrors:{
                  username:'',
                  password: '',
                  email: '',
                  firstName:'',
                  lastName:'',
                  studentId:'',
                  passwordConfirm:''
              },
              disableSubmit:true
        }
     }
  
    SendRegisterRequest = event => {
        event.preventDefault();
          console.log(this.state);  
          const { password, passwordConfirm } = this.state;
          if (password !== passwordConfirm) {
              alert("Passwords don't match");
          } else {
          axios.post(url + 'register', {
              username: this.state.username,
              password: this.state.password,
              email: this.state.email,
              name: this.state.firstName,
              last_name: this.state.lastName,
              student_id: this.state.studentId  
          }
          ).then((resp) => {
          NotificationManager.success('Registered successfuly. Please log in', 'Success!', 4000);
          this.props.history.push('/login');
          }
          )
          .catch((error)=> NotificationManager.error('Wrong input', 'Error!', 4000))
          }
      }
  
      handleKeyUp = () => {
          var empty = true;
      
          Object.keys(this.state.formErrors).forEach(e => 
            {if(this.state.formErrors[e] != ""){
              empty = false;
            }
          });
      
          if (!empty){
              this.setState({disableSumbit: true});
              console.log('disabled');
          }
          else{
      
              if (this.state.email != "" && this.state.firstName != "" && this.state.lastName != ""
              && this.state.studentId != "" && this.state.password!="" && this.state.passwordConfirm!=""
              && this.state.email!="" && this.state.username!=""
              )
              {
                this.setState({disableSumbit: false});
                console.log('enabled');
              }
              else {
                this.setState({disableSumbit: true});
                console.log('disabled');
              }
          }
        }
  
        isEmpty = (obj)  =>{
          for(var key in obj) {
              if(obj.hasOwnProperty(key))
                  return false;
          }
          return true;
      }
  
      /*handleChange(e) {
          this.setState({...this.state, [e.target.name]: e.target.value});
      }*/
  
      handleChange = e => {
          e.preventDefault();
          const { name, value } = e.target;
          let formErrors = { ...this.state.formErrors };
      
          switch (name) {
            case "username":        
                formErrors.username =
                value.length < 3 ? "Minimum 3 characaters required" : "";
            break;
            case "firstName":
              formErrors.firstName = capitalLetterRegex.test(value)
                ? ""
                : "First name must start with a capital letter";
      
              if (formErrors.firstName === ""){  
                  formErrors.firstName =
                  value.length < 3 ? "Minimum 3 characaters required" : "";
              }
              break;
            case "lastName":
              formErrors.lastName = capitalLetterRegex.test(value)
                ? ""
                : "Last name must start with a capital letter";
              
                if (formErrors.lastName === ""){  
                  formErrors.lastName =
                  value.length < 3 ? "Minimum 3 characaters required" : "";
              }
              break;
            case "email":
              formErrors.email = emailRegex.test(value)
                ? ""
                : "Invalid email address";
              break;
            case "studentId":
              formErrors.studentId =
                value.length < 3 ? "Minimum 3 characaters required" : "";
              break;
            case "password":
                    formErrors.password =
                        value.length < 8 ? "Minimum 8 characaters required" : "";
                    break;
            case "passwordConfirm":
                    formErrors.passwordConfirm =
                        value.length < 8 ? "Minimum 8 characaters required" : "";
                    break;
                default:
                break;
          }
          this.setState({ formErrors, [name]: value}, () => console.log(this.state));
      
          this.handleKeyUp();
        }
  
    render() {
        const{formErrors}=this.state;
        return (
      <div className="Register">
              <div className="row register-form">
              <div className="col-4 welcome">
                          <div className="logo">
                              <h1 className="title"></h1>
                          </div>
                      </div>
                  <div className="col-8 login">
                  <form onSubmit={this.SendRegisterRequest}>
                                  <div className="form-row">
                                      <div className="col">
                                          <div className="username">
                                              <label htmlFor="username">Username</label>
                                              <input type="text"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.username.length > 0 ? "error" : null}
                                                  id="username"
                                                  name="username"
                                                  noValidate
                                                  onChange={this.handleChange}
                                                  placeholder="Enter Username"
                                              />
                                              {formErrors.username.length > 0 && (
                                              <span className="errorMessage">{formErrors.username}</span>
                                               )}
                                          </div>
                                      </div>
                                      <div className="col">
                                          <div className="firstNameR">
                                              <label htmlFor="firstName">First Name</label>
                                              <input type="text"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.firstName.length > 0 ? "error" : null}
                                                  id="firstName"
                                                  name="firstName"
                                                  noValidate
                                                  onChange={this.handleChange}
                                                  placeholder="Enter first name"
                                              />
                                              {formErrors.firstName.length > 0 && (
                                              <span className="errorMessage">{formErrors.firstName}</span>
                                               )}
                                          </div>
                                      </div>
                                      <div className="col">
                                          <div className="lastNameR">
                                              <label htmlFor="lastName">Last Name</label>
                                              <input type="text"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.lastName.length > 0 ? "error" : null}
                                                  id="lastName"
                                                  name="lastName"
                                                  onChange={this.handleChange}
                                                  placeholder="Enter last name"
                                                  noValidate
                                              />
                                              {formErrors.lastName.length > 0 && (
                                              <span className="errorMessage">{formErrors.lastName}</span>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="form-row">
                                      <div className="col">
                                          <div className="email">
                                              <label htmlFor="email">Email Address</label>
                                              <input type="email"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.email.length > 0 ? "error" : null}                                
                                                  id="email"
                                                  name="email"
                                                  onChange={this.handleChange}
                                                  placeholder="Enter email address"
                                                  noValidate
                                              />
                                               {formErrors.email.length > 0 && (
                                                  <span className="errorMessage">{formErrors.email}</span>
                                               )}
                                          </div>
                                      </div>
                                      <div className="col">
                                          <div className="studentId">
                                              <label htmlFor="studentId">StudentId</label>
                                              <input type="number"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.studentId.length > 0 ? "error" : null}
                                                  id="studentId"
                                                  name="studentId"
                                                  onChange={this.handleChange}
                                                  placeholder="Enter Student Id"
                                                  noValidate
                                              />
                                              {formErrors.studentId.length > 0 && (
                                                  <span className="errorMessage">{formErrors.studentId}</span>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="form-row">
                                      <div className="col">
                                          <div className="password">
                                              <label htmlFor="password">Password</label>
                                              <input type="password"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.password.length > 0 ? "error" : null}
                                                  id="password"
                                                  name="password"
                                                  onChange={this.handleChange}
                                                  placeholder="Enter password"
                                                  noValidate
                                              />
                                               {formErrors.password.length > 0 && (
                                                  <span className="errorMessage">{formErrors.password}</span>
                                               )}
                                          </div>
                                      </div>
                                      <div className="col">
                                          <div className="passwordConfirm">
                                              <label htmlFor="passwordConfirm">Confirm Password</label>
                                              <input type="password"
                                                  onKeyUp={this.handleKeyUp}
                                                  className={formErrors.passwordConfirm.length > 0 ? "error" : null}
                                                  id="passwordConfirm"
                                                  name="passwordConfirm"
                                                  onChange={this.handleChange}
                                                  placeholder="Confirm password"
                                                  noValidate
                                              />
                                               {formErrors.passwordConfirm.length > 0 && (
                                                  <span className="errorMessage">{formErrors.passwordConfirm}</span>
                                               )}
                                          </div>
                                      </div>
                                  </div> 
                                  <hr/>
                              <small id="newAccount" className="form-text text-muted"><Link to="/login">Already have an account?</Link></small> 
                              <br/>                      
                              <Button disabled={this.state.disableSumbit} className="register" type="submit">Create</Button>
                          </form>
                  </div>
              </div>
      </div>
    );}  
  }

export default withRouter(Register);