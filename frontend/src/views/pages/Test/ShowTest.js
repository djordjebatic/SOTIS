import React from "react";
import axios from "axios";

import {
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CButton,
  CCol,
  CDataTable,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { RoleAwareComponent } from "react-router-role-authorization";
import { Redirect } from "react-router-dom";

const url =
  process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_PORT + "/";

const fields = ["#", "name", "lastname", "email"];
const fields2 = ["#", "name", "last_name", "email", "score", "results"];
const role = localStorage.getItem("role");
const fieldsAdd = ["#", "name", "last_name", "add"];
const fieldsRemove = ["#", "name", "last_name", "remove"];

class ShowTest extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      test: {
        title: "",
        test_questions: [
          {
            title: "",
            test_question_answers: [],
          },
        ],
      },
      test_takes: [],
      showModal: false,
      studentsTable: [],
      searchStudents: "",
      students: [],
      studentsToAdd: [],
    };

    let arr = [];
    arr.push(localStorage.getItem("role"));
    this.userRoles = arr;
    this.allowedRoles = ["ROLE_PROFESSOR", "ROLE_STUDENT"];

    this.getTest = this.getTest.bind(this);
    this.getTestTake = this.getTestTake.bind(this);
    this.handleStudentsSearch = this.handleStudentsSearch.bind(this);
    this.addStudentToList = this.addStudentToList.bind(this);
    this.removeStudentFromList = this.removeStudentFromList.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.addStudents = this.addStudents.bind(this);
  }

  componentDidMount() {
    this.getTest();
  }

  getStudents(test_takes) {
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    axios({
      method: "get",
      url: url + "course/" + this.state.test.course_id + "/student",
      headers: { Authorization: AuthStr },
    }).then(
      (response) => {
        console.log(response);
        let assigned = [];
        var tt;
        var i;

        for (i in test_takes) {
          tt = test_takes[i];
          if (!tt.done) assigned.push(tt.student);
        }
        var newArray = response.data.filter(function (student) {
          return !assigned.some((p) => p.id === student.id);
        });
        this.setState({ students: response.data, studentsTable: newArray });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTest() {
    const { id } = this.props.match.params;
    axios({
      method: "get",
      url: url + "test/" + id,
    }).then(
      (response) => {
        this.setState({ test: response.data });
        this.getTestTake();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTestTake() {
    const { id } = this.props.match.params;
    axios({
      method: "get",
      url: url + "test/" + id + "/test_take",
    }).then(
      (response) => {
        this.setState({ test_takes: response.data });
        this.getStudents(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  resetAll() {
    let assigned = [];
    var tt;
    var i;
    let test_takes = this.state.test_takes;
    for (i in test_takes) {
      tt = test_takes[i];
      if (!tt.done) assigned.push(tt.student);
    }
    let students = this.state.students;

    var newArray = students.filter(function (student) {
      return !assigned.some((u) => u.id === student.id);
    });
    this.setState({
      showModal: false,
      studentsToAdd: [],
      searchStudents: "",
      studentsTable: newArray,
    });
  }

  handleStudentsSearch(e) {
    let search = e.target.value;
    let assigned = [];
    var tt;
    var i;
    let test_takes = this.state.test_takes;
    for (i in test_takes) {
      tt = test_takes[i];
      if (!tt.done) assigned.push(tt.student);
    }
    let selected = this.state.studentsToAdd;
    let users = this.state.students;
    var temp = users.filter(function (user) {
      return !(
        assigned.some((p) => p.id === user.id) ||
        selected.some((p) => p.id === user.id)
      );
    });
    var newArray = temp.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    this.setState({ searchStudents: search, studentsTable: newArray });
  }

  addStudentToList(user) {
    let search = this.state.searchStudents;
    let assigned = [];
    var tt;
    var i;
    let test_takes = this.state.test_takes;
    for (i in test_takes) {
      tt = test_takes[i];
      if (!tt.done) assigned.push(tt.student);
    }
    let list_to_add = this.state.studentsToAdd;
    list_to_add.push(user);
    let users = this.state.students;
    var temp2 = users.filter(function (user) {
      return !(
        assigned.some((p) => p.id === user.id) ||
        list_to_add.some((p) => p.id === user.id)
      );
    });
    var newArray = temp2.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    this.setState({ studentsToAdd: list_to_add, studentsTable: newArray });
  }

  removeStudentFromList(user) {
    let list_to_add = this.state.studentsToAdd;
    let afterFilter = list_to_add.filter(function (p) {
      return p.id !== user.id;
    });

    let search = this.state.searchStudents;
    let assigned = [];
    var tt;
    var i;
    let test_takes = this.state.test_takes;

    for (i in test_takes) {
      tt = test_takes[i];
      if (!tt.done) assigned.push(tt.student);
    }
    let users = this.state.students;
    var temp2 = users.filter(function (u) {
      return !(
        assigned.some((p) => p.id === u.id) ||
        afterFilter.some((p) => p.id === u.id)
      );
    });
    var newArray = temp2.filter(function (u) {
      return (
        u.user.name.toLowerCase().includes(search.toLowerCase()) ||
        u.user.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    this.setState({ studentsToAdd: afterFilter, studentsTable: newArray });
  }

  addStudents() {
    const { id } = this.props.match.params;
    let token = localStorage.getItem("loggedInUser");
    let AuthStr = "Bearer ".concat(token);
    let list = this.state.studentsToAdd;
    let data = {
      students: list,
    };
    axios({
      method: "put",
      url: url + "test/" + id,
      headers: { Authorization: AuthStr },
      data: data,
    }).then(
      (response) => {
        this.resetAll();
        this.resetAll();
        this.getTestTake();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    const test = this.state.test;
    const test_takes = this.state.test_takes;
    let ret = (
      <div>
        <CCardHeader>
          <h2>{test.title}</h2>
          <h4>Max score: {test.max_score}</h4>
        </CCardHeader>
        <CCardBody style={{ backgroundColor: "white" }}>
          <CTabs activeTab="questions">
            <br />
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="questions">Questions</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="assigned">Assigned</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="results">Results</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="questions">
                <br />
                <CRow>
                  {test.test_questions.map((question, indexQ) => (
                    <CCol xs="4" sm="4" md="4" lg="3">
                      <CCard style={{ margin: "10px" }}>
                        <CCardHeader style={{ padding: "3px" }}>
                          <h3>
                            {indexQ + 1}. {question.title}
                            <small className="card-header-actions">
                              <CBadge
                                shape="pill"
                                color="primary"
                                className="float-right"
                              >
                                {question.points}
                              </CBadge>
                            </small>
                          </h3>
                        </CCardHeader>
                        <CCardBody>
                          {question.test_question_answers.map(
                            (answer, indexA) => (
                              <div
                                style={{
                                  backgroundColor: "whitesmoke",
                                  margin: "5px",
                                }}
                              >
                                <CRow hidden={!answer.isCorrect}>
                                  <CCol lg="10" md="10">
                                    <CLabel style={{ marginRight: "10px" }}>
                                      {indexA + 1}. {answer.title}{" "}
                                    </CLabel>
                                  </CCol>
                                  <CCol lg="2" md="2">
                                    <CIcon
                                      className="text-success"
                                      name="cil-check-circle"
                                    ></CIcon>
                                  </CCol>
                                </CRow>
                                <CRow hidden={answer.isCorrect}>
                                  <CCol lg="10" md="10">
                                    <CLabel
                                      frameBorder
                                      style={{ marginRight: "10px" }}
                                    >
                                      {indexA + 1}. {answer.title}{" "}
                                    </CLabel>
                                  </CCol>
                                  <CCol lg="2" md="2">
                                    <CIcon
                                      className="text-danger"
                                      name="cil-x-circle"
                                    ></CIcon>
                                  </CCol>
                                </CRow>
                              </div>
                            )
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CTabPane>
              <CTabPane data-tab="assigned">
                <br />
                <CButton
                  hidden={role !== "ROLE_PROFESSOR"}
                  style={{ marginBottom: "20px" }}
                  id="confirmButton"
                  onClick={() => this.setState({ showModal: true })}
                  color="success"
                  className="px-4"
                >
                  Add students
                </CButton>
                <CDataTable
                  items={test_takes.filter(function (tt) {
                    return !tt.done;
                  })}
                  fields={fields}
                  striped
                  itemsPerPage={5}
                  pagination
                  scopedSlots={{
                    "#": (item, index) => <td>{index + 1}</td>,
                    name: (item, index) => <td>{item.student.user.name}</td>,
                    lastname: (item, index) => (
                      <td>{item.student.user.last_name}</td>
                    ),
                    email: (item, index) => <td>{item.student.user.email}</td>,
                  }}
                />
              </CTabPane>
              <CTabPane data-tab="results">
                <br />
                <CDataTable
                  items={test_takes.filter(function (tt) {
                    return tt.done;
                  })}
                  fields={fields2}
                  striped
                  itemsPerPage={5}
                  pagination
                  scopedSlots={{
                    "#": (item, index) => <td>{index + 1}</td>,
                    name: (item, index) => <td>{item.student.user.name}</td>,
                    last_name: (item, index) => (
                      <td>{item.student.user.last_name}</td>
                    ),
                    email: (item, index) =>(
                      <td>{item.student.user.email}</td>
                    ),
                    results: (item, index) => <td>
                          <CButton
                            color="success"
                            onClick={(event) => this.props.history.push("/tests/test/" + item.id)}
                          >
                            Details
                          </CButton>
                        </td>
                  }}
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
        <CModal
          show={this.state.showModal}
          onClose={() => this.resetAll(0)}
          size="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Add students</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCol xs="12" lg="12">
              <CRow>
                <CCol xs="6" lg="6">
                  <CInput
                    type="text"
                    id="ksTitle"
                    name="ksTitle"
                    onChange={(e) => this.handleStudentsSearch}
                    value={this.state.searchStudents}
                    placeholder="search"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="6" lg="6">
                  <CDataTable
                    items={this.state.studentsTable}
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
                            onClick={(event) => this.addStudentToList(item)}
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
                    items={this.state.studentsToAdd}
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
                              this.removeStudentFromList(item)
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
              onClick={() => this.addStudents()}
            >
              Add students
            </CButton>{" "}
            <CButton color="danger" onClick={() => this.resetAll(0)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default ShowTest;
