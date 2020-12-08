import React, { Component } from 'react';
import axios from 'axios';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable
} from '@coreui/react'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

const fields = ['#','name', 'last_name']

class StudentsPage extends Component {
  constructor(props)
  {
    super(props);
    this.state = {      
      students: []          
    };

    this.getStudents = this.getStudents.bind(this);

  }

  componentDidMount(){
    this.getStudents()
}

  getStudents(){
    axios({
      method: 'get',
      url: url + 'student',       
  }).then((response) => {
      console.log(response);
      this.setState({students:response.data.students})
  }, (error) => {
      console.log(error);
  });
  }


  render() {
    return (
      <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Students
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={this.state.students}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                '#':
                  (item, index)=>(
                    <td>
                        {index + 1}
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
    );
  }
}

export default StudentsPage;