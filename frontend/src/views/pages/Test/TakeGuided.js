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
import {NotificationManager} from 'react-notifications';


const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TakeGuided extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        test_question_answers:[],
        title: ''
      },
      question_number: 0,
      test_title: '',
      finished: false
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_STUDENT'];


    this.getTest = this.getTest.bind(this);
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
      url: url + 'tests/take_guided/' + id,
    }).then((response) => {
      this.setState({ question: response.data.question, test_title: response.data.test_title, question_number:response.data.question_number})
    }, (error) => {
      this.props.history.push("/tests/takeTest/" + id)
      console.log(error);
    });
  }

  handleChange(answer) {
    let temp = this.state.question
    temp.test_question_answers[answer].isCorrect = !temp.test_question_answers[answer].isCorrect
    this.setState({ question: temp })
  }

  submitAnswers() {
    const { id } = this.props.match.params;
    let data = {
      question: this.state.question,
      question_number: this.state.question_number
    }
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token);       
    axios({
      method: 'post',
      url: url + 'tests/take_guided/' + id,
      headers: { "Authorization": AuthStr } ,   
      data: data
    }).then((response) => {
        if (response.data.finished){
          this.setState({finished: true, graph:response.data.ks})
        }
        else{
          this.setState({ question: response.data.question, test_title: response.data.test_title, question_number:response.data.question_number})
        }
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    const question = this.state.question;
    const num = this.state.question_number
    let ret = (
      <div>
        <CCol xl="12" lg="12" md="12" sm="12">
          <CCard>
            <CCardHeader>
              <h1>{this.state.test_title}</h1>
            </CCardHeader>
            <CCardBody>
              <div id="accordion">
                  <CCard>
                  <CCardHeader>
                  <h5 className="m-0 p-0">{num}. {question.title}</h5>
                    </CCardHeader>
                      <CCardBody>
                        {(question.test_question_answers).map((answer, indexA) =>

                          <CFormGroup variant="checkbox" className="checkbox">
                            <br></br>
                            <CInputCheckbox
                              id="isCorrect"
                              name="isCorrect"
                              value={answer.isCorrect}
                              checked={answer.isCorrect}
                              onChange={event => this.handleChange(indexA)}
                            />
                            <CLabel variant="checkbox" className="form-check-label" htmlFor="isCorrect">{indexA + 1}. {answer.title}</CLabel>
                          </CFormGroup>
                        )}
                      </CCardBody>
                  </CCard>
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

export default TakeGuided;