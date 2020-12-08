from app import app
from app.api.models.student import Student
from app.api.models.test_question import TestQuestion
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_take import TestTake
from app.api.models.problem_edge import Problem, Edge
from flask_restful import Resource, Api
from flask import request


class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        # TODO change after adding roles (User class)
        if Student.query.filter(Student.username == data['username']).first():
            return {'error': 'User already exists'}, 409

        # TODO hash pasword (flask_jwt)
        student = Student(name=data['name'], last_name=data['last_name'], username=data['username'],
                          password=data['password'])
        student.insert()

        return student.json_format(), 200


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        # TODO change after adding roles (User class)
        user = Student.query.filter(Student.username == data['username']).first()

        if not user or user.password != data['password']:
            return {'error': 'Username and/or password don\'t match'}, 409
        else:
            # TODO access token (flask_jwt)
            return user.json_format(), 200


class CreateTest(Resource):
    """
    JSON BODY [FOR TESTING]:
    {
        "title": "test",
        "professor_id": "1",
        "max_score": "2",
        "questions": [
            {
                "title": "Ko je lenjivac",
                "points": "1",
                "answers": [
                    {
                        "title": "Zec",
                        "isCorrect": 0
                    },
                    {
                        "title": "Zmija",
                        "isCorrect": 1
                    },
                    {
                        "title": "Guster",
                        "isCorrect": 1
                    }
                ]
            },
                    {
                "title": "Ko je nesto drugo",
                "points": "1",
                "answers": [
                    {
                        "title": "Zec",
                        "isCorrect": 0
                    },
                    {
                        "title": "Orao",
                        "isCorrect": 1
                    },
                    {
                        "title": "Vrabac",
                        "isCorrect": 1
                    }
                ]
            }
        ]
    }
    """
    def post(self):
        data = request.get_json()
        # TODO checks
        test = TestModel(title=data['title'], professor_id=data['professor_id'], max_score=data['max_score'])
        test.insert()
        questions = data['questions']

        for question in questions:
            new_question = TestQuestion(title=question['title'], points=question['points'], test_id=test.id)
            new_question.insert()

            question_answers = question['answers']
            for answer in question_answers:
                new_answer = TestQuestionAnswer(question_id=new_question.id, title=answer['title'],
                                                isCorrect=answer['isCorrect'])
                new_answer.insert()

        return test.json_format(), 200

    def get(self):
        return [test.json_format() for test in TestModel.query.all()], 200


class CreateTestTake(Resource):
    def post(self):
        data = request.get_json()
        # TODO calculate score
        test = data['test']
        test_take = TestTake(student_id=data['student_id'], test_id=data['test_id'], score=0)
        test_take.insert()
        
        questions = test['test_questions']

        for question in questions:
            answers = question['test_question_answers']

            for answer in answers:
                test_take_answer = TestTakeAnswer(test_take_id=test_take.id, test_question_id=question['id'], test_question_answer_id=answer['id'],
                                                  selected=answer['isCorrect'])
                test_take_answer.insert()

        return test_take.id, 200


class ProblemAPI(Resource):
    def post(self):
        data = request.get_json()

        # TODO check if problem in knowledge graph

        title = data['title']

        new_problem = Problem(title)
        new_problem.insert()

        return new_problem.json_format(), 200

    def get(self):
        return [problem.json_format() for problem in Problem.query.all()], 200


class EdgeAPI(Resource):
    # TODO ask if recursion is ok
    def post(self):
        data = request.get_json()

        lower_node_id = data['lower_id']
        upper_node_id = data['upper_id']

        upper_node = Problem.query.filter(Problem.id == upper_node_id).first()
        lower_node = Problem.query.filter(Problem.id == lower_node_id).first()

        if not upper_node:
            return {'Node (problem) with id {} doesn\'t exist'.format(upper_node_id)}, 409

        if not lower_node:
            return {'Node (problem) with id {} doesn\'t exist'.format(lower_node_id)}, 409

        if upper_node_id in lower_node.json_format()['lower_edge_ids']:
            return {'Upper node (problem) with id {} already exists as lower node for lower node (RECURSION)'
                        .format(lower_node_id)}, 409

        print(upper_node_id, lower_node.json_format()['lower_edge_ids'])
        new_edge = Edge(lower_node, upper_node)
        new_edge.insert()

        return new_edge.json_format(), 200

    def get(self):
        return [edge.json_format() for edge in Edge.query.all()], 200


api = Api(app)
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(CreateTest, '/test')
api.add_resource(CreateTestTake, '/test_take')
api.add_resource(ProblemAPI, '/problem')
api.add_resource(EdgeAPI, '/edge')


@app.route('/')
def index():
    return "Hello World!"


@app.route('/student', methods=['POST', 'GET'])
def handle_students():
    students = Student.query.all()
    result = [
        {
        "id": student.id,
        "name": student.name,
        "last_name":student.last_name
        } for student in students
    ]
    return {"students": result}

@app.route("/test/<int:id>")
def getTest(id):
    test = TestModel.query.get(int(id))
    questions = test.test_questions
    for i in range(len(questions)):
            question_answers = test.test_questions[i].test_question_answers
            for j in range(len(question_answers)):
                test.test_questions[i].test_question_answers[j].isCorrect = 0

    return test.json_format(), 200

@app.route("/test_take/<int:id>")
def getTestTake(id):
    test_take = TestTake.query.get(int(id))
    test = TestModel.query.get(int(test_take.test_id))
    ret = {
        "test_take": test_take.json_format(),
        "test": test.json_format()
    }
    return ret, 200