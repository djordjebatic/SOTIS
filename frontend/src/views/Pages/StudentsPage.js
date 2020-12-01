import React, { Component } from 'react';
import axios from 'axios';
import {Card, CardBody, CardHeader, Table } from 'reactstrap';

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class StudentsPage extends Component {
  constructor(props)
  {
    super(props);
    this.state = {      
      students: []          
    };


  }

  componentDidMount(){
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
      <Card>
              <CardHeader>
                Students
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Last name</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(this.state.students).map((student, index) =>
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.last_name}</td>
                    </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
    );
  }
}

export default StudentsPage;