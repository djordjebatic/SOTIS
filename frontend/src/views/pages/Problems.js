import React, { Component } from 'react';
import axios from 'axios';

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
} from '@coreui/react'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

const fields = ['#','name', 'last_name']

class Problems extends Component {
  constructor(props)
  {
    super(props);
    this.state = {      
      problems: [],
      showModal: false,
      title: '',
      errorTitle: '',
      buttonDisabled: true
    };

    this.getProblems = this.getProblems.bind(this);
    this.addProblem = this.addProblem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateTitle = this.validateTitle.bind(this);
    this.resetAll = this.resetAll.bind(this);
  }

  componentDidMount(){
    this.getProblems()
}

  getProblems(){
    axios({
      method: 'get',
      url: url + 'problem',       
  }).then((response) => {
      console.log(response);
      this.setState({problems:response.data})
  }, (error) => {
      console.log(error);
  });
  }

  addProblem(){

    this.resetAll()
  }

  resetAll(){
    this.setState({showModal:false, buttonDisabled:true, title:'', errorTitle:''})
  }

  handleChange = e =>{
    e.preventDefault();

    this.setState({title: e.target.value})
    this.validateTitle(e.target.value)
  }

  validateTitle(title){
    title = title.trim()
    if(title === ''){
        this.setState({errorTitle: 'Title can not be empty', buttonDisabled:true})
    }
    else{
        this.setState({errorTitle: '', buttonDisabled: false})
    }
  }

  render() {
    return (
        <div>
            <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <CButton id="confirmButton" onClick={() => this.setState({showModal:true})} color="success" className="px-4">New problem</CButton>
            </CCol>

            <CModal 
              show={this.state.showModal} 
              onClose={() => this.resetAll()}
            >
              <CModalHeader closeButton>
                <CModalTitle>New problem</CModalTitle>
              </CModalHeader>
              <CModalBody>
              <CFormGroup>
                      <CLabel htmlFor="problemTitle">Problem title</CLabel>
                      <CInput type="text"
                        id="problemTitle"
                        name="problemTitle"
                        onChange={this.handleChange}
                        value={this.state.title}
                        placeholder="Title"
                      />
                    <CFormText className="help-block"><p style={{ color: "red" }}>{this.state.errorTitle}</p></CFormText>

                    </CFormGroup>
              </CModalBody>
              <CModalFooter>
                <CButton disabled={this.state.buttonDisabled} color="success" onClick={() => this.addProblem()}>Add problem</CButton>{' '}
                <CButton color="danger" onClick={() => this.resetAll()}>Cancel</CButton>
              </CModalFooter>
            </CModal>
        </div>
    );
  }
}

export default Problems;