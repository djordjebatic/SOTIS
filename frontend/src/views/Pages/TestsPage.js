import React, { Component } from 'react';
import axios from 'axios';
import { Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText } from 'react-sidebar-ui'
import {
  Row, Col, Card, CardHeader, CardBody, FormGroup, Label, Form, Input, InputGroup, InputGroupAddon,
  InputGroupText, Button, Collapse, FormText, Dropdown, DropdownToggle, DropdownMenu, ListGroup, ListGroupItem,
  Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";

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
        <Button style={{ backgroundColor: "lightgreen", marginLeft: "10px" }} onClick={event => this.props.history.push('/newTest')}>
          <i class="fas fa-plus"></i>
        </Button>
        {(this.state.tests).map((test, index) =>
          <Card style={{ backgroundColor: "lightblue", margin: "10px", padding: "2px" }}>
            <CardHeader>
              <Label>
              <h1 hidden={!this.state.accordion[index]} onClick={() => this.toggleAccordion(index)} >{test.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-up"></i>
              </h1>
              <h1 hidden={this.state.accordion[index]} onClick={() => this.toggleAccordion(index)}>
                {test.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-down"></i>
              </h1>
              </Label>
              <Button  onClick={event => this.props.history.push('/takeTest/' + test.id)} >Take test</Button>
              {/*    <Button block color="link" className="text-center m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[0]} aria-controls={index}>
                    <h5 className="m-0 p-0">Expand</h5>
                  </Button>            
        */}

            </CardHeader>
            <Collapse hidden={!this.state.accordion[index]} isOpen={this.state.accordion[index]} data-parent="#accordion" id={index} aria-labelledby={index}>
              <CardBody style={{ border: "3px solid lightblue", padding: "5px" }}>
                {(test.test_questions).map((question, indexQ) =>
                  <Row>
                    <Card style={{ backgroundColor: "whitesmoke" }}>
                      <CardHeader style={{ padding: "3px" }}>
                        {indexQ + 1}. {question.title} ({question.points})
                      </CardHeader>
                      <CardBody>
                        {(question.test_question_answers).map((answer, indexA) =>
                          <Card style={{ margin: "5px" }}>
                              <label style={{marginLeft:"20px"}}>{indexA + 1}. {answer.title}</label>
                          </Card>
                        )}
                      </CardBody>
                    </Card>
                  </Row>
                )}
              </CardBody>
            </Collapse>
          </Card>
        )}
      </div>
    );
  }
}

export default TestsPage;