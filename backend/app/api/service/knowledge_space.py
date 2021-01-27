import numpy as np
import sys
import pandas as pd

from app import app
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test_question import TestQuestion
from app.api.models.problem_edge import KnowledgeSpace, Problem, Edge
from flask import request
from flask_restful import Resource

sys.path.append('learning_spaces/')
from learning_spaces.kst import iita

import networkx as nx

# data_frame = pd.DataFrame({'a': [1, 0, 1], 'b': [0, 1, 0], 'c': [0, 1, 1]})
# response = iita(data_frame, v=1)
# print(response)
# {'diff': array([ 0.18518519,  0.16666667,  0.21296296]), 'implications': [(0, 1), (0, 2), (2, 0), (2, 1)], 'error.rate': 0.5, 'selection.set.index': 1, 'v': 1}


class GenerateRealKnowledgeSpace(Resource):
    def put(self, ks_id):
        knowledge_space = KnowledgeSpace.query.get(int(ks_id))
        test = TestModel.query.get(int(knowledge_space.test_id))
        #if len(test.test_takes) > 1:
        if knowledge_space.title == "Algebra":
            ma = pd.read_csv("app/data/pisa.txt", sep='\s+')
            m = ma.values
        elif knowledge_space.title == "Programiranje":
            ma = pd.read_csv("app/data/test_data.csv")
            m = ma.values
        elif len(test.test_takes) > 1:
            m = generate_matrix(test)
        else:
            return None

        response = iita(m, v=2)
        # print(response)
        ks_real, ks_all = create_graph(test, response['implications'])
        ret = {
            "ks_real": ks_real,
            "ks_all": ks_all
        }
        return ret



def generate_matrix(test):
    n = len(test.test_questions)
    m = len(test.test_takes)
    ret = np.ndarray(shape=(m, n), dtype=int)

    for i in range(m):
        for j in range(n):
            test_take_answers = TestTakeAnswer.query.filter_by(test_take_id=test.test_takes[i].id,
                                                               test_question_id=test.test_questions[j].id).all()
            test_question_answer = TestQuestionAnswer.query.filter_by(question_id=test.test_questions[j].id).all()
            ret[i][j] = is_correct(test_question_answer, test_take_answers)
    return ret


def is_correct(correct_answers, student_answers):
    correct_answers = sorted(correct_answers, key=lambda answer: answer.id)
    student_answers = sorted(student_answers, key=lambda answer: answer.test_question_answer_id)
    for i in range(len(correct_answers)):
        if correct_answers[i].isCorrect != student_answers[i].selected:
            return 0
    return 1


