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
  CDataTable,
  CFade,
  CLink,
  CFormGroup,
  CInputCheckbox,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { RoleAwareComponent } from 'react-router-role-authorization'
import {Redirect} from 'react-router-dom'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

const fields = ['#','course', 'title', 'max_score', 'take_test']
const fields2 = ["#", "course", "title", "score", "details"];
const role = localStorage.getItem("role")

class StudentTests extends RoleAwareComponent {
  constructor(props) {
    super(props);
    this.state = {
        test_takes:[]
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_PROFESSOR', 'ROLE_STUDENT'];


    this.getTestTake = this.getTestTake.bind(this)
  }

  componentDidMount() {
    this.getTestTake()
  }

  getTestTake(){
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token); 
    const { id } = this.props.match.params;
    axios({
      method: 'get',
      url: url + '/test_take',
      headers: { "Authorization": AuthStr } ,   
    }).then((response) => {
      this.setState({ test_takes: response.data})
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    const test_takes = this.state.test_takes
    let ret =  (
      <div >
        <CCardHeader>
            <h2>Tests</h2>
        </CCardHeader>
        <CCardBody style={{backgroundColor: "white"}}>
                <CTabs activeTab="assigned">
          <br/>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="assigned">Assigned</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="results">Results</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent >
            <CTabPane data-tab="assigned">
              <br/>
              <CDataTable
                        items={test_takes.filter(function (tt) {
                            return !tt.done
                        })}
                        fields={fields}
                        striped
                        itemsPerPage={5}
                        pagination
                        scopedSlots={{
                          "#": (item, index) => <td>{index + 1}</td>,

                          take_test: (item, index) =><td>
                          <CButton
                            color="primary"
                            onClick={(event) => this.props.history.push("/tests/takeTest/" + item.id)}
                          >
                            Take test
                          </CButton>
                        </td>
                        }}
                      />
            </CTabPane>
            <CTabPane data-tab="results">
            <br/>
              <CDataTable
                        items={test_takes.filter(function (tt) {
                            return tt.done
                        })}
                        fields={fields2}
                        striped
                        itemsPerPage={5}
                        pagination
                        scopedSlots={{
                          "#": (item, index) => <td>{index + 1}</td>,
                          score: (item, index) => <td>{item.score}/{item.max_score}</td>,
                        details: (item, index) => <td>
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
      </div>
    );
    return this.rolesMatched() ? ret : <Redirect to="/courses" />;
  }
}

export default StudentTests;