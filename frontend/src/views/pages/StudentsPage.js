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
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token);     
    axios({
      method: 'get',
      url: url + 'student',       
      headers: { "Authorization": AuthStr } ,   
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
                  ),
                'name':
                 (item, index)=>(
                    <td>
                        {item.user.name}
                    </td>
                 ),
                'last_name':
                 (item, index)=>(
                    <td>
                        {item.user.last_name}
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