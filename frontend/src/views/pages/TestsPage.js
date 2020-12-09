import React, { Component } from 'react';
import axios from 'axios';

import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CLabel,
  CButton,
  CCollapse,
} from '@coreui/react'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: [],
      tests: []
    };

    this.getTests = this.getTests.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.generateAccordion = this.generateAccordion.bind(this)
  }

  componentDidMount() {
    this.getTests()
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
    return (
      <div>
        <CButton style={{marginLeft: "10px" }} color="success" onClick={event => this.props.history.push('/newTest')}>
          <i class="fas fa-plus"></i>New test
        </CButton>
        {(this.state.tests).map((test, index) =>
          <CCard style={{ backgroundColor: "lightblue", margin: "10px", padding: "2px" }}>
            <CCardHeader>
              <CLabel>
              <h1 hidden={!this.state.accordion[index]} onClick={() => this.toggleAccordion(index)} >{test.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-up"></i>
              </h1>
              <h1 hidden={this.state.accordion[index]} onClick={() => this.toggleAccordion(index)}>
                {test.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-down"></i>
              </h1>
              </CLabel>
              <CButton  onClick={event => this.props.history.push('/takeTest/' + test.id)} >Take test</CButton>
              {/*    <Button block color="link" className="text-center m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[0]} aria-controls={index}>
                    <h5 className="m-0 p-0">Expand</h5>
                  </Button>            
        */}

            </CCardHeader>
            <CCollapse hidden={!this.state.accordion[index]} isOpen={this.state.accordion[index]} data-parent="#accordion" id={index} aria-labelledby={index}>
              <CCardBody style={{ border: "3px solid lightblue", padding: "5px" }}>
                {(test.test_questions).map((question, indexQ) =>
                  <CRow>
                    <CCard style={{ backgroundColor: "whitesmoke" }}>
                      <CCardHeader style={{ padding: "3px" }}>
                        {indexQ + 1}. {question.title} ({question.points})
                      </CCardHeader>
                      <CCardBody>
                        {(question.test_question_answers).map((answer, indexA) =>
                          <CCard style={{ margin: "5px" }}>
                              <label style={{marginLeft:"20px"}}>{indexA + 1}. {answer.title}</label>
                          </CCard>
                        )}
                      </CCardBody>
                    </CCard>
                  </CRow>
                )}
              </CCardBody>
            </CCollapse>
          </CCard>
        )}
      </div>
    );
  }
}

export default TestsPage;