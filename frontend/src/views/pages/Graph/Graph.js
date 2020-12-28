import * as React from 'react';

import {
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle, 
  CModalFooter,
  CFormGroup, 
  CLabel, 
  CInput,
  CFormText,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'

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
  GREEN_EDGE_TYPE
} from './graph-config'; // Configures node/edge types

import axios from 'axios'

import { RoleAwareComponent } from 'react-router-role-authorization'
import {Redirect} from 'react-router-dom'
import {NotificationManager} from 'react-notifications';

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';

export type IGraph = {
  nodes: INode[],
  edges: IEdge[],
};

// !!! NOTE: TO SOLVE ERRORS SEE - https://stackoverflow.com/questions/48852007/type-aliases-can-only-be-used-in-a-ts-file/51034421 !!!


// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
const sample: IGraph = {
  edges: [
    // {
    //   handleText: '5',
    //   handleTooltipText: '5',
    //   source: 'start1',
    //   target: 'a1',
    //   type: SPECIAL_EDGE_TYPE,
    // },
    // {
    //   handleText: '5',
    //   handleTooltipText: 'This edge connects Node A and Node B',
    //   source: 'a1',
    //   target: 'a2',
    //   type: SPECIAL_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a2',
    //   target: 'a4',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a1',
    //   target: 'a3',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a3',
    //   target: 'a4',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a1',
    //   target: 'a5',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a4',
    //   target: 'a1',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '54',
    //   source: 'a1',
    //   target: 'a6',
    //   type: EMPTY_EDGE_TYPE,
    // },
    // {
    //   handleText: '24',
    //   source: 'a1',
    //   target: 'a7',
    //   type: EMPTY_EDGE_TYPE,
    // },
  ],
  nodes: [
    // {
    //   id: 'start1',
    //   title: 'Start (0)',
    //   type: SPECIAL_TYPE,
    // },
    // {
    //   id: 'a1',
    //   title: 'Node A (1)',
    //   type: SPECIAL_TYPE,
    //   x: 258.3976135253906,
    //   y: 331.9783248901367,
    // },
    // {
    //   id: 'a2',
    //   subtype: SPECIAL_CHILD_SUBTYPE,
    //   title: 'Node B (2)',
    //   type: EMPTY_TYPE,
    //   x: 593.9393920898438,
    //   y: 260.6060791015625,
    // },
    // {
    //   id: 'a3',
    //   title: 'Node C (3)',
    //   type: EMPTY_TYPE,
    //   x: 237.5757598876953,
    //   y: 61.81818389892578,
    // },
    // {
    //   id: 'a4',
    //   title: 'Node D (4)',
    //   type: EMPTY_TYPE,
    //   x: 600.5757598876953,
    //   y: 600.81818389892578,
    // },
    // {
    //   id: 'a5',
    //   title: 'Node E (5)',
    //   type: null,
    //   x: 50.5757598876953,
    //   y: 500.81818389892578,
    // },
    // {
    //   id: 'a6',
    //   title: 'Node E (6)',
    //   type: SKINNY_TYPE,
    //   x: 300,
    //   y: 600,
    // },
    // {
    //   id: 'a7',
    //   title: 'Node F (7)',
    //   type: POLY_TYPE,
    //   x: 0,
    //   y: 300,
    // },
    // {
    //   id: 'a8',
    //   title: 'Node G (8)',
    //   type: COMPLEX_CIRCLE_TYPE,
    //   x: -200,
    //   y: 400,
    // },
  ],
};

function generateSample(totalNodes) {
  const generatedSample: IGraph = {
    edges: [],
    nodes: [],
  };
  let y = 0;
  let x = 0;

  const numNodes = totalNodes ? totalNodes : 0;

  // generate large array of nodes
  // These loops are fast enough. 1000 nodes = .45ms + .34ms
  // 2000 nodes = .86ms + .68ms
  // implying a linear relationship with number of nodes.
  for (let i = 1; i <= numNodes; i++) {
    if (i % 20 === 0) {
      y++;
      x = 0;
    } else {
      x++;
    }

    generatedSample.nodes.push({
      id: `a${i}`,
      title: `Node ${i}`,
      type: nodeTypes[Math.floor(nodeTypes.length * Math.random())],
      x: 0 + 200 * x,
      y: 0 + 200 * y,
    });
  }
  // link each node to another node
  for (let i = 1; i < numNodes; i++) {
    generatedSample.edges.push({
      source: `a${i}`,
      target: `a${i + 1}`,
      type: edgeTypes[Math.floor(edgeTypes.length * Math.random())],
    });
  }

  return generatedSample;
}