def create_graph(test, implications):
    ks_expected = KnowledgeSpace.query.filter_by(test_id=test.id, is_real=False, is_all_states=False).first()
    title = ks_expected.title + ' - Real Knowledge Space'
    ks = KnowledgeSpace.query.filter_by(title=title).first()
    if ks is not None:
        for edge in ks.edges:
            edge.delete()
        for problem in ks.problems:
            problem.delete()
        ks.delete()
    ks = KnowledgeSpace(ks_expected.title + ' - Real Knowledge Space', test.id, True, course_id=ks_expected.course_id)
    ks.insert()

    questions = test.test_questions
    questions = sorted(questions, key=lambda question: question.id)
    n = len(questions)
    mat = np.full((n, n), 0, dtype=int)
    arr = np.full((n, 2), 0, dtype=int)
    arr[:, 0] = range(n)

    for implication in implications:
        if mat[implication[1]][implication[0]]:
            mat[implication[1]][implication[0]] = 0
            arr[implication[1], 1] = arr[implication[1], 1] - 1
        else:
            mat[implication[0]][implication[1]] = 1
            arr[implication[1], 1] = arr[implication[1], 1] + 1

    arr = sorted(arr, key=lambda a: a[1])
    prev = -1
    x = -300
    y = 0
    for i in range(n):
        if arr[i][1] == prev:
            y = y - 300
        else:
            y = 0
            x = x + 300
        prev = arr[i][1]
        question = questions[arr[i][0]]
        p = Problem(question.title, ks.id, x, y, question.id)
        p.insert()
        upper_node = p
        for j in range(n - 1, -1, -1):
            if mat[arr[j][0], arr[i][0]] == 1:
                lower_node = Problem.query.filter_by(knowledge_space_id=ks.id, test_question_id=questions[j].id).first()

                ok = not bfs(p, lower_node)
                if ok:
                    new_edge = Edge(lower_node, upper_node, ks.id)
                    new_edge.insert()
        # arr - prva kolona indeksi sortiranih pitanja, druga kolona broj pitanja koja zavise od njih

    title_all = ks_expected.title + " - All states"
    ks_all = KnowledgeSpace.query.filter_by(test_id=ks.test_id, is_all_states=True).first()
    if ks_all is not None:
        for edge in ks_all.edges:
            edge.delete()
        for problem in ks_all.problems:
            problem.delete()
        ks_all.delete()

    ks_all = KnowledgeSpace(title_all, ks_expected.test_id, False, ks_expected.course_id, is_all_states=True)
    ks_all.insert()
    initial_state = Problem(" ", knowledge_space_id=ks_all.id, x=0, y=0, test_question_id=None)
    initial_state.insert()

    curr_list = ks_all.problems
    problems = ks_all.problems
    all_ids = dict()
    x = 0
    while len(problems) > 0:
        y = 0
        x = x + 300
        problems = curr_list
        curr_list = []
        for i in range(n):
            question = questions[arr[i][0]]
            p = Problem.query.filter_by(test_question_id=question.id, knowledge_space_id=ks.id).first()
            depends_on = []

            for j in range(n):
                if mat[j][i] == 1:
                    depends_on.append(questions[arr[j][0]])
            # drugi nacin
            # for e in p.upper_edges:
            #     q = TestQuestion.query.filter_by(problem = e.lower_node).first()
            #     depends_on.append(q)
            if p.title == 'c':
                pomocna = True

            for problem in problems:
                if arr[i][1] == 0 or all(item in problem.questions for item in depends_on):
                    l1 = [o.id for o in problem.questions]
                    l1.append(question.id)
                    l1.sort()
                    key = find_key(all_ids, l1)
                    if not any(t.id == question.id for t in problem.questions):
                        if key == -1:
                            if problem.title != " ":
                                problem_title = problem.title + ", " + p.title
                            else:
                                problem_title = p.title
                            new_problem = Problem(title=problem_title, knowledge_space_id=ks_all.id, x = x, y = y, test_question_id=None)
                            new_problem.insert()
                            y = y - 300
                            new_edge = Edge(knowledge_space_id=ks_all.id, n1=problem, n2=new_problem)
                            new_edge.insert()
                            all_ids[new_problem.id] = l1
                            question.problems.append(new_problem)
                            question.insert()
                            curr_list.append(new_problem)
                            for q in problem.questions:
                                q.problems.append(new_problem)
                                q.insert()
                            # if len(new_problem.questions) == n:
                            #     new_problem.title = "Q"
                            #     new_problem.update()
                        else:
                            old_problem = Problem.query.get(key)
                            new_edge = Edge(knowledge_space_id=ks_all.id, n1=problem, n2=old_problem)
                            new_edge.insert()

    return ks.json_format(), ks_all.json_format()


def find_key(map_index, l):
    for key, value in map_index.items():
        if l == value:
            return key
    return -1


def bfs(curr, lower_node):
    if lower_node is None:
        return True

    # Mark all the vertices as not visited
    visited = [curr.id]

    # Create a queue for BFS
    queue = [curr]

    # Mark the source node as 
    # visited and enqueue it
    # visited.append(curr.id)

    while queue:

        s = queue.pop(0)
        node = Problem.query.filter_by(id=s.id).first()

        for edge_id in node.json_format()['lower_edge_ids']:
            if edge_id not in visited:
                if edge_id == lower_node.id:
                    return True
                problem = Problem.query.filter_by(id=edge_id).first()
                queue.append(problem)
                visited.append(edge_id)
    return False


class CompareKnowledgeSpace(Resource):
    def get(self, ks_id):
        knowledge_space = KnowledgeSpace.query.get(int(ks_id))
        real = KnowledgeSpace.query.filter_by(test_id=knowledge_space.test_id, is_real=True).first()
        if real is not None:
            real_edges = real.edges
            expected_edges = knowledge_space.edges.copy()

            edges = []
            for edge in real_edges:
                index = contains_edge(edge, expected_edges)
                if index != -1:
                    expected_edges.pop(index)
                    e = {
                        "id": edge.id,
                        "lower_id": edge.lower_id,
                        "higher_id": edge.higher_id,
                        "color": "blue"
                    }
                else:
                    e = {
                        "id": edge.id,
                        "lower_id": edge.lower_id,
                        "higher_id": edge.higher_id,
                        "color": "green"
                    }
                edges.append(e)
            for edge in expected_edges:
                h_n = Problem.query.filter_by(id=edge.higher_id).first()
                l_n = Problem.query.filter_by(id=edge.lower_id).first()
                higher_node = Problem.query.filter_by(knowledge_space_id=real.id,
                                                      test_question_id=h_n.test_question_id).first()
                lower_node = Problem.query.filter_by(knowledge_space_id=real.id,
                                                     test_question_id=l_n.test_question_id).first()
                e = {
                    "id": edge.id,
                    "lower_id": lower_node.id,
                    "higher_id": higher_node.id,
                    "color": "red"
                }
                edges.append(e)

            ret = {
                "test_id": real.test_id,
                "problems": [problem.json_format() for problem in real.problems],
                "edges": edges
            }
            return ret, 200
        return 'real knowledge space not found', 404



