from app import app
from app.api.models.student import Student
from flask_restful import Resource, reqparse, Api
from flask import request


class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        # TODO change after adding roles (User class)
        if Student.query.filter(Student.username == data['username']).first():
            return {'error': 'User already exists'}, 409

        # TODO hash pasword (flask_jwt)
        student = Student(name=data['name'], last_name=data['last_name'], username=data['username'], password=data['password'])
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


api = Api(app)
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')


@app.route('/')
@app.route('/index')
def index():
    return "Hello World!"


@app.route('/student', methods=['POST', 'GET'])
def handle_students():
    students = Student.query.all()
    result = [
        {
        "id": student.id,
        "username": student.username,
        "password": student.password,
        "name": student.name,
        "last_name":student.last_name
        } for student in students
    ]
    return {"students": result}