type IGraphProps = {};

type IGraphState = {
  graph: any,
  selected: any,
  totalNodes: number,
  copiedNode: any,
  layoutEngineType?: LayoutEngineType,
};

class Graph extends React.Component<IGraphProps, IGraphState> {
  GraphView;

  constructor(props: IGraphProps) {
    super(props);

    this.state = {
      copiedNode: null,
      graph: sample,
      layoutEngineType: undefined,
      selected: null,
      totalNodes: sample.nodes.length,
      problems: [],
      showModal: false,
      title: '',
      errorTitle: '',
      buttonDisabled: true,
      knowledgeSpaceTitle: '',
      knowledgeSpaceTestId: null,
      testQuestions: [],
      question_id: 1,
      knowledgeSpace: {
        "test_id": null,
        "problems": [],
        "edges": []
      },
      realKnowledgeSpace: {
        "test_id": null,
        "problems": [],
        "edges": []
      },
      currentTab: 'expected'
    };

    let arr = [];
    arr.push(localStorage.getItem('role'));
    this.userRoles = arr;
    this.allowedRoles = ['ROLE_PROFESSOR'];

    this.GraphView = React.createRef();
    this.knowledgeSpace = this.getKnowledgeSpace.bind(this);
    this.addProblem = this.addProblem.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.validateTitle = this.validateTitle.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.createGraph = this.createGraph.bind(this)
    this.saveGraph = this.saveGraph.bind(this)
    this.saveEdge = this.saveEdge.bind(this)
    this.testQuestions = this.getTestQuestions.bind(this)
    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.compareGraphs = this.compareGraphs.bind(this)
    this.generateReal = this.generateReal.bind(this)
  }

  componentDidMount(){
    this.getKnowledgeSpace()
  }

handleDropDown(e){
  console.log("OPCIJA" + e.target.value)
    this.setState({question_id: e.target.value})
}

saveGraph(graph){
  const { id } = this.props.match.params;
  let data = {
    "id": id,
    "graph": graph
  }
  axios({
    method: 'put',
    url: url + 'knowledge_space',
    //headers: { "Authorization": AuthStr } ,   
    data: data
}).then((response) => {
    this.setState({ knowledgeSpaces: response.data })
    this.createGraph(response.data)
    
}, (error) => {
    console.log(error);
});
}

getKnowledgeSpace(){
  const { id } = this.props.match.params;
  axios({
    method: 'get',
    url: url + 'knowledge_space/' + id,
  }).then((response) => {
    this.setState({knowledgeSpaceTitle: response.data.expected.title}, () => console.log(this.state.knowledgeSpaceTitle))
    this.setState({knowledgeSpace: response.data.expected, realKnowledgeSpace:response.data.real})
    this.createGraph(response.data.expected)
    axios.get(url + 'testquestions/' + response.data.expected.test_id)
        .then((resp) => {
          this.setState({testQuestions: resp.data}, () => console.log(this.state.testQuestions))
        })

  }, (error) => {
    console.log(error);
  });
}

getTestQuestions() {
  console.log(this.state)
  axios.get(url + 'testquestions/' + this.state.knowledgeSpaceTestId)
        .then((resp) => {
          this.setState({testQuestions: resp.data}, () => console.log(this.state.testQuestions))
        })
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
    node = {
      id: knowledgeSpace.problems[i].id,
      title: knowledgeSpace.problems[i].title,
      type: EMPTY_TYPE,
      x: knowledgeSpace.problems[i].x,
      y: knowledgeSpace.problems[i].y,
    }
    nodes.push(node)
  }

