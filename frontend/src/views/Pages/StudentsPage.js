import React, { Component } from 'react';
import axios from 'axios';
import {Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

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
      <Card style={{ backgroundColor: "whiteSmoke" }}>
              <CardHeader>
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