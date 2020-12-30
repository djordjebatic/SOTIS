from flask_restful import Resource
from app.api.models.user import User
from app.api.models.professor import Professor
from app.api.models.student import Student
from app.api.models.role import Role
from app.api.models.student import Student
from flask import request, session, current_app
from flask_login import login_user, logout_user, current_user
import datetime
from app import app, bcrypt
from flask_jwt_extended import create_access_token
from flask_principal import Identity, AnonymousIdentity, identity_changed
from app.api.models.course import Course
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, get_jwt_claims
)


class CoursesListAPI(Resource):
    def post(self):
        data = request.get_json()
        title = data['title']
        new_course = Course(title)
        new_course.insert()
        return new_course.json_format(), 200

    @jwt_required
    def get(self):
        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        role = user.roles[0]
        if role.name == 'ROLE_ADMIN':
            return [course.json_format() for course in Course.query.all()], 200
        if role.name == 'ROLE_PROFESSOR':
            professor = Professor.query.filter_by(user_id=user.id).first()
            return [course.json_format() for course in professor.courses]
        if role.name == 'ROLE_STUDENT':
            student = Student.query.filter_by(user_id=user.id).first()
            return [course.json_format() for course in student.courses]
        return 'error', 404

    def put(self):
        data = request.get_json()
        course_id = data['id']
        title = data['title']
        course = Course.query.get(int(course_id))
        course.title = title
        course.update()
        return course.json_format(), 200


class CourseAPI(Resource):
    def get(self, course_id):
        course = Course.query.get(int(course_id))
        return course.json_format(), 200

    @jwt_required
    def put(self, course_id):
        course = Course.query.get(int(course_id))
        data = request.get_json()
        role = data['role']
        if role == 'professor':
            professors = data['users']
            for professor in professors:
                p = Professor.query.filter_by(id=professor['id']).first()
                course.professors.append(p)
        elif role == 'student':
            students = data['users']
            for student in students:
                s = Student.query.filter_by(id=student['id']).first()
                course.students.append(s)
        course.update()
        return course.json_format(), 200


class CourseTestsAPI(Resource):
    def get(self, course_id):
        course = Course.query.get(course_id)
        tests = course.tests
        ret = []
        for test in tests:
            if len(test.knowledge_spaces) == 0:
                ret.append(test.json_format())
        return ret, 200
