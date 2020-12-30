import React, { Component } from "react";
import axios from "axios";

import {
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CRow,
  CWidgetBrand,
} from "@coreui/react";

import { RoleAwareComponent } from "react-router-role-authorization";
import { Redirect } from "react-router-dom";

const url =
  process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_PORT + "/";

class Courses extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      courses: [
        {
          title: "Predmet 1",
          tests: [],
          professors: [],
          students: [],
        },
      ],
      showModal: false,
      title: "",
      errorTitle: "",
      buttonDisabled: true,
    };

    let arr = [];
    arr.push(localStorage.getItem("role"));
    this.userRoles = arr;
    this.allowedRoles = ["ROLE_PROFESSOR", "ROLE_STUDENT", "ROLE_ADMIN"];

    this.getCourses = this.getCourses.bind(this);
    this.addCourse = this.addCourse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateTitle = this.validateTitle.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.getRightFooter = this.getRightFooter.bind(this);
    this.getRightHeader = this.getRightHeader.bind(this);
    this.getLeftFooter = this.getLeftFooter.bind(this);
    this.getLeftHeadLr = this.getLeftHeader.bind(this);
  }

  componentDidMount() {
    this.getCourses();
  }

  getCourses() {
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token); 
    axios({
      method: "get",
      url: url + "course",
      headers: { "Authorization": AuthStr } ,
    }).then(
      (response) => {
        console.log(response);
        this.setState({ courses: response.data });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addCourse() {
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token); 
    let data = {
      title: this.state.title,
    };
    axios({
      method: "post",
      url: url + "course",
      headers: { "Authorization": AuthStr } ,
      data: data,
    }).then(
      (response) => {
        let temp = this.state.courses;
        temp.push(response.data);
        this.setState({ courses: temp });
        this.resetAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  resetAll() {
    this.setState({
      showModal: false,
      buttonDisabled: true,
      title: "",
      errorTitle: "",
    });
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({ title: e.target.value });
    this.validateTitle(e.target.value);
  };

  validateTitle(title) {
    title = title.trim();
    if (title === "") {
      this.setState({
        errorTitle: "Title can not be empty",
        buttonDisabled: true,
      });
    } else {
      this.setState({ errorTitle: "", buttonDisabled: false });
    }
  }

  getColor(index) {
    let n = index % 7;
    switch (n) {
      case 0:
        return "facebook";
      case 1:
        return "info";
      case 2:
        return "warning";
      case 3:
        return "danger";
      case 4:
        return "linkedin";
      case 5:
        return "success";
      default:
        return "primary";
    }
  }

  getLeftHeader(course, role) {
    switch (role) {
      case "ROLE_ADMIN":
        return course.professors.length;
      case "ROLE_PROFESSOR":
        return course.tests.length;
      case "ROLE_STUDENT":
        return course.professors.length;
      default:
        return "";
    }
  }
  getLeftFooter(role) {
    switch (role) {
      case "ROLE_ADMIN":
        return "professors";
      case "ROLE_PROFESSOR":
        return "tests";
      case "ROLE_STUDENT":
        return "professors";
      default:
        return "";
    }
  }

  getRightHeader(course, role) {
    switch (role) {
      case "ROLE_ADMIN":
        return course.students.length;
      case "ROLE_PROFESSOR":
        return course.students.length;
      case "ROLE_STUDENT":
        return course.tests.length;
      default:
        return "";
    }
  }
  getRightFooter(role) {
    switch (role) {
      case "ROLE_ADMIN":
        return "students";
      case "ROLE_PROFESSOR":
        return "students";
      case "ROLE_STUDENT":
        return "tests";
      default:
        return "";
    }
  }

  render() {
    const role = localStorage.getItem("role");
    let ret = (
      <div>
        <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
          <CButton
            hidden={role !== "ROLE_ADMIN"}
            style={{ marginBottom: "20px" }}
            id="confirmButton"
            onClick={() => this.setState({ showModal: true })}
            color="success"
            className="px-4"
          >
            Create new course
          </CButton>
        </CCol>
        <CRow>
          {this.state.courses.map((course, index) => (
            <CCol xs="12" sm="6" lg="3">
              <CWidgetBrand
                onClick={(event) =>
                  this.props.history.push("/courses/" + course.id)
                }
                color={this.getColor(index)}
                rightHeader={this.getRightHeader(course, role)}
                rightFooter={this.getRightFooter(role)}
                leftHeader={this.getLeftHeader(course, role)}
                leftFooter={this.getLeftFooter(role)}
              >
                <h1 height="56px" className="my-4">
                  {course.title}
                </h1>
              </CWidgetBrand>
            </CCol>
          ))}
        </CRow>

        <CModal show={this.state.showModal} onClose={() => this.resetAll()}>
          <CModalHeader closeButton>
            <CModalTitle>Create new course</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup>
              <CLabel htmlFor="courseTitle">Course Title</CLabel>
              <CInput
                type="text"
                id="courseTitle"
                name="courseTitle"
                onChange={this.handleChange}
                value={this.state.title}
                placeholder="Title"
              />
              <CFormText className="help-block">
                <p style={{ color: "red" }}>{this.state.errorTitle}</p>
              </CFormText>
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton
              disabled={this.state.buttonDisabled}
              color="success"
              onClick={() => this.addCourse()}
            >
              Add
            </CButton>{" "}
            <CButton color="danger" onClick={() => this.resetAll()}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default Courses;