def contains_edge(edge, edges):
    h_n = Problem.query.filter_by(id=edge.higher_id).first()
    l_n = Problem.query.filter_by(id=edge.lower_id).first()
    for i in range(len(edges)):
        higher_node = Problem.query.filter_by(id=edges[i].higher_id).first()
        lower_node = Problem.query.filter_by(id=edges[i].lower_id).first()
        if (
                h_n.test_question_id == higher_node.test_question_id and
                l_n.test_question_id == lower_node.test_question_id):
            return i

    return -1


class KnowledgeSpaceAPI(Resource):
    def post(self):
        data = request.get_json()
        title = data['title']
        test_id = data['test_id']
        new_knowledge_space = KnowledgeSpace(title=title, test_id=test_id, is_real=False, course_id=data['course_id'])
        new_knowledge_space.insert()
        return new_knowledge_space.json_format(), 200

    def get(self):
        return [knowledge_space.json_format() for knowledge_space in KnowledgeSpace.query.all()], 200

    def put(self):
        data = request.get_json()
        ks_id = data['id']
        graph = data['graph']
        edges = graph['edges']
        nodes = graph['nodes']
        for edge in edges:
            e = Edge.query.get(int(edge['id'][1:]))
            e.lower_id = edge['source'][1:]
            e.higher_id = edge['target'][1:]
            e.knowledge_space_id = ks_id
            e.insert()
        for node in nodes:
            p = Problem.query.get(int(node['id'][1:]))
            p.x = node['x']
            p.y = node['y']
            p.knowledge_space_id = ks_id
            p.insert()
        knowledge_space = KnowledgeSpace.query.get(int(ks_id))
        return knowledge_space.json_format(), 200


class GetKnowledgeSpace(Resource):
    def get(self, ks_id):
        knowledge_space = KnowledgeSpace.query.get(int(ks_id))
        real = KnowledgeSpace.query.filter_by(test_id=knowledge_space.test_id, is_real=True).first()
        all_states = KnowledgeSpace.query.filter_by(test_id=knowledge_space.test_id, is_all_states=True).first()
        if real is None:
            ret = {
                'expected': knowledge_space.json_format(),
                'real': {},
                'all_states':{}
            }
        else:
            ret = {
                'expected': knowledge_space.json_format(),
                'real': real.json_format(),
                'all_states': all_states.json_format()
            }
        return ret, 200


class GraphComparisonAPI(Resource):
    def get(self, test_id):
        test = TestModel.query.get(int(test_id))
        questions = test.test_questions
        question_ids = [q.id for q in questions]

        real_edges = []
        real_nodes = set()
        ks_real = KnowledgeSpace.query.filter(KnowledgeSpace.test_id == test_id, KnowledgeSpace.is_real == True, KnowledgeSpace.is_all_states == False).first()
        edges_real = ks_real.edges
        for edge in edges_real:
            problem_higher = Problem.query.get(edge.higher_id)
            problem_higher_question_id = problem_higher.test_question_id
            problem_lower = Problem.query.get(edge.lower_id)
            problem_lower_question_id = problem_lower.test_question_id
            if problem_higher_question_id in question_ids:
                real_nodes.add(problem_higher_question_id)
                real_nodes.add(problem_lower_question_id)
                real_edges.append((problem_lower_question_id, problem_higher_question_id))

        expected_edges = []
        expected_nodes = set()
        ks_expected = KnowledgeSpace.query.filter(KnowledgeSpace.test_id == test_id, KnowledgeSpace.is_real == False, KnowledgeSpace.is_all_states == False).first()
        edges_expected = ks_expected.edges
        for edge in edges_expected:
            problem_higher = Problem.query.get(edge.higher_id)
            problem_higher_question_id = problem_higher.test_question_id
            problem_lower = Problem.query.get(edge.lower_id)
            problem_lower_question_id = problem_lower.test_question_id
            if problem_higher_question_id in question_ids:
                expected_nodes.add(problem_higher_question_id)
                expected_nodes.add(problem_lower_question_id)
                expected_edges.append((problem_lower_question_id, problem_higher_question_id))

        expected_ks = nx.Graph()
        expected_ks.add_nodes_from(list(expected_nodes))
        expected_ks.add_edges_from(expected_edges)

        actual_ks = nx.Graph()
        actual_ks.add_nodes_from(list(real_nodes))
        actual_ks.add_edges_from(real_edges)

        print('Expected edges: {}'.format(expected_edges))
        print('Real edges: {}'.format(real_edges))
        distance = nx.algorithms.similarity.graph_edit_distance(expected_ks, actual_ks)
        print('Graph edit distance: {}'.format(distance))

        return distance, 200
