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
            testTitle: "",
            maxScore: 1,
            questions: [],
            questionTitle: "",
            questionPoints: 0,
            hideNewQuestion: true,
            hideNewAnswer: true,
            answerTitle: "",
            isCorrect: false,
            answers:[]
        };

        this.createTest = this.createTest.bind(this)
        this.cancel = this.cancel.bind(this)
        this.addQuestion = this.addQuestion.bind(this)
    }

    componentDidMount() {
    }

    createTest() {
        let test = {
            title: this.state.testTitle,
            professor_id: 1,
            max_score: this.state.maxScore,
            questions: this.state.questions
        }
        axios({
            method: 'post',
            url: url + 'test',
            //headers: { "Authorization": AuthStr } ,   
            data: test 
          }).then((response) => {
            this.props.history.push('/tests')
          }, (error) => {
            console.log(error);
          });    
    }

    cancel() {
        this.props.history.push('/tests')
    }

    addQuestion() {
        let question = {
            title: this.state.questionTitle,
            points: this.state.questionPoints,
            answers:this.state.answers,
        }
        this.setState({questionTitle:"", questionPoints:0, hideNewQuestion:true, answers:[]})
        this.state.questions.push(question)
    }

    addAnswer(){
        let isCorrect = 0
        if(this.state.isCorrect){
            isCorrect = 1
        }
        let answer = {
            title: this.state.answerTitle,
            isCorrect: isCorrect
        }
        this.state.answers.push(answer)
        this.setState({isCorrect:true, answerTitle:"", hideNewAnswer:true})
    }

    render() {
        return (
            <div>
                <Col md="12" lg="12" xs="12">
                    <Row>
                        <Label style={{ marginRight: "10px" }}>Title</Label>
                        <Input type="text" value={this.state.testTitle}
                            onChange={event => this.setState({ testTitle: event.target.value })} />
                    </Row>
                    <Row>
                        <Label style={{ marginRight: "10px" }}>Score</Label>
                        <Input type="number" value={this.state.maxScore} min="1"
                            onChange={event => this.setState({ maxScore: event.target.value })} />
                    </Row>
                    {(this.state.questions).map((question, indexQ) =>
                        <Row>
                            <Card style={{ backgroundColor: "whitesmoke", margin:"10px" }}>
                                <CardHeader style={{ padding: "3px" }}>
                                    <h3>{indexQ + 1}. {question.title} - {question.points} points</h3>
                                </CardHeader>
                                <CardBody>
                                    {(question.answers).map((answer, indexA) =>
                                        <Card style={{ margin: "5px" }}>
                                            <div>
                                                <label hidden={answer.isCorrect === 0} >{indexA + 1}. {answer.title} <i style={{magin:"10px"}} class="fas fa-check"></i></label>
                                                <label hidden={answer.isCorrect === 1} >{indexA + 1}. {answer.title} <i style={{magin:"10px"}} class="fas fa-times"></i></label>
                                            </div>
                                        </Card>
                                    )}
                                </CardBody>
                            </Card>
                        </Row>
                    )}
                    <Row hidden={!this.state.hideNewQuestion} style={{ margin: "10px" }}>
                        <Button style={{ height: "40px" }} onClick={() => this.setState({ hideNewQuestion: false })}>
                            Add question
                        </Button>
                    </Row>
                    <Row hidden={this.state.hideNewQuestion}>
                        <FormGroup row style={{backgroundColor:"whitesmoke"}}>
                            <Col md="3">
                                <Label style={{ marginRight: "10px" }}>Question</Label>
                                <Input type="text" value={this.state.questionTitle}
                                    onChange={event => this.setState({ questionTitle: event.target.value })} />
                            </Col>
                            <Col md="3">
                                <Label style={{ marginRight: "10px" }}>Points</Label>
                                <Input type="number" value={this.state.questionPoints}
                                    onChange={event => this.setState({ questionPoints: event.target.value })} />
                            </Col>
                            {(this.state.answers).map((answer, indexA) =>
                        <Row style={{ backgroundColor: "white", margin:"5px" }}>
                            <h3 hidden={answer.isCorrect === 0}>{indexA + 1}. {answer.title} <i class="fas fa-check"></i> </h3>
                            <h3 hidden={answer.isCorrect === 1}> {indexA + 1}. {answer.title}<i class="fas fa-times"></i></h3>
                        </Row>
                    )}

                            <Row hidden={!this.state.hideNewAnswer} style={{ margin: "10px" }}>
                                <Button  style={{ height: "40px" }} onClick={() => this.setState({ hideNewAnswer: false })}>
                                    Add new answer
                                </Button>
                            </Row>
                            <Row hidden={this.state.hideNewAnswer}>
                        <FormGroup row style={{backgroundColor:"lightblue"}}>
                            <Col md="3">
                                <Label style={{ marginRight: "10px" }}>Answer</Label>
                                <Input type="text" value={this.state.answerTitle}
                                    onChange={event => this.setState({ answerTitle: event.target.value })} />
                            </Col>
                            <Col md="3">
                                <Label style={{ marginRight: "10px" }}>Correct</Label>
                                <Input type="checkbox" value={this.state.isCorrect}
                                    onChange={event => this.setState({ isCorrect: event.target.checked})} />
                            </Col>
                            <Row style={{ margin: "10px" }}>
                                <Button  style={{ height: "40px" }} onClick={() => this.addAnswer()}>
                                    Add answer
                                </Button>
                            </Row>
                        </FormGroup>
                    </Row>
                    <Button hidden={!this.state.hideNewAnswer} style={{ margin: "10px", height: "40px" }} onClick={() => this.addQuestion()}>
                                Add question
                            </Button>
                        </FormGroup>
                    </Row>
                    <Row>
                        <Button style={{ margin: "10px", height: "40px" }} onClick={() => this.createTest()}>
                            Save
        </Button>
                        <Button style={{ margin: "10px", height: "40px" }} onClick={() => this.cancel()}>
                            Cancel
        </Button>
                    </Row>
                </Col>
            </div>
        );
    }
}

export default TestsPage;