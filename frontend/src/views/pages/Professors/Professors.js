import React, { Component } from "react";
import axios from "axios";

import { Redirect } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CButton,
  CRow,
  CForm,
  CFormGroup,
  CFormText,
  CCardFooter,
  CContainer,
  CLabel,
  CInput,
  CLink,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody
} from "@coreui/react";

import { RoleAwareComponent } from "react-router-role-authorization";

import { NotificationManager } from "react-notifications";

const url =
  process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_PORT + "/";

const fields = ["#", "name", "last_name", "email"];

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const phoneRegex = RegExp(/06[0-9]{7,8}$/);

const capitalLetterRegex = RegExp(/^([A-Z][a-z]+)+$/);

const medicalNumberRegex = RegExp(/[0-9]{9,10}$/);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};

class ProfessorsPage extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      professors: [],
      hideForm: true,
      formErrors: {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordConfirm: "",
      },
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      passwordConfirm: "",
      disableSubmit: true,
    };

    let arr = [];
    arr.push(localStorage.getItem("role"));
    this.userRoles = arr;
    this.allowedRoles = ["ROLE_ADMIN"];

    this.getProfessors = this.getProfessors.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.SendRegisterRequest = this.SendRegisterRequest.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  componentDidMount() {
    this.getProfessors();
  }

  getProfessors() {
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    axios({
      method: "get",
      url: url + "users/professor",
      headers: { Authorization: AuthStr },
    }).then(
      (response) => {
        console.log(response);
        this.setState({ professors: response.data });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  clearAll() {
    this.setState({
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      passwordConfirm: "",
      disableSubmit: true,
      hideForm: true,
      formErrors: {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordConfirm: "",
      },
    });
  }

  SendRegisterRequest = (event) => {
    event.preventDefault();
    console.log(this.state);
    const { password, passwordConfirm } = this.state;
    if (password !== passwordConfirm) {
      alert("Passwords don't match");
    } else {
      axios
        .post(url + "register", {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          name: this.state.firstName,
          last_name: this.state.lastName,
          student_id: this.state.studentId,
          role: 'professor'
        })
        .then((resp) => {
          NotificationManager.success(
            "Professor registered successfuly.",
            "Success!",
            4000
          );
          let temp = this.state.professors
          temp.push(resp.data)
          this.setState({professors: temp})
          this.clearAll()
        })
        .catch((error) =>
          NotificationManager.error("Wrong input", "Error!", 4000)
        );
    }
  };

  handleKeyUp = () => {
    var empty = true;

    Object.keys(this.state.formErrors).forEach((e) => {
      if (this.state.formErrors[e] != "") {
        empty = false;
      }
    });

    if (!empty) {
      this.setState({ disableSumbit: true });
      console.log("disabled");
    } else {
      if (
        this.state.email != "" &&
        this.state.firstName != "" &&
        this.state.lastName != "" &&
        this.state.studentId != "" &&
        this.state.password != "" &&
        this.state.passwordConfirm != "" &&
        this.state.email != "" &&
        this.state.username != ""
      ) {
        this.setState({ disableSumbit: false });
        console.log("enabled");
      } else {
        this.setState({ disableSumbit: true });
        console.log("disabled");
      }
    }
  };

  isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  /*handleChange(e) {
      this.setState({...this.state, [e.target.name]: e.target.value});
  }*/

  handleChange = (e) => {
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

        if (formErrors.firstName === "") {
          formErrors.firstName =
            value.length < 3 ? "Minimum 3 characaters required" : "";
        }
        break;
      case "lastName":
        formErrors.lastName = capitalLetterRegex.test(value)
          ? ""
          : "Last name must start with a capital letter";

        if (formErrors.lastName === "") {
          formErrors.lastName =
            value.length < 3 ? "Minimum 3 characaters required" : "";
        }
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "Invalid email address";
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
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));

    this.handleKeyUp();
  };

  render() {
    const { formErrors } = this.state;
    const role = localStorage.getItem("role");
    let ret = (
      <CCol xs="12" lg="12">
        <CButton
          hidden={role !== "ROLE_ADMIN"}
          style={{ marginBottom: "20px" }}
          id="confirmButton"
          onClick={() => this.setState({ hideForm: false })}
          color="success"
          className="px-4"
        >
          Register new professor
        </CButton>
        <CCard>
          <CCardHeader>Professors</CCardHeader>
          <CCardBody>
            <CDataTable
              items={this.state.professors}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots={{
                "#": (item, index) => <td>{index + 1}</td>,
                name: (item, index) => <td>{item.user.name}</td>,
                last_name: (item, index) => <td>{item.user.last_name}</td>,
                email: (item, index) => <td>{item.user.email}</td>,
              }}
            />
          </CCardBody>
        </CCard>
        <CModal show = {!this.state.hideForm} onClose={() => this.clearAll()}>
          <CModalHeader closeButton>
            <CModalTitle>Register new professor</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CRow className="justify-content-center">
            <CCol md="12" lg="12" xl="12">
                  <CForm onSubmit={this.SendRegisterRequest}>
                    <CFormGroup>
                      <p className="text-muted">Create professor account</p>
                      <CLabel htmlFor="username">Username</CLabel>
                      <CInput
                        type="text"
                        onKeyUp={this.handleKeyUp}
                        className={
                          formErrors.username.length > 0 ? "error" : null
                        }
                        id="username"
                        name="username"
                        noValidate
                        onChange={this.handleChange}
                        placeholder="Enter Username"
                      />
                      {formErrors.username.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>{formErrors.username}</p>
                        </CFormText>
                      )}
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="firstName">First Name</CLabel>
                      <CInput
                        type="text"
                        onKeyUp={this.handleKeyUp}
                        className={
                          formErrors.firstName.length > 0 ? "error" : null
                        }
                        id="firstName"
                        name="firstName"
                        noValidate
                        onChange={this.handleChange}
                        placeholder="Enter first name"
                      />
                      {formErrors.firstName.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>{formErrors.firstName}</p>
                        </CFormText>
                      )}
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="lastName">Last Name</CLabel>
                      <CInput
                        type="text"
                        onKeyUp={this.handleKeyUp}
                        className={
                          formErrors.lastName.length > 0 ? "error" : null
                        }
                        id="lastName"
                        name="lastName"
                        onChange={this.handleChange}
                        placeholder="Enter last name"
                        noValidate
                      />
                      {formErrors.lastName.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>{formErrors.lastName}</p>
                        </CFormText>
                      )}
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="email">Email Address</CLabel>
                      <CInput
                        type="email"
                        onKeyUp={this.handleKeyUp}
                        className={formErrors.email.length > 0 ? "error" : null}
                        id="email"
                        name="email"
                        onChange={this.handleChange}
                        placeholder="Enter email address"
                        noValidate
                      />
                      {formErrors.email.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>{formErrors.email}</p>
                        </CFormText>
                      )}
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="password">Password</CLabel>
                      <CInput
                        type="password"
                        onKeyUp={this.handleKeyUp}
                        className={
                          formErrors.password.length > 0 ? "error" : null
                        }
                        id="password"
                        name="password"
                        onChange={this.handleChange}
                        placeholder="Enter password"
                        noValidate
                      />
                      {formErrors.password.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>{formErrors.password}</p>
                        </CFormText>
                      )}
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="passwordConfirm">
                        Confirm Password
                      </CLabel>
                      <CInput
                        type="password"
                        onKeyUp={this.handleKeyUp}
                        className={
                          formErrors.passwordConfirm.length > 0 ? "error" : null
                        }
                        id="passwordConfirm"
                        name="passwordConfirm"
                        onChange={this.handleChange}
                        placeholder="Confirm password"
                        noValidate
                      />
                      {formErrors.passwordConfirm.length > 0 && (
                        <CFormText className="help-block">
                          <p style={{ color: "red" }}>
                            {formErrors.passwordConfirm}
                          </p>
                        </CFormText>
                      )}
                    </CFormGroup>
                    <CRow>
                      <CCol md="6" lg="6" xl="6">
                        <CButton
                          disabled={this.state.disableSumbit}
                          className="register"
                          type="submit"
                          color="success"
                          block
                        >
                          Create Account
                        </CButton>
                      </CCol>
                      <CCol md="4" lg="4" xl="4">
                        <CButton
                          onClick={() => this.clearAll()}
                          className="register"
                          color="danger"
                          block
                        >
                          Cancel
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        </CModal>
      </CCol>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default ProfessorsPage;
