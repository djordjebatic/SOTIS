import React, { Component } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CLabel,
  CButton,
  CCollapse,
  CContainer,
  CCol,
  CFade,
  CLink,
  CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as _ from 'lodash'


import { RoleAwareComponent } from 'react-router-role-authorization';
import {Redirect} from 'react-router-dom'


const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TestsPage extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
      accordion: [],
      tests: [],
      collapsed: false,
      showCard: true,
      role: ''
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_PROFESSOR', 'ROLE_STUDENT'];

    this.getTests = this.getTests.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.generateAccordion = this.generateAccordion.bind(this)
    this.setCollapsed = this.setCollapsed.bind(this)
    this.setShowCard = this.setShowCard.bind(this)
  }

  setCollapsed(i) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => i === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  setShowCard(showCard) {
    this.setShowCard({ showCard: !showCard })
  }

  componentDidMount() {
    this.getTests()
    this.setState({role:localStorage.getItem("role")})
  }

  getTests() {
    axios({
      method: 'get',
      url: url + 'test',
    }).then((response) => {
      console.log(response);
      this.setState({ tests: response.data })
      this.generateAccordion()
    }, (error) => {
      console.log(error);
    });
  }

  generateAccordion() {
    this.state.accordion = Array((this.state.tests).length).fill(false)
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  render() {
    let ret = (
      <>
        <CButton hidden={this.state.role !== 'ROLE_PROFESSOR'} style={{ marginLeft: "10px", marginBottom: "20px" }} color="success" onClick={event => this.props.history.push('/tests/newTest')}>
          +
        </CButton>
        <CRow>
          {(this.state.tests).map((test, index) =>
            <CCol xs="12" sm="6" md="4">
              <CFade in={this.state.showCard}>
                <CCard>
                  <CCardHeader>
                    {test.title} - {test.max_score} points
                <div className="card-header-actions">
                      <CLink className="card-header-action" onClick={() => this.setCollapsed(index)}>
                        <CIcon name={this.state.accordion[index] ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
                      </CLink>
                      <CLink className="card-header-action">
                        <CIcon name="cil-x-circle" />
                      </CLink>
                    </div>
                  </CCardHeader>
                  <CCollapse show={this.state.accordion[index]}>
                    <CCardBody hidden={this.state.role !== 'ROLE_PROFESSOR'}>
                      <CRow>
                        {(_.sortBy(test.test_questions,"position")).map((question, indexQ) =>
                          <CCol xs="12" sm="6" md="4" lg="4">
                            <CCard style={{ backgroundColor: "whitesmoke", margin:"1px" }}>
                              <CCardHeader>
                                {indexQ + 1}. {question.title} ({question.points})
                      </CCardHeader>
                              <CCardBody style={{padding:"3px"}}>
                                {(question.test_question_answers).map((answer, indexA) =>
                                  <CCard style={{ margin: "3px" }}>
                                    <label>{indexA + 1}. {answer.title}</label>
                                  </CCard>
                                )}
                              </CCardBody>
                            </CCard>
                          </CCol>
                        )}
                      </CRow>
                    </CCardBody>
                    <CCardFooter>
                      <CButton hidden={this.state.role !== 'ROLE_STUDENT'} color="primary" onClick={event => this.props.history.push('/tests/takeTest/' + test.id)} >Take test</CButton>
                    </CCardFooter>
                  </CCollapse>
                </CCard>
              </CFade>
            </CCol>
          )}
        </CRow>
      </>
    );
    return this.rolesMatched() ? ret : <Redirect to="/tests" />;
  }
}

export default TestsPage;