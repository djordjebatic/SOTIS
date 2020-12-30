import React, { Component } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import { withRouter } from "react-router";

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
  CSelect,
} from "@coreui/react";

import { RoleAwareComponent } from "react-router-role-authorization";
import { Redirect } from "react-router-dom";

const url =
  process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_PORT + "/";

class KnowledgeSpace extends RoleAwareComponent {
    static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      knowledgeSpaces: [],
      showModal: false,
      title: "",
      errorTitle: "",
      buttonDisabled: true,
      tests: [],
      test_id: 0,
    };

    let arr = [];
    arr.push(localStorage.getItem("role"));
    this.userRoles = arr;
    this.allowedRoles = ["ROLE_PROFESSOR", "ROLE_STUDENT"];

    this.getKnowledgeSpaces = this.getKnowledgeSpaces.bind(this);
    this.addKnowledgeSpace = this.addKnowledgeSpace.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateTitle = this.validateTitle.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.getTests = this.getTests.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
  }

  componentDidMount() {
    this.getKnowledgeSpaces();
  }

  getKnowledgeSpaces() {
    axios({
      method: "get",
      url: url + "knowledge_space",
    }).then(
      (response) => {
        console.log(response);
        this.setState({ knowledgeSpaces: response.data });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTests() {
    this.setState({ showModal: true });
    axios({
      method: "get",
      url: url + "course/" + this.props.course_id + "/tests",
    }).then(
      (response) => {
        console.log(response);
        this.setState({ tests: response.data });
        if (response.data.length > 0) {
          this.setState({ test_id: response.data[0].id });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addKnowledgeSpace() {
    let data = {
      title: this.state.title,
      test_id: this.state.test_id,
      course_id: this.props.course_id,
    };
    axios({
      method: "post",
      url: url + "knowledge_space",
      //headers: { "Authorization": AuthStr } ,
      data: data,
    }).then(
      (response) => {
        let temp = this.state.knowledgeSpaces;
        temp.push(response.data);
        this.setState({ knowledgeSpaces: temp });
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

  handleDropDown(e){
  this.setState({test_id: e.target.value})
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

  render() {
    const { match, location, history } = this.props;
    let ret = (
      <div>
        <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
          <CButton
            style={{ marginBottom: "20px" }}
            id="confirmButton"
            onClick={() => this.getTests()}
            color="success"
            className="px-4"
          >
            New Knowledge Space
          </CButton>
        </CCol>
        <CRow>
          {this.state.knowledgeSpaces.map((ks, index) => (
            <CCol xs="12" sm="6" lg="3" hidden={ks.isReal}>
              <CWidgetBrand
                onClick={(event) =>
                  history.push("/knowledgeSpace/" + ks.id)
                }
                color={this.getColor(index)}
                rightHeader={ks.problems.length}
                rightFooter={"nodes"}
                leftHeader={ks.edges.length}
                leftFooter="edges"
              >
                <h1 height="56px" className="my-4">
                  {ks.title}
                </h1>
              </CWidgetBrand>
            </CCol>
          ))}
        </CRow>

        <CModal show={this.state.showModal} onClose={() => this.resetAll()}>
          <CModalHeader closeButton>
            <CModalTitle>Add Knowledge Space</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup>
              <CLabel htmlFor="problemTitle">Knowledge Space Title</CLabel>
              <CInput
                type="text"
                id="ksTitle"
                name="ksTitle"
                onChange={this.handleChange}
                value={this.state.title}
                placeholder="Title"
              />
              <CFormText className="help-block">
                <p style={{ color: "red" }}>{this.state.errorTitle}</p>
              </CFormText>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="12">
                <CLabel htmlFor="select">Test</CLabel>
              </CCol>
              <CCol xs="12" md="12">
                <CSelect custom name="select" id="select"
                  value={this.state.test_id}
                  onChange={this.handleDropDown}
                >
                {this.state.tests.map((test) => (
                    <option value={test.id}>{test.title}</option>
                  ))}
                </CSelect>
              </CCol>
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton
              disabled={this.state.buttonDisabled}
              color="success"
              onClick={() => this.addKnowledgeSpace()}
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
const KnowledgeSpaceWithRouter = withRouter(KnowledgeSpace);
export default KnowledgeSpaceWithRouter;
