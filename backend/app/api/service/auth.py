from flask_restful import Resource
from app.api.models.user import User
from app.api.models.role import Role
from app.api.models.student import Student
from app.api.models.professor import Professor
from flask import request, session, current_app
from flask_login import login_user, logout_user, current_user
import datetime
from app import app, bcrypt
from flask_jwt_extended import create_access_token
from flask_principal import Identity, AnonymousIdentity, identity_changed


class UserRegistration(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter(User.username == data['username']).first():
            return {'error': 'User already exists'}, 409

        user = User(name=data['name'], last_name=data['last_name'], username=data['username'],
                    password=data['password'], email=data['email'])
        if data['role'] == 'student':
            role = Role.query.filter(Role.name == 'ROLE_STUDENT').first()
            user.add_role(role)
            user.insert()
            student = Student(user_id=user.id)
            student.insert()
            return student.json_format(), 200
        elif data['role'] == 'professor':
            role = Role.query.filter(Role.name == 'ROLE_PROFESSOR').first()
            user.add_role(role)
            user.insert()
            professor = Professor(user_id=user.id)
            professor.insert()
            return professor.json_format(), 200


class UserLogin(Resource):
    def post(self):
        if current_user.is_authenticated:
            return 'user is already logged in', 403

        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if not user or not bcrypt.check_password_hash(user.password, data['password']):
            return {'error': 'Username and/or password don\'t match'}, 404

        # auth_token = user.encode_auth_token(user.username)
        expires = datetime.timedelta(days=365)
        auth_token = create_access_token(identity=user.username, expires_delta=expires)
        login_user(user, remember=True)

        identity_changed.send(app,
                              identity=Identity(user.id))
        # session['username'] = user.username
        if auth_token:
            response_object = {
                'status': 'success',
                'message': 'Successfully logged in.',
                'auth_token': auth_token,
                'role': user.roles[0].name
            }
            return response_object, 200


class UserLogout(Resource):
    def post(self):
        if current_user.is_authenticated:
            logout_user()
            # Remove session keys set by Flask-Principal
            for key in ('identity.name', 'identity.auth_type'):
                session.pop(key, None)

            # Tell Flask-Principal the user is anonymous
            identity_changed.send(current_app._get_current_object(),
                                  identity=AnonymousIdentity())
            return 'Logged out', 200
        return 'There is no logged in user', 200
