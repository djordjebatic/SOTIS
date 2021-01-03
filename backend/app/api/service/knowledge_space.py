import numpy as np
import sys

from app import app
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.problem_edge import KnowledgeSpace, Problem, Edge
from flask import request
from flask_restful import Resource

sys.path.append('learning_spaces/')
from learning_spaces.kst import iita


# data_frame = pd.DataFrame({'a': [1, 0, 1], 'b': [0, 1, 0], 'c': [0, 1, 1]})
# response = iita(data_frame, v=1)
# print(response)
# {'diff': array([ 0.18518519,  0.16666667,  0.21296296]), 'implications': [(0, 1), (0, 2), (2, 0), (2, 1)], 'error.rate': 0.5, 'selection.set.index': 1, 'v': 1}


class GenerateRealKnowledgeSpace(Resource):
    def put(self, ks_id):
        knowledge_space = KnowledgeSpace.query.get(int(ks_id))
        test = TestModel.query.get(int(knowledge_space.test_id))
        if len(test.test_takes) > 1:
            m = generate_matrix(test)
            response = iita(m, v=2)
            print(response)
            return create_graph(test, response['implications'])
        return None


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
    ks_expected = KnowledgeSpace.query.filter_by(test_id=test.id, is_real=False).first()
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

    return ks.json_format()


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
            e = Edge.query.get(int(edge['id']))
            e.lower_id = edge['source']
            e.higher_id = edge['target']
            e.knowledge_space_id = ks_id
            e.insert()
        for node in nodes:
            p = Problem.query.get(int(node['id']))
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
        if real is None:
            ret = {
                'expected': knowledge_space.json_format(),
                'real': {}
            }
        else:
            ret = {
                'expected': knowledge_space.json_format(),
                'real': real.json_format()
            }
        return ret, 200