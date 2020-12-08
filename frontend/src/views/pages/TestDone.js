import React, { Component } from 'react';
import axios from 'axios';
import { Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText } from 'react-sidebar-ui'
import {Button, Card, CardBody, CardHeader, Row, Table, Col } from 'reactstrap';

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

class TestsPage extends Component {
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
      <div style={{ backgroundColor: "whiteSmoke" }}>
        <CardHeader>
            <h2>{this.state.test.title}</h2>
        </CardHeader>
          <Table responsive style={{border:"1px solid black", width: "100%"}}>
          <thead >
            <th >Question</th>            
            <th>Answer</th>
            <th>Checkhed</th>
            <th >Correct answer</th>
            <th >Score</th>
          </thead>
          <tbody>
          {(this.state.test.test_questions).map((question, index) =>
          <div>
                  <tr>
                    <td><h3>{index}. {question.title}</h3></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>7</td>
                  </tr>
                  {(question.test_question_answers).map((answer, indexA) =>
                          <tr>
                          <td></td>
                          <td >{indexA}. {answer.title}</td>
                          <td> <input type="checkbox" checked={this.getChecked(question.id, answer.id)}></input></td>
                          <td> <input type="checkbox" checked={answer.isCorrect}></input></td>
                          <td>1</td>
                        </tr>
                        )}
                  </div>
                )}
                </tbody>
            </Table>
      </div>
    );
  }
}

export default TestsPage;