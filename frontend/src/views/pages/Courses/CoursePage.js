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
  CCardFooter,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CModalFooter,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";

import { RoleAwareComponent } from "react-router-role-authorization";

import TestsPage from "../TestsPage.js";
import KnowledgeSpace from "../KnowledgeSpace/KnowledgeSpace.js";

const url =
  process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_PORT + "/";

const fields = ["#", "name", "last_name", "email"];
const fieldsAdd = ["#", "name", "last_name", "add"];
const fieldsRemove = ["#", "name", "last_name", "remove"];

class CoursePage extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      course: [],
      showModal: [false, false], // 0 - professors, 1 - students
      usersToAdd: [[], []],
      users: [[], []],
      searchUsers: ["", ""],
      usersTable: [],
    };

    let arr = [];
    arr.push(localStorage.getItem("role"));
    this.userRoles = arr;
    this.allowedRoles = ["ROLE_PROFESSOR", "ROLE_STUDENT", "ROLE_ADMIN"];

    this.getCourse = this.getCourse.bind(this);
    this.getProfessors = this.getProfessors.bind(this);
    this.getStudents = this.getStudents.bind(this);
    this.handleUsersSearch = this.handleUsersSearch.bind(this);
    this.addUserToList = this.addUserToList.bind(this);
    this.removeUserFromList = this.removeUserFromList.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.addUsers = this.addUsers.bind(this);
  }

  componentDidMount() {
    this.getCourse();
  }

  getProfessors(course_professors) {
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    axios({
      method: "get",
      url: url + "users/professor",
      headers: { Authorization: AuthStr },
    }).then(
      (response) => {
        console.log(response);
        var newArray = response.data.filter(function (professor) {
          return !course_professors.some((p) => p.id === professor.id);
        });
        let temp = this.state.usersTable;
        temp[0] = newArray;
        let temp2 = this.state.users;
        temp2[0] = response.data;
        this.setState({ users: temp2, usersTable: temp });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStudents(course_students) {
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    axios({
      method: "get",
      url: url + "users/student",
      headers: { Authorization: AuthStr },
    }).then(
      (response) => {
        console.log(response);
        var newArray = response.data.filter(function (student) {
          return !course_students.some((p) => p.id === student.id);
        });
        let temp = this.state.usersTable;
        temp[1] = newArray;
        let temp2 = this.state.users;
        temp2[1] = response.data;
        this.setState({ users: temp2, usersTable: temp });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCourse() {
    const { id } = this.props.match.params;
    axios({
      method: "get",
      url: url + "course/" + id,
    }).then(
      (response) => {
        this.setState({ course: response.data });
        this.getProfessors(response.data.professors);
        this.getStudents(response.data.students);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  resetAll(index) {
    let course_list = this.state.course.professors;
    let users = this.state.users[index];
    if (index == 1) {
      course_list = this.state.course.students;
    }

    var newArray = users.filter(function (user) {
      return !course_list.some((u) => u.id === user.id);
    });
    if (index == 0) {
      this.setState({
        showModal: [false, false],
        usersToAdd: [[], []],
        searchUsers: ["", ""],
        usersTable: [newArray, this.state.usersTable[1]],
      });
    } else {
      this.setState({
        showModal: [false, false],
        usersToAdd: [[], []],
        searchUsers: ["", ""],
        usersTable: [this.state.usersTable[0], newArray],
      });
    }
  }

  handleUsersSearch(e, index) {
    let search = e.target.value;
    let course_list = this.state.course.professors;
    let selected = this.state.usersToAdd[index];
    if (index === 1) {
      course_list = this.state.course.students;
    }
    let users = this.state.users[index];
    var temp = users.filter(function (user) {
      return !(
        course_list.some((p) => p.id === user.id) ||
        selected.some((p) => p.id === user.id)
      );
    });
    var newArray = temp.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (index == 0) {
      this.setState({
        searchUsers: [search, ""],
        usersTable: [newArray, this.state.usersTable[1]],
      });
    } else {
      this.setState({
        searchUsers: ["", search],
        usersTable: [this.state.usersTable[0], newArray],
      });
    }
  }

  addUserToList(user, index) {
    let search = this.state.searchUsers[index];
    let course_list = this.state.course.professors;
    let list_to_add = this.state.usersToAdd[index];
    list_to_add.push(user);
    if (index === 1) {
      course_list = this.state.course.students;
    }
    let users = this.state.users[index];
    var temp2 = users.filter(function (user) {
      return !(
        course_list.some((p) => p.id === user.id) ||
        list_to_add.some((p) => p.id === user.id)
      );
    });
    var newArray = temp2.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (index == 0) {
      this.setState({
        usersToAdd: [list_to_add, this.state.usersToAdd[1]],
        usersTable: [newArray, this.state.usersTable[1]],
      });
    } else {
      this.setState({
        usersToAdd: [this.state.usersToAdd[0], list_to_add],
        usersTable: [this.state.usersTable[0], newArray],
      });
    }
  }

  removeUserFromList(user, index) {
    let list_to_add = this.state.usersToAdd[index];
    let afterFilter = list_to_add.filter(function (p) {
      return p.id !== user.id;
    });

    let search = this.state.searchUsers[index];
    let course_list = this.state.course.professors;
    if (index === 1) {
      course_list = this.state.course.students;
    }
    let users = this.state.users[index];
    var temp2 = users.filter(function (u) {
      return !(
        course_list.some((p) => p.id === u.id) ||
        afterFilter.some((p) => p.id === u.id)
      );
    });
    var newArray = temp2.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (index == 0) {
      this.setState({
        usersToAdd: [afterFilter, this.state.usersToAdd[1]],
        usersTable: [newArray, this.state.usersTable[1]],
      });
    } else {
      this.setState({
        usersToAdd: [this.state.usersToAdd[0], afterFilter],
        usersTable: [this.state.usersTable[0], newArray],
      });
    }
    this.setState({ professorsTable: newArray, professorsToAdd: afterFilter });
  }

  addUsers(role) {
    const { id } = this.props.match.params;
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    let list = this.state.usersToAdd[0];
    if (role == "student") {
      list = this.state.usersToAdd[1];
    }
    let data = {
      role: role,
      users: list,
    };
    axios({
      method: "put",
      url: url + "course/" + id,
      headers: { Authorization: AuthStr },
      data: data,
    }).then(
      (response) => {
        this.setState({ course: response.data });
        this.resetAll(0);
        this.resetAll(1);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    const role = localStorage.getItem("role");
    const professors = this.state.course.professors;
    const students = this.state.course.students;
    const { id } = this.props.match.params;
    let ret = (
      <CCol xs="12" lg="12">
        <CModal
          show={this.state.showModal[0]}
          onClose={() => this.resetAll(0)}
          size="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Add professors to course</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCol xs="12" lg="12">
              <CRow>
                <CCol xs="6" lg="6">
                  <CInput
                    type="text"
                    id="ksTitle"
                    name="ksTitle"
                    onChange={(e) => this.handleUsersSearch(e, 0)}
                    value={this.state.searchUsers[0]}
                    placeholder="search"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="6" lg="6">
                  <CDataTable
                    items={this.state.usersTable[0]}
                    fields={fieldsAdd}
                    striped
                    itemsPerPage={5}
                    pagination
                    scopedSlots={{
                      "#": (item, index) => <td>{index + 1}</td>,
                      name: (item, index) => <td>{item.user.name}</td>,
                      last_name: (item, index) => (
                        <td>{item.user.last_name}</td>
                      ),
                      add: (item, index) => (
                        <td>
                          <CButton
                            color="success"
                            onClick={(event) => this.addUserToList(item, 0)}
                          >
                            +
                          </CButton>
                        </td>
                      ),
                    }}
                  />
                </CCol>
                <CCol xs="6" lg="6">
                  <CDataTable
                    items={this.state.usersToAdd[0]}
                    fields={fieldsRemove}
                    striped
                    itemsPerPage={5}
                    pagination
                    scopedSlots={{
                      "#": (item, index) => <td>{index + 1}</td>,
                      name: (item, index) => <td>{item.user.name}</td>,
                      last_name: (item, index) => (
                        <td>{item.user.last_name}</td>
                      ),
                      remove: (item, index) => (
                        <td>
                          <CButton
                            color="danger"
                            onClick={(event) =>
                              this.removeUserFromList(item, 0)
                            }
                          >
                            -
                          </CButton>
                        </td>
                      ),
                    }}
                  />
                </CCol>
              </CRow>
            </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton
              disabled={this.state.buttonDisabled}
              color="success"
              onClick={() => this.addUsers("professor")}
            >
              Add professors
            </CButton>{" "}
            <CButton color="danger" onClick={() => this.resetAll(0)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={this.state.showModal[1]}
          onClose={() => this.resetAll(1)}
          size="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Add students to course</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCol xs="12" lg="12">
              <CRow>
                <CCol xs="6" lg="6">
                  <CInput
                    type="text"
                    id="ksTitle"
                    name="ksTitle"
                    onChange={(e) => this.handleUsersSearch(e, 1)}
                    value={this.state.searchUsers[1]}
                    placeholder="search"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="6" lg="6">
                  <CDataTable
                    items={this.state.usersTable[1]}
                    fields={fieldsAdd}
                    striped
                    itemsPerPage={5}
                    pagination
                    scopedSlots={{
                      "#": (item, index) => <td>{index + 1}</td>,
                      name: (item, index) => <td>{item.user.name}</td>,
                      last_name: (item, index) => (
                        <td>{item.user.last_name}</td>
                      ),
                      add: (item, index) => (
                        <td>
                          <CButton
                            color="success"
                            onClick={(event) => this.addUserToList(item, 1)}
                          >
                            +
                          </CButton>
                        </td>
                      ),
                    }}
                  />
                </CCol>
                <CCol xs="6" lg="6">
                  <CDataTable
                    items={this.state.usersToAdd[1]}
                    fields={fieldsRemove}
                    striped
                    itemsPerPage={5}
                    pagination
                    scopedSlots={{
                      "#": (item, index) => <td>{index + 1}</td>,
                      name: (item, index) => <td>{item.user.name}</td>,
                      last_name: (item, index) => (
                        <td>{item.user.last_name}</td>
                      ),
                      remove: (item, index) => (
                        <td>
                          <CButton
                            color="danger"
                            onClick={(event) =>
                              this.removeUserFromList(item, 1)
                            }
                          >
                            -
                          </CButton>
                        </td>
                      ),
                    }}
                  />
                </CCol>
              </CRow>
            </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton
              disabled={this.state.buttonDisabled}
              color="success"
              onClick={() => this.addUsers("student")}
            >
              Add students
            </CButton>{" "}
            <CButton color="danger" onClick={() => this.resetAll(1)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CRow>
          <h2>{this.state.course.title}</h2>
        </CRow>
        <CTabs activeTab="people">
          <br/>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="people">People</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="tests">Tests</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="knowledge_spaces">Knowledge Spaces</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane data-tab="people">
              <CRow>
                <CCol xs="6" lg="6">
                  <CCard>
                    <CCardHeader>
                      <h4>Professors</h4>
                    </CCardHeader>
                    <CCardBody>
                      <CDataTable
                        items={professors}
                        fields={fields}
                        striped
                        itemsPerPage={5}
                        pagination
                        scopedSlots={{
                          "#": (item, index) => <td>{index + 1}</td>,
                          name: (item, index) => <td>{item.user.name}</td>,
                          last_name: (item, index) => (
                            <td>{item.user.last_name}</td>
                          ),
                          email: (item, index) => <td>{item.user.email}</td>,
                        }}
                      />
                    </CCardBody>
                    <CCardFooter>
                      <CButton
                        hidden={role !== "ROLE_ADMIN"}
                        style={{ marginBottom: "20px" }}
                        id="confirmButton"
                        onClick={() =>
                          this.setState({ showModal: [true, false] })
                        }
                        color="success"
                        className="px-4"
                      >
                        Add professors
                      </CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs="6" lg="6">
                  <CCard>
                    <CCardHeader>
                      <h4>Students</h4>
                    </CCardHeader>
                    <CCardBody>
                      <CDataTable
                        items={students}
                        fields={fields}
                        striped
                        itemsPerPage={5}
                        pagination
                        scopedSlots={{
                          "#": (item, index) => <td>{index + 1}</td>,
                          name: (item, index) => <td>{item.user.name}</td>,
                          last_name: (item, index) => (
                            <td>{item.user.last_name}</td>
                          ),
                          email: (item, index) => <td>{item.user.email}</td>,
                        }}
                      />
                    </CCardBody>
                    <CCardFooter>
                      <CButton
                        hidden={
                          role !== "ROLE_ADMIN" && role !== "ROLE_PROFESSOR"
                        }
                        style={{ marginBottom: "20px" }}
                        id="confirmButton"
                        onClick={() =>
                          this.setState({ showModal: [false, true] })
                        }
                        color="success"
                        className="px-4"
                      >
                        Add students
                      </CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>
            <CTabPane data-tab="tests">
              <br/>
              <TestsPage course_id={id} />
            </CTabPane>
            <CTabPane data-tab="knowledge_spaces">
            <br/>
              <KnowledgeSpace course_id={id}/>
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCol>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default CoursePage;
