import React, { Component } from 'react';
import axios from 'axios';

import {
    CCard,
    CRow,
    CCol,
    CCardBody,
    CCardHeader,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CCollapse,
  } from '@coreui/react'
import CIcon from '@coreui/icons-react';

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
                <CCol md="12" lg="12" xs="12">
                    <CRow>
                        <CLabel style={{ marginRight: "10px" }}>Title</CLabel>
                        <CInput type="text" value={this.state.testTitle}
                            onChange={event => this.setState({ testTitle: event.target.value })} />
                    </CRow>
                    <CRow>
                        <CLabel style={{ marginRight: "10px" }}>Score</CLabel>
                        <CInput type="number" value={this.state.maxScore} min="1"
                            onChange={event => this.setState({ maxScore: event.target.value })} />
                    </CRow>
                    <CRow>
                    {(this.state.questions).map((question, indexQ) =>
                                <CCol xs="12" sm="6" md="3">
                            <CCard style={{ backgroundColor: "whitesmoke", margin:"10px" }}>
                                <CCardHeader style={{ padding: "3px" }}>
                                    <h3>{indexQ + 1}. {question.title} - {question.points} points</h3>
                                </CCardHeader>
                                <CCardBody>
                                    {(question.answers).map((answer, indexA) =>
                                        <CCard style={{ margin: "5px" }}>
                                            <div>
                                                <label hidden={answer.isCorrect === 0} >{indexA + 1}. {answer.title} <CIcon name="cil-check-alt"></CIcon></label>
                                                <label hidden={answer.isCorrect === 1} >{indexA + 1}. {answer.title} <CIcon name="cil-x"></CIcon></label>
                                            </div>
                                        </CCard>
                                    )}
                                </CCardBody>
                            </CCard>
                            </CCol>
                    )}
                    </CRow>
                    <CRow hidden={!this.state.hideNewQuestion} style={{ margin: "10px" }}>
                    <CCol xs="12" sm="12" md="12">
                        <CButton style={{ height: "40px" }} onClick={() => this.setState({ hideNewQuestion: false })}>
                            Add question
                        </CButton>
                        </CCol>
                    </CRow>
                    <CRow hidden={this.state.hideNewQuestion}>
                        <CFormGroup row style={{backgroundColor:"whitesmoke"}}>
                            <CCol md="3">
                                <CLabel style={{ marginRight: "10px" }}>Question</CLabel>
                                <CInput type="text" value={this.state.questionTitle}
                                    onChange={event => this.setState({ questionTitle: event.target.value })} />
                            </CCol>
                            <CCol md="3">
                                <CLabel style={{ marginRight: "10px" }}>Points</CLabel>
                                <CInput type="number" value={this.state.questionPoints}
                                    onChange={event => this.setState({ questionPoints: event.target.value })} />
                            </CCol>
                            {(this.state.answers).map((answer, indexA) =>
                        <CRow style={{ backgroundColor: "white", margin:"5px" }}>
                            <h3 hidden={answer.isCorrect === 0}>{indexA + 1}. {answer.title} <i class="fas fa-check"></i> </h3>
                            <h3 hidden={answer.isCorrect === 1}> {indexA + 1}. {answer.title}<i class="fas fa-times"></i></h3>
                        </CRow>
                    )}
                            <CRow hidden={!this.state.hideNewAnswer} style={{ margin: "10px" }}>
                                <CButton  style={{ height: "40px" }} onClick={() => this.setState({ hideNewAnswer: false })}>
                                    Add new answer
                                </CButton>
                            </CRow>
                            <CRow hidden={this.state.hideNewAnswer}>
                            <CCol xs="12" sm="12" md="12">
                        <CFormGroup row style={{backgroundColor:"lightblue"}}>

                            <CCol md="12">
                                <CLabel style={{ marginRight: "10px" }}>Answer</CLabel>
                                <CInput type="text" value={this.state.answerTitle}
                                    onChange={event => this.setState({ answerTitle: event.target.value })} />
                            </CCol>
                            <CCol md="12">
                                <CLabel style={{ marginRight: "10px" }}>Correct</CLabel>
                                <CInput type="checkbox" value={this.state.isCorrect}
                                    onChange={event => this.setState({ isCorrect: event.target.checked})} />
                            </CCol>
                            <CRow style={{ margin: "10px" }}>
                                <CButton  style={{ height: "40px" }} onClick={() => this.addAnswer()}>
                                    Add answer
                                </CButton>
                            </CRow>
                        </CFormGroup>
                        </CCol>
                    </CRow>
                    <CCol xs="12" sm="12" md="12">
                    <CButton hidden={!this.state.hideNewAnswer} style={{ margin: "10px", height: "40px" }} onClick={() => this.addQuestion()}>
                                Add question
                            </CButton>
                    </CCol>
                        </CFormGroup>
                    </CRow>
                    <CRow>
                        <CButton style={{ margin: "10px", height: "40px" }} onClick={() => this.createTest()}>
                            Save
        </CButton>
                        <CButton style={{ margin: "10px", height: "40px" }} onClick={() => this.cancel()}>
                            Cancel
        </CButton>
                    </CRow>
                </CCol>
            </div>
        );
    }
}

export default TestsPage;