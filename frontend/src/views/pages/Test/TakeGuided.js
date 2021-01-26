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
  CFade,
  CLink,
  CFormGroup,
  CInputCheckbox
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { RoleAwareComponent } from 'react-router-role-authorization'
import {Redirect} from 'react-router-dom'
import {NotificationManager} from 'react-notifications';
import {
  GraphView,
  IEdge,
  Node,
  LayoutEngineType,
} from 'react-digraph';
import GraphConfig, {
  edgeTypes,
  EMPTY_EDGE_TYPE,
  EMPTY_TYPE,
  NODE_KEY,
  nodeTypes,
  COMPLEX_CIRCLE_TYPE,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
  RED_EDGE_TYPE,
  GREEN_EDGE_TYPE,
  GREEN_TYPE
} from '../Graph/graph-config'; // Configures node/edge types

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

export type IGraph = {
  nodes: INode[],
  edges: IEdge[],
};

type IGraphProps = {};

type IGraphState = {
  graph: any,
  selected: any,
  totalNodes: number,
  copiedNode: any,
  layoutEngineType?: LayoutEngineType,
};

const sample: IGraph = {
  edges:[],
  nodes:[]
}

class TakeGuided extends React.Component<IGraphProps, IGraphState> {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        test_question_answers:[],
        title: ''
      },
      question_number: 0,
      test_title: '',
      finished: false,
      graph: sample,
      selected: null,
      state_id:1
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_STUDENT'];


    this.getTest = this.getTest.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.submitAnswers = this.submitAnswers.bind(this)
    this.createGraph = this.createGraph.bind(this)
  }

  componentDidMount() {
    this.getTest()
  }

  getTest() {
    const { id } = this.props.match.params;
    axios({
      method: 'get',
      url: url + 'tests/take_guided/' + id,
    }).then((response) => {
      if (response.data.finished){
        this.setState({finished: true, test_title:response.data.test_title, state_id:response.data.state})
        this.createGraph(response.data.knowledge_space)
      }
      else{
      this.setState({ question: response.data.question, test_title: response.data.test_title, question_number:response.data.question_number})
      }
    }, (error) => {
      this.props.history.push("/tests/takeTest/" + id)
      console.log(error);
    });
  }

  createGraph(knowledgeSpace){
    let edges = []
    let nodes = []
    let edge = {}
    let node = {}
    var i
    for (i in knowledgeSpace.edges) {
      edge = {
        id: knowledgeSpace.edges[i].id,
        source: knowledgeSpace.edges[i].lower_id,
        target: knowledgeSpace.edges[i].higher_id,
        type: EMPTY_EDGE_TYPE
      }
      edges.push(edge)
    } 
    for (i in knowledgeSpace.problems){
      if (knowledgeSpace.problems[i].id == this.state.state_id){
        node = {
          id: knowledgeSpace.problems[i].id,
          title: knowledgeSpace.problems[i].title,
          type: GREEN_TYPE,
          x: knowledgeSpace.problems[i].x,
          y: knowledgeSpace.problems[i].y,
        }
      }
      else{
      node = {
        id: knowledgeSpace.problems[i].id,
        title: knowledgeSpace.problems[i].title,
        type: EMPTY_TYPE,
        x: knowledgeSpace.problems[i].x,
        y: knowledgeSpace.problems[i].y,
      }
    }
      nodes.push(node)
    }
  
    const temp: IGraph = {
      edges: edges,
      nodes: nodes
    };
    this.setState({graph:temp})
  }

  handleChange(answer) {
    let temp = this.state.question
    temp.test_question_answers[answer].isCorrect = !temp.test_question_answers[answer].isCorrect
    this.setState({ question: temp })
  }

  submitAnswers() {
    const { id } = this.props.match.params;
    let data = {
      question: this.state.question,
      question_number: this.state.question_number
    }
    let token = localStorage.getItem("loggedInUser")
    let AuthStr = 'Bearer '.concat(token);       
    axios({
      method: 'post',
      url: url + 'tests/take_guided/' + id,
      headers: { "Authorization": AuthStr } ,   
      data: data
    }).then((response) => {
        if (response.data.finished){
          this.setState({finished: true, test_title:response.data.test_title, state_id:response.data.state})
          this.createGraph(response.data.knowledge_space)
        }
        else{
          this.setState({ question: response.data.question, test_title: response.data.test_title, question_number:response.data.question_number})
        }
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    const question = this.state.question;
    const num = this.state.question_number;
    const { nodes, edges } = this.state.graph;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    const selected = this.state.selected;

    let ret = (
      <div>
        <CCol xl="12" lg="12" md="12" sm="12">
          <CCard>
            <CCardHeader>
              <h1>{this.state.test_title}</h1>
            </CCardHeader>
            <CCardBody hidden={this.state.finished}>
              <div id="accordion">
                  <CCard>
                  <CCardHeader>
                  <h5 className="m-0 p-0">{num}. {question.title}</h5>
                    </CCardHeader>
                      <CCardBody>
                        {(question.test_question_answers).map((answer, indexA) =>

                          <CFormGroup variant="checkbox" className="checkbox">
                            <br></br>
                            <CInputCheckbox
                              id="isCorrect"
                              name="isCorrect"
                              value={answer.isCorrect}
                              checked={answer.isCorrect}
                              onChange={event => this.handleChange(indexA)}
                            />
                            <CLabel variant="checkbox" className="form-check-label" htmlFor="isCorrect">{indexA + 1}. {answer.title}</CLabel>
                          </CFormGroup>
                        )}
                      </CCardBody>
                  </CCard>
              </div>
            </CCardBody>
            <CCardFooter hidden={this.state.finished}>
              <CButton color="success" style={{ marginLeft: "10px", height: "40px" }} onClick={event => this.submitAnswers()}>Submit</CButton>
            </CCardFooter>
          </CCard>
          <CCard hidden={!this.state.finished}>
            <CCardBody>
            <div id="graph" style={{ height:"700px" }}>
            <GraphView
            ref={el => (this.GraphView = el)}
            nodeKey={NODE_KEY}
            nodes={nodes}
            edges={edges}
            selected={selected}
            nodeTypes={NodeTypes}
            nodeSubtypes={NodeSubtypes}
            edgeTypes={EdgeTypes}
            onSelectNode={this.onSelectNode}
            onCreateNode={this.onCreateNode}
            onUpdateNode={this.onUpdateNode}
            onDeleteNode={this.onDeleteNode}
            onSelectEdge={this.onSelectEdge}
            onCreateEdge={this.onCreateEdge}
            onSwapEdge={this.onSwapEdge}
            onDeleteEdge={this.onDeleteEdge}
            onUndo={this.onUndo}
            onCopySelected={this.onCopySelected}
            onPasteSelected={this.onPasteSelected}
            layoutEngineType={this.state.layoutEngineType}
          />
          </div>
            </CCardBody>
          </CCard>
        </CCol>
      </div>
    );
    return ret;
  }
}

export default TakeGuided;