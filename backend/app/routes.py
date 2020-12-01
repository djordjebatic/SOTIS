from app import app
from app.api.models.student import Student
from app.api.models.test_question import TestQuestion
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
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


api = Api(app)
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(CreateTest, '/test')


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
