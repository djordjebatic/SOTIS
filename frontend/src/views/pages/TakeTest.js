import React, { Component } from 'react';
import axios from 'axios';

import {
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CLabel,
  CInput,
  CButton,
  CCollapse,
  CContainer,
  CCol,
  CFade,
  CLink,
  CFormGroup,
  CInputCheckbox
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { RoleAwareComponent } from 'react-router-role-authorization'
import {Redirect} from 'react-router-dom'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TakeTest extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      accordion: [],
      test: {
        title: "",
        test_questions: [{
          title: "",
          test_question_answers: []
        }]
      },
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_STUDENT'];


    this.getTest = this.getTest.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.generateAccordion = this.generateAccordion.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitAnswers = this.submitAnswers.bind(this)
  }

  componentDidMount() {
    this.getTest()
  }

  getTest() {
    const { id } = this.props.match.params;
    axios({
      method: 'get',
      url: url + 'test/' + id,
    }).then((response) => {
      this.setState({ test: response.data })
      this.generateAccordion()
    }, (error) => {
      console.log(error);
    });
  }

  generateAccordion() {
    this.state.accordion = Array((this.state.test.test_questions).length).fill(false)
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : x);

    this.setState({
      accordion: state,
    });
  }

  handleChange(question, answer) {
    let temp = this.state.test
    temp.test_questions[question].test_question_answers[answer].isCorrect = !temp.test_questions[question].test_question_answers[answer].isCorrect
    this.setState({ test: temp })
  }

  submitAnswers() {
    const { id } = this.props.match.params;
    let data = {
      test_id: id,
      score: 0,
      test: this.state.test
    }
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token);       
    axios({
      method: 'post',
      url: url + 'test_take',
      headers: { "Authorization": AuthStr } ,   
      data: data
    }).then((response) => {
      this.props.history.push('/tests/test/' + response.data)
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    let ret = (
      <div>
        <CCol xl="12" lg="12" md="12" sm="12">
          <CCard>
            <CCardHeader>
              <h1>{this.state.test.title}</h1>
            </CCardHeader>
            <CCardBody>
              <div id="accordion">
                {(this.state.test.test_questions).map((question, index) =>
                  <CCard style={{ margin: "10px" }} className="mb-0">
                    <CCardHeader id="headingOne">
                      <CButton
                        block
                        color="link"
                        className="text-left m-0 p-0"
                        onClick={() => this.toggleAccordion(index)}
                      >
                        <h5 className="m-0 p-0">{question.title}</h5>
                      </CButton>
                    </CCardHeader>
                    <CCollapse show={this.state.accordion[index]}>
                      <CCardBody>
                        {(question.test_question_answers).map((answer, indexA) =>

                          <CFormGroup variant="checkbox" className="checkbox">
                            <br></br>
                            <CInputCheckbox
                              id="isCorrect"
                              name="isCorrect"
                              value={answer.isCorrect}
                              checked={answer.isCorrect}
                              onChange={event => this.handleChange(index, indexA)}
                            />
                            <CLabel variant="checkbox" className="form-check-label" htmlFor="isCorrect">{indexA + 1}. {answer.title}</CLabel>
                          </CFormGroup>
                        )}
                      </CCardBody>
                    </CCollapse>
                  </CCard>
                )}
              </div>
            </CCardBody>
            <CCardFooter>
              <CButton color="success" style={{ marginLeft: "10px", height: "40px" }} onClick={event => this.submitAnswers()}>Submit</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </div>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default TakeTest;