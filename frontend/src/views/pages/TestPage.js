import React, { Component } from 'react';
import axios from 'axios';

import {
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CLabel,
  CInput,
  CButton,
  CCollapse,
  CContainer,
  CCol,
  CDataTable,
  CFade,
  CLink,
  CFormGroup,
  CInputCheckbox
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

const fields = ['Question','Answer', 'Checked', 'Correct answer', 'Score']

class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: {
        title: "",
        test_questions: [{
            title:"",
            test_question_answers:[]
        }]
    },
      testTake: {
          title: "",
          test_questions: [{
              title:"",
              test_question_answers:[]
          }]
      },
    };

    this.getTestTakeAnswer = this.getTestTake.bind(this)
    this.getChecked = this.getChecked.bind(this)
  }

  componentDidMount() {
    this.getTestTake()
  }


  getTestTake(){
    const { id } = this.props.match.params;
    axios({
      method: 'get',
      url: url + 'test_take/' + id,
    }).then((response) => {
      this.setState({ testTake: response.data.test_take, test:response.data.test })
    }, (error) => {
      console.log(error);
    });
  }

  getChecked(question, answer){
    var find = this.state.testTake.test_take_answers.filter(function(result) {
      return result.test_question_id === question && result.test_question_answer_id === answer;
    });
    
    return find[0].selected;
  }

  render() {
    return (
      <div>
        <CCardHeader style={{backgroundColor:"whitesmoke"}}>
            <h2>{this.state.test.title}</h2>
        </CCardHeader>
          <table responsive style={{border:"1px solid black", width: "100%", backgroundColor:"whitesmoke"}}>
          <thead style={{textAlign:"center"}}>
            <th><h3>Question</h3></th>            
            <th><h3>Answer</h3></th>
            <th><h3>Checked</h3></th>
            <th><h3>Correct answer</h3></th>
            <th ><h3>Score</h3></th>
          </thead>
          <tbody>
          {(this.state.test.test_questions).map((question, index) =>
          <>
                  <tr style={{borderTop:"2px solid black"}}>
                    <td><h4>{index + 1}. {question.title}</h4></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{textAlign:"center"}}>7</td>
                  </tr>
                  <>
                  {(question.test_question_answers).map((answer, indexA) =>
                          <tr >
                          <td></td>
                          <td style={{textAlign:"center"}} >{indexA}. {answer.title}</td>
                          <td style={{textAlign:"center"}}> <input type="checkbox" checked={this.getChecked(question.id, answer.id)}></input></td>
                          <td style={{textAlign:"center"}}> <input type="checkbox" checked={answer.isCorrect}></input></td>
                          <td style={{textAlign:"center"}}>1</td>
                        </tr>
                        )}
                        </>
                  </>
                )}
                <tr style={{borderTop:"2px solid black"}}>
                    <td><h4>Total score</h4></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{textAlign:"center"}}>4/{this.state.test.max_score}</td>
                  </tr>
                </tbody>
            </table>

      </div>
    );
  }
}

export default TestPage;