  const temp: IGraph = {
    edges: edges,
    nodes: nodes
  };
  this.setState({graph:temp})
}

  addProblem(){
    const { id } = this.props.match.params;
    let data = {
      "title": this.state.title,
      "question_id": this.state.question_id,
      "knowledge_space_id": id,
      "x": 20.0,
      "y": 20.0
  }
  axios({
      method: 'post',
      url: url + 'problem',
      //headers: { "Authorization": AuthStr } ,   
      data: data
  }).then((response) => {
      this.getKnowledgeSpace()
      this.resetAll()
  }, (error) => {
      console.log(error);
  });
  }

  saveEdge(edge){
    if (this.state.currentTab === 'expected'){
      const { id } = this.props.match.params;
      let data = {
        "knowledge_space_id": id,
        "lower_id" : edge.source,
        "upper_id": edge.target  
      }
      axios({
        method: 'post',
        url: url + 'edge',
        //headers: { "Authorization": AuthStr } ,   
        data: data
    }).then((response) => {
        this.getKnowledgeSpace()
        return true
    }, (error) => {
        console.log(error);
        return false
    });
    }
  }


  resetAll(){
    this.setState({showModal:false, buttonDisabled:true, title:'', errorTitle:''})
  }

  handleChangeTitle = e =>{
    e.preventDefault();
    this.setState({title: e.target.value})
    this.validateTitle(e.target.value)
  }

  validateTitle(title){
    title = title.trim()
    if(title === ''){
        this.setState({errorTitle: 'Title can not be empty', buttonDisabled:true})
    }
    else{
        this.setState({errorTitle: '', buttonDisabled: false})
    }
  }


  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex(edge => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  }

  // Given a nodeKey, return the corresponding node
  getViewNode(nodeKey: string) {
    const searchNode = {};

    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);

    return this.state.graph.nodes[i];
  }

  makeItLarge = () => {
    const graph = this.state.graph;
    const generatedSample = generateSample(this.state.totalNodes);

    graph.nodes = generatedSample.nodes;
    graph.edges = generatedSample.edges;
    this.setState(this.state);
  };

  addStartNode = () => {
      if (this.state.currentTab === 'expected' ){
        const graph = this.state.graph;
      // using a new array like this creates a new memory reference
      // this will force a re-render
      graph.nodes = [
        {
          id: Date.now(),
          title: 'Node A',
          type: SPECIAL_TYPE,
          x: 0,
          y: 0,
        },
        ...this.state.graph.nodes,
      ];
      this.setState({
        graph,
      });
      this.saveGraph(graph)
    }
  };
  deleteStartNode = () => {
    if (this.state.currentTab === 'expected' ){
    const graph = this.state.graph;

    graph.nodes.splice(0, 1);
    // using a new array like this creates a new memory reference
    // this will force a re-render
    graph.nodes = [...this.state.graph.nodes];
    this.setState({
      graph,
    });
    this.saveGraph(graph)
    }
  };

  handleChange = (event: any) => {
    this.setState(
      {
        totalNodes: parseInt(event.target.value || '0', 10),
      },
      this.makeItLarge
    );
  };

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode: INode) => {
    if (this.state.currentTab === 'expected' ){


    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph });
    this.saveGraph(graph)
    }
  };

  // Node 'mouseUp' handler
  onSelectNode = (viewNode: INode | null) => {
    // Deselect events will send Null viewNode
    this.setState({ selected: viewNode });
  };

  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge: IEdge) => {
    this.setState({ selected: viewEdge });
  };

  // Updates the graph with a new node
  onCreateNode = (x: number, y: number) => {
          if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;

    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;

    const viewNode = {
      id: Date.now(),
      title: '',
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, viewNode];
    this.setState({ graph });
    this.saveGraph(graph)
          }
  };

  // Deletes a node from the graph
  onDeleteNode = (viewNode: INode, nodeId: string, nodeArr: INode[]) => {
          if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;
    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return (
        edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
      );
    });

    graph.nodes = nodeArr;
    graph.edges = newEdges;

    this.setState({ graph, selected: null });
    this.saveGraph(graph)
          }
  };

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
          if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;
    // This is just an example - any sort of logic
    // could be used here to determine edge type
    const type =
      sourceViewNode.type === SPECIAL_TYPE
        ? SPECIAL_EDGE_TYPE
        : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type,
    };

    if (this.saveEdge(viewEdge)) {
      // Only add the edge when the source node is not the same as the target
      if (viewEdge.source !== viewEdge.target) {
        graph.edges = [...graph.edges, viewEdge];
        this.setState({
          graph,
          selected: viewEdge,
        });
      }
    }
          }
  };

  // Called when an edge is reattached to a different target.
  onSwapEdge = (
    sourceViewNode: INode,
    targetViewNode: INode,
    viewEdge: IEdge
  ) => {
          if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge,
    });
    this.saveGraph(graph)
          }
  };

  // Called when an edge is deleted
  onDeleteEdge = (viewEdge: IEdge, edges: IEdge[]) => {
          if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;

    graph.edges = edges;
    this.setState({
      graph,
      selected: null,
    });
    this.saveGraph(graph)
          }
  };

  onUndo = () => {
    // Not implemented
    console.warn('Undo is not currently implemented in the example.');
    // Normally any add, remove, or update would record the action in an array.
    // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
    // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
    // into the edges array at position i.
  };

  onCopySelected = () => {
    if (this.state.selected.source) {
      console.warn('Cannot copy selected edges, try selecting a node instead.');

      return;
    }

    const x = this.state.selected.x + 10;
    const y = this.state.selected.y + 10;

    this.setState({
      copiedNode: { ...this.state.selected, x, y },
    });
  };

  // Pastes the selected node to mouse position
  onPasteSelected = (node: INode, mousePosition?: [number, number]) => {
              if (this.state.currentTab === 'expected' ){

    const graph = this.state.graph;

    const newNode = {
      ...node,
      id: Date.now(),
      x: mousePosition ? mousePosition[0] : node.x,
      y: mousePosition ? mousePosition[1] : node.y,
    };

    graph.nodes = [...graph.nodes, newNode];
    this.forceUpdate();
    this.saveGraph(graph)
              }
  };

  handleChangeLayoutEngineType = (event: any) => {
    this.setState({
      layoutEngineType: (event.target.value: LayoutEngineType | 'None'),
    });
  };

  onSelectPanNode = (event: any) => {
    if (this.GraphView) {
      this.GraphView.panToNode(event.target.value, true);
    }
  };

  /*
   * Render
   */

  handleTabChange(tab){
    this.setState({currentTab: tab})
    if (tab == 'expected'){
      this.createGraph(this.state.knowledgeSpace)
    }
    else if (tab == 'real'){
      this.createGraph(this.state.realKnowledgeSpace)
    }
    else{
      this.compareGraphs()
    }
  }

  compareGraphs(){
    const { id } = this.props.match.params;
    let knowledgeSpace = {}
    axios({
      method: 'get',
      url: url + 'compare/' + id,
    }).then((response) => {
      knowledgeSpace = response.data
       let edges = []
    let nodes = []
    let edge = {}
    let node = {}
    var i
    for (i in knowledgeSpace.edges) {
      let t = EMPTY_EDGE_TYPE
      if (knowledgeSpace.edges[i].color === 'red'){
        t = RED_EDGE_TYPE
      }
      else if(knowledgeSpace.edges[i].color === 'green'){
        t = GREEN_EDGE_TYPE
      }
      edge = {
        id: knowledgeSpace.edges[i].id,
        source: knowledgeSpace.edges[i].lower_id,
        target: knowledgeSpace.edges[i].higher_id,
        type: t
      }
      edges.push(edge)
    } 
    for (i in knowledgeSpace.problems){
      node = {
        id: knowledgeSpace.problems[i].id,
        title: knowledgeSpace.problems[i].title,
        type: EMPTY_TYPE,
        x: knowledgeSpace.problems[i].x,
        y: knowledgeSpace.problems[i].y,
      }
      nodes.push(node)
    }

    const temp: IGraph = {
      edges: edges,
      nodes: nodes
    };
    this.setState({graph:temp})
    }, (error) => {
      console.log(error);
    }); 

  }

  generateReal(){
  const { id } = this.props.match.params;
    axios({
      method: 'put',
      url: url + 'knowledge_space/generateReal/' + id,
      //headers: { "Authorization": AuthStr } ,   
  }).then((response) => {
      this.setState({ realKnowledgeSpace: response.data })
      this.createGraph(response.data)
      NotificationManager.success('Real knowledge space successfuly generated', 'Success!', 4000);
  }, (error) => {
      console.log(error);
  });
  }

  render() {
    const { nodes, edges } = this.state.graph;
    const selected = this.state.selected;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    const testQuestions = this.state.testQuestions;
    const question_id = null; 

    let ret = (
      <>
            <CCol xs="12" lg="12">
        <div className="graph-header">
            <h2>{this.state.knowledgeSpaceTitle}
            <CButton hidden={this.state.currentTab !== 'expected'} style={{float:"right"}} id="confirmButton" onClick={() => this.setState({showModal:true})} color="success" className="px-4">New problem</CButton>
            <CButton hidden={this.state.currentTab !== 'real'} style={{float:"right"}} id="confirmButton" onClick={() => this.generateReal()} color="success" className="px-4">Generate</CButton>
            </h2>
            <CModal 
              show={this.state.showModal} 
              onClose={() => this.resetAll()}
            >
              <CModalHeader closeButton>
                <CModalTitle>New problem</CModalTitle>
              </CModalHeader>
              <CModalBody>
              <CFormGroup>
                      <CLabel htmlFor="problemTitle">Problem title</CLabel>
                      <CInput type="text"
                        id="problemTitle"
                        name="problemTitle"
                        onChange={this.handleChangeTitle}
                        value={this.state.title}
                        placeholder="Title"
                      />
                    <CFormText className="help-block"><p style={{ color: "red" }}>{this.state.errorTitle}</p></CFormText>
              </CFormGroup>
              <CFormGroup>
                      <CLabel htmlFor="problemTitle">Question</CLabel>
                      <select
                        value={this.state.question_id}
                        onChange={this.handleDropDown}
                      >
                        <option disabled selected> -- select an option -- </option>
                        {
                            testQuestions.map(function (item) {
                                if (item.problem_id === '') {
                                  return <option value={item.id}>{item.title}</option>;
                                }
                            })
                        }
                    </select>
                    <CFormText className="help-block"><p style={{ color: "red" }}>{this.state.errorTitle}</p></CFormText>
              </CFormGroup>
              </CModalBody>
              <CModalFooter>
                <CButton disabled={this.state.buttonDisabled} color="success" onClick={() => this.addProblem()}>Add problem</CButton>{' '}
                <CButton color="danger" onClick={() => this.resetAll()}>Cancel</CButton>
              </CModalFooter>
            </CModal>
          {/* <button onClick={this.addStartNode}>Add Node</button>
          <button onClick={this.deleteStartNode}>Delete Node</button>
          <input
            className="total-nodes"
            type="number"
            onBlur={this.handleChange}
            placeholder={this.state.totalNodes.toString()}
          />
          <div className="layout-engine">
            <span>Layout Engine:</span>
            <select
              name="layout-engine-type"
              onChange={this.handleChangeLayoutEngineType}
            >
              <option value={undefined}>None</option>
              <option value={'SnapToGrid'}>Snap to Grid</option>
              <option value={'VerticalTree'}>Vertical Tree</option>
            </select>
          </div>
          <div className="pan-list">
            <span>Pan To:</span>
            <select onChange={this.onSelectPanNode}>
              {nodes.map(node => (
                <option key={node[NODE_KEY]} value={node[NODE_KEY]}>
                  {node.title}
                </option>
              ))}
            </select>
          </div> */}
        </div>
        <CCard>
          <CCardBody>
            <CTabs activeTab="expected">
              <CNav variant="tabs">
                <CNavItem onClick={() => this.handleTabChange('expected')}>
                  <CNavLink data-tab="expected">
                    Expected
                  </CNavLink>
                </CNavItem>
                <CNavItem onClick={() => this.handleTabChange('real')}>
                  <CNavLink data-tab="real">
                    Real
                  </CNavLink>
                </CNavItem>
                <CNavItem onClick={() => this.handleTabChange('compare')}>
                  <CNavLink data-tab="compare">
                    Compare
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane data-tab="expected">
                </CTabPane>
                <CTabPane data-tab="real">
                </CTabPane>
                <CTabPane data-tab="compare">
                </CTabPane>
              </CTabContent>
            </CTabs>
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
      </>
    );
    return ret;
  }
}

export default Graph;