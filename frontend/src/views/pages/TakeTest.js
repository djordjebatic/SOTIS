import React, { Component } from 'react';
import axios from 'axios';
import { Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText } from 'react-sidebar-ui'
import {
  Row, Col, Card, CardHeader, CardBody, FormGroup, Label, Form, Input, InputGroup, InputGroupAddon,
  InputGroupText, Button, Collapse, FormText, Dropdown, DropdownToggle, DropdownMenu, ListGroup, ListGroupItem,
  Modal, ModalBody, ModalFooter, ModalHeader, CardFooter
} from "reactstrap";

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: [],
      test: {
          title: "",
          test_questions: [{
              title:"",
              test_question_answers:[]
          }]
      },
    };

    this.getTest = this.getTest.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.generateAccordion = this.generateAccordion.bind(this)
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
      url: url + 'test/' + id,
    }).then((response) => {
      this.setState({ test: response.data })
      this.generateAccordion()
    }, (error) => {
      console.log(error);
    });
  }

  generateAccordion() {
    this.state.accordion = Array((this.state.test.test_questions).length).fill(false)
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : x);

    this.setState({
      accordion: state,
    });
  }

  handleChange(question, answer){
      let temp = this.state.test
      temp.test_questions[question].test_question_answers[answer].isCorrect = !temp.test_questions[question].test_question_answers[answer].isCorrect
      this.setState({test: temp})
  }

  submitAnswers(){
    const { id } = this.props.match.params;
    let data = {
        student_id: 1,
        test_id: id,
        score: 0,
        test: this.state.test
    }
    axios({
        method: 'post',
        url: url + 'test_take',
        //headers: { "Authorization": AuthStr } ,   
        data: data      
      }).then((response) => {
        this.props.history.push('/testDone/' + response.data)
      }, (error) => {
        console.log(error);
      });   
  }

  render() {
    return (
      <div>
          <Card style={{ backgroundColor: "lightblue", margin: "10px", padding: "2px" }}>
            <CardHeader>
              <h1>{this.state.test.title}</h1>
            </CardHeader>
              <CardBody style={{ border: "3px solid lightblue", padding: "5px" }}>
                {(this.state.test.test_questions).map((question, index) =>
                  <Row>
                    <Card style={{ backgroundColor: "whitesmoke", margin:"10px" }}>
                      <CardHeader style={{ padding: "3px" }}>
                      <h2 hidden={!this.state.accordion[index]} onClick={() => this.toggleAccordion(index)} >{question.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-up"></i>
              </h2>
              <h2 hidden={this.state.accordion[index]} onClick={() => this.toggleAccordion(index)}>
                {question.title}
                <i style={{ marginLeft: "10px" }} class="fas fa-angle-down"></i>
              </h2>                      </CardHeader>
              <Collapse hidden={!this.state.accordion[index]} isOpen={this.state.accordion[index]} data-parent="#accordion" id={index} aria-labelledby={index}>
                      <CardBody>
                        {(question.test_question_answers).map((answer, indexA) =>
                          <Card style={{ margin: "5px" }}>
                              <Label style={{marginRight:"10px"}}>{indexA + 1}. {answer.title}</Label>
                              <Input type="checkbox" value={answer.isCorrect} checked={answer.isCorrect}
                                     onChange={event => this.handleChange(index, indexA)}/>
                          </Card>
                        )}
                      </CardBody>
                      </Collapse>
                    </Card>
                  </Row>
                )}
              </CardBody>
              <CardFooter>
              <Button style={{ backgroundColor: "lightgreen", marginLeft: "10px", height:"40px" }} onClick={event => this.submitAnswers()}>Submit</Button>
              </CardFooter>
          </Card>
      </div>
    );
  }
}

export default TestsPage;