from flask_restful import Resource
from app.api.models.user import User
from app.api.models.role import Role
from app.api.models.student import Student
from app.api.models.professor import Professor
from flask import request
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, get_jwt_claims
)


class UserAPI(Resource):
    @jwt_required
    def get(self):
        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        if user is not None:
            return user.json_format(), 200
        return 'Provide a valid auth token.', 401

# @login_required
# @roles_accepted('ROLE_PROFESSOR')
# @rbac.allow(['PROFESSOR'], methods=['GET'], with_children=False)
# @professor_permission.require(http_exception=403)
# @professor_permission.require()


class UsersAPI(Resource):
    @jwt_required
    def get(self, role):
        if role == "student":
            students = Student.query.all()
            return [student.json_format() for student in students], 200
        elif role == "professor":
            professors = Professor.query.all()
            return [professor.json_format() for professor in professors], 200
        return 'error', 404
