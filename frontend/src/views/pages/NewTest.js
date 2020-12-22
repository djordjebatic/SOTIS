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
    CBadge,
    CModal,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CInputCheckbox
} from '@coreui/react'
import CIcon from '@coreui/icons-react';

import { RoleAwareComponent } from 'react-router-role-authorization'
import {Redirect} from 'react-router-dom'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TestsPage extends RoleAwareComponent {
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
            answers: [],
            newAnswerModalTitle: ''
        };

        let arr = [];
        arr.push(localStorage.getItem('role'));
        this.userRoles = arr;
        this.allowedRoles = ['ROLE_PROFESSOR'];


        this.createTest = this.createTest.bind(this)
        this.cancel = this.cancel.bind(this)
        this.addQuestion = this.addQuestion.bind(this)
        this.questions = this.questions.bind(this)
    }

    componentDidMount() {
    }

    createTest() {
        let token = localStorage.getItem("loggedInUser")
        let AuthStr = 'Bearer '.concat(token);    
        let test = {
            title: this.state.testTitle,
            max_score: this.state.maxScore,
            questions: this.state.questions
        }
        axios({
            method: 'post',
            url: url + 'test',
            headers: { "Authorization": AuthStr } ,   
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
            answers: this.state.answers,
        }
        this.setState({ questionTitle: "", questionPoints: 0, hideNewQuestion: true, answers: [] })
        this.state.questions.push(question)
    }

    addAnswer() {
        let isCorrect = 0
        if (this.state.isCorrect) {
            isCorrect = 1
        }
        let answer = {
            title: this.state.answerTitle,
            isCorrect: isCorrect
        }
        this.state.answers.push(answer)
        this.setState({ isCorrect: false, answerTitle: "", hideNewAnswer: true })
    }

    questions(questions) {
        return (
            <CRow>
                {(this.state.questions).map((question, indexQ) =>
                    <CCol xs="4" sm="4" md="4" lg="3">
                        <CCard style={{margin: "10px" }}>
                            <CCardHeader style={{ padding: "3px" }}>
                                <h3>{indexQ + 1}. {question.title}
                                    <small className="card-header-actions">
                                        <CBadge shape="pill" color="primary" className="float-right">{question.points}</CBadge>
                                    </small>
                                </h3>
                            </CCardHeader>
                            <CCardBody>
                                {(question.answers).map((answer, indexA) =>
                                    <div style={{backgroundColor:"whitesmoke", margin: "5px" }}>
                                        <CRow hidden={answer.isCorrect === 0}>
                                        <CCol lg="10" md="10">
                                            <CLabel style={{ marginRight: "10px" }}>{indexA + 1}. {answer.title} </CLabel>
                                        </CCol>
                                        <CCol lg="2" md="2">
                                            <CIcon className="text-success" name="cil-check-circle"></CIcon>
                                            </CCol>
                                        </CRow>
                                        <CRow hidden={answer.isCorrect === 1} >
                                            <CCol lg="10" md="10">
                                            <CLabel frameBorder style={{ marginRight: "10px" }}>{indexA + 1}. {answer.title} </CLabel>
                                            </CCol>
                                            <CCol lg="2" md="2">
                                            <CIcon className="text-danger" name="cil-x-circle"></CIcon>
                                            </CCol>
                                        </CRow>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                )}
            </CRow>
        )
    }

    render() {
        let ret = (
            <div>
                <CModal
                    show={!this.state.hideNewAnswer}
                    onClose={() => this.setState({ hideNewAnswer: true, newAnswerModalTitle: '' })}
                    color="info"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>{this.state.newAnswerModalTitle}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormGroup row>

                            <CCol md="12">
                                <CLabel>Answer</CLabel>
                                <CInput type="text" value={this.state.answerTitle}
                                    onChange={event => this.setState({ answerTitle: event.target.value })} />
                            </CCol>
                            <CCol md="12">
                                <CFormGroup variant="checkbox" className="checkbox">
                                    <br></br>
                                    <CInputCheckbox
                                        id="isCorrect"
                                        name="isCorrect"
                                        value={this.state.isCorrect}
                                        checked={this.state.isCorrect}
                                        onChange={event => this.setState({ isCorrect: event.target.checked })}
                                    />
                                    <CLabel variant="checkbox" className="form-check-label" htmlFor="isCorrect">Is correct</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CRow style={{ margin: "10px" }}>

                            </CRow>
                        </CFormGroup>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => this.setState({ hideNewAnswer: true, answerTitle:'', isCorrect:false })}>Cancel</CButton>
                        <CButton color="info" onClick={() => this.addAnswer()}>Add answer</CButton>
                    </CModalFooter>
                </CModal>

                <CCol md="12" lg="12" xs="12">
                    <CRow>
                        <CCol md="4" lg="3" xs="4">
                            <CLabel style={{ marginRight: "10px" }}>Title</CLabel>
                            <CInput type="text" value={this.state.testTitle}
                                onChange={event => this.setState({ testTitle: event.target.value })} />
                        </CCol>
                        <CCol md="4" lg="3" xs="4">
                            <CLabel style={{ marginRight: "10px" }}>Score</CLabel>
                            <CInput type="number" value={this.state.maxScore} min="1"
                                onChange={event => this.setState({ maxScore: event.target.value })} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md="12" lg="12" xs="12">
                            {this.questions(this.state.questions)}
                        </CCol>
                    </CRow>
                    <CRow hidden={!this.state.hideNewQuestion}>
                        <CCol xs="12" sm="12" md="12">
                            <br></br>
                            <CButton variant='outline' color='success' style={{ height: "40px" }}
                                onClick={() => this.setState({ hideNewQuestion: false, newAnswerModalTitle: this.state.questionTitle })}>
                                Add question
                        </CButton>
                        </CCol>
                    </CRow>
                    <CRow hidden={this.state.hideNewQuestion}>
                        <CCol md="12" lg="12" xs="12">
                            <br></br>
                            <h3>{this.state.questions.length + 1}.</h3>
                            <CFormGroup row>
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
                                <CCol md="3">
                                    <br></br>
                                    <CButton hidden={!this.state.hideNewAnswer} style={{ marginTop: "7px" }} color="primary"
                                        onClick={() => this.setState({ hideNewAnswer: false, newAnswerModalTitle: this.state.questionTitle + ' - New Answer' })}>
                                        Add new answer
                                </CButton>
                                </CCol>
                            </CFormGroup>
                            <CCol xs="12" sm="12" md="3" lg="3" >
                                <h3>Answers:</h3>
                                {(this.state.answers).map((answer, indexA) =>
                                    <>
                                        <CRow className="text-success" hidden={answer.isCorrect === 0} style={{ backgroundColor: "white", margin: "5px" }}>
                                            <h4 >{indexA + 1}. {answer.title} </h4><CIcon style={{marginLeft:"10px"}} name="cil-check-circle"></CIcon>
                                        </CRow>
                                        <CRow className="text-danger" hidden={answer.isCorrect === 1} style={{ backgroundColor: "white", margin: "5px" }}>
                                            <h4> {indexA + 1}. {answer.title}</h4><CIcon style={{marginLeft:"10px"}} name="cil-x-circle"></CIcon>
                                        </CRow>
                                    </>
                                )}
                            </CCol>
                            <CCol xs="12" sm="12" md="12">
                                <br></br>
                                <CButton color='success' style={{ height: "40px" }} onClick={() => this.addQuestion()}>
                                    Save question
                            </CButton>
                            </CCol>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12" lg="3">
                            <br></br>
                            <CButton style={{ height: "40px" }} color='success' onClick={() => this.createTest()}>
                                Save test
                            </CButton>
                            <CButton style={{ marginLeft: "10px", height: "40px" }} color='danger' onClick={() => this.cancel()}>
                                Cancel
                            </CButton>
                        </CCol>
                    </CRow>
                </CCol>
            </div>
        );
        return this.rolesMatched() ? ret : <Redirect to="/tests" />;
    }
}

export default TestsPage;