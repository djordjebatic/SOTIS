from app import app, bcrypt, jwt, login_manager
from app import professor_permission
from app.api.models.student import Student
from app.api.models.test_question import TestQuestion
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_take import TestTake
from app.api.models.problem_edge import Problem, Edge, KnowledgeSpace
from app.api.models.user import User
from app.api.models.role import Role
from app.api.models.professor import Professor
from app.api.models.student import Student
from flask_restful import Resource, Api
from flask import request, jsonify, current_app, session
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, get_jwt_claims
)

from flask_principal import Identity, AnonymousIdentity, identity_changed, identity_loaded, RoleNeed, UserNeed
from flask_login import login_user, logout_user, current_user

import datetime

from flask import request


# if not current_user.is_authenticated:
#     return current_app.login_manager.unauthorized()

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        # TODO change after adding roles (User class)
        if User.query.filter(User.username == data['username']).first():
            return {'error': 'User already exists'}, 409

        # TODO hash pasword (flask_jwt)
        user = User(name=data['name'], last_name=data['last_name'], username=data['username'],
                    password=data['password'], email=data['email'])
        role = Role.query.filter(Role.name == 'ROLE_STUDENT').first()
        user.add_role(role)
        user.insert()
        student = Student(user_id=user.id)
        student.insert()

        return student.json_format(), 200


class UserLogin(Resource):
    # def post(self):
    #     data = request.get_json()
    #     # TODO change after adding roles (User class)
    #     user = Student.query.filter(Student.username == data['username']).first()
    #     if not user or bcrypt.check_password_hash(user.password, data['password']:
    #         return {'error': 'Username and/or password don\'t match'}, 409
    #     else:
    #         # TODO access token (flask_jwt)
    #         return user.json_format(), 200
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
            responseObject = {
                'status': 'success',
                'message': 'Successfully logged in.',
                'auth_token': auth_token,
                'role': user.roles[0].name
            }
            return responseObject, 200


# @app.before_request
# def before_request():
#     g.user = current_user
#     print ('current_user: %s, g.user:, leaving bef_req' % (current_user))


@app.route('/logout', methods=['POST', 'GET'])
def logout():
    if current_user.is_authenticated:
        logout_user()
        # Remove session keys set by Flask-Principal
        for key in ('identity.name', 'identity.auth_type'):
            session.pop(key, None)

        # Tell Flask-Principal the user is anonymous
        identity_changed.send(current_app._get_current_object(),
                              identity=AnonymousIdentity())
        return 'Logged out', 200
    return 'OK', 200


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

    @jwt_required
    def post(self):
        data = request.get_json()
        username = get_jwt_identity()

        # role = get_jwt_claims()['role']

        user = User.query.filter_by(username=username).first()
        professor = Professor.query.filter_by(user_id=user.id).first()
        # TODO checks
        test = TestModel(title=data['title'], professor_id=professor.id, max_score=data['max_score'])
        test.insert()
        questions = data['questions']

        for question in questions:
            new_question = TestQuestion(title=question['title'], points=question['points'], test_id=test.id)
            new_question.insert()
            new_question.position = new_question.id
            new_question.update()

            question_answers = question['answers']
            for answer in question_answers:
                new_answer = TestQuestionAnswer(question_id=new_question.id, title=answer['title'],
                                                isCorrect=answer['isCorrect'])
                new_answer.insert()

        return test.json_format(), 200

    def get(self):
        return [test.json_format() for test in TestModel.query.all()], 200


class TestQuestionsAPI(Resource):
    def get(self, test_id):
        test = TestModel.query.filter(TestModel.id == test_id).first()
        return test.json_format()['test_questions'], 200


class CreateTestTake(Resource):
    @jwt_required
    def post(self):
        data = request.get_json()
        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        student = Student.query.filter_by(user_id=user.id).first()
        # TODO checks
        # TODO calculate score
        test = data['test']
        test_take = TestTake(student_id=student.id, test_id=data['test_id'], score=0)
        test_take.insert()

        questions = test['test_questions']

        for question in questions:
            answers = question['test_question_answers']

            for answer in answers:
                test_take_answer = TestTakeAnswer(test_take_id=test_take.id, test_question_id=question['id'],
                                                  test_question_answer_id=answer['id'],
                                                  selected=answer['isCorrect'])
                test_take_answer.insert()

        return test_take.id, 200


class ProblemAPI(Resource):
    def post(self):
        data = request.get_json()

        # TODO check if problem in knowledge graph

        title = data['title']
        knowledge_space_id = data['knowledge_space_id']
        x = data['x']
        y = data['y']
        question_id = data['question_id']
        new_problem = Problem(title, knowledge_space_id, x, y, question_id)
        new_problem.insert()

        return new_problem.json_format(), 200

    def get(self):
        return [problem.json_format() for problem in Problem.query.all()], 200

    def get(self, problem_id):
        problem = Problem.query.filter(Problem.id == problem_id).first()
        if problem:
            question = TestQuestion.query.filter(TestQuestion.problem == problem).first()
            return question.json_format(), 200
        else:
            return {'error': 'Problem with id {} does\'t exist'.format(problem_id)}, 409

    def delete(self, problem_id):
        problem = Problem.query.filter(Problem.id == problem_id).first()
        if problem:
            # first delete connected edges
            upper = Edge.query.filter(Edge.higher_id == problem_id).first()
            if upper:
                upper.delete()

            lowers = Edge.query.filter(Edge.lower_id == problem_id).all()
            for lower in lowers:
                lower.delete()

            problem.delete()
            return [problem.json_format() for problem in Problem.query.all()], 200
        else:
            return {'error': 'Problem with id {} does\'t exist'.format(problem_id)}, 409


class EdgeAPI(Resource):
    def post(self):
        data = request.get_json()

        lower_node_id = data['lower_id']
        upper_node_id = data['upper_id']

        knowledge_space_id = data['knowledge_space_id']

        upper_node = Problem.query.filter(Problem.id == upper_node_id).first()
        lower_node = Problem.query.filter(Problem.id == lower_node_id).first()

        if not upper_node:
            return {'error': 'Node (problem) with id {} doesn\'t exist'.format(upper_node_id)}, 409

        if not lower_node:
            return {'error': 'Node (problem) with id {} doesn\'t exist'.format(lower_node_id)}, 409

        '''if Edge.query.filter(Edge.knowledge_space_id == knowledge_space_id
                             and Edge.lower_id == lower_node_id
                             and Edge.upper_id == upper_node_id).first():
            return {'error': 'Edge already exists'}, 409'''

        # backwards cycle check
        end = False
        l_n = lower_node
        while not end:
            if not l_n.json_format()['lower_edge_ids']:
                break
            if upper_node_id in l_n.json_format()['lower_edge_ids']:
                return {'error': '[RECURSION] - Lower node (id: {}) already has upper edges'}, 409
            else:
                if l_n.json_format()['lower_edge_ids']:
                    l_n = Problem.query.filter(Problem.id == l_n.json_format()['lower_edge_ids'][0]).first()
                else:
                    end = True

        # forward cycle check
        end = False
        u_n = upper_node
        while not end:
            if not u_n.json_format()['lower_edge_ids']:
                break
            if lower_node_id in u_n.json_format()['lower_edge_ids']:
                return {'error': '[RECURSION] - Lower node (id: {}) already has upper edges'}, 409
            else:
                if u_n.json_format()['lower_edge_ids']:
                    u_n = Problem.query.filter(Problem.id == u_n.json_format()['lower_edge_ids'][0]).first()
                else:
                    end = True

        new_edge = Edge(lower_node, upper_node, knowledge_space_id)
        new_edge.insert()

        return new_edge.json_format(), 200

    def get(self):
        return [edge.json_format() for edge in Edge.query.all()], 200

    def delete(self, edge_id):
        edge = Edge.query.filter(Edge.id == edge_id).first()
        if edge:
            lower_node = edge.lower_node
            if lower_node.root:
                lower_node.root = False
                lower_node.update()
            edge.delete()

            return [edge.json_format() for edge in Edge.query.all()], 200
        else:
            return {'error': 'Edge with id {} does\'t exist'.format(edge_id)}, 409


class KnowledgeSpaceAPI(Resource):
    def post(self):
        data = request.get_json()
        title = data['title']
        test_id = data['test_id']
        new_knowledge_space = KnowledgeSpace(title, test_id, False)
        new_knowledge_space.insert()
        # TODO add test_id on front
        new_knowledge_space.test_id = new_knowledge_space.id
        new_knowledge_space.insert()
        return new_knowledge_space.json_format(), 200

    def get(self):
        return [knowledge_space.json_format() for knowledge_space in KnowledgeSpace.query.all()], 200

    def put(self):
        data = request.get_json()
        id = data['id']
        graph = data['graph']
        edges = graph['edges']
        nodes = graph['nodes']
        for edge in edges:
            e = Edge.query.get(int(edge['id']))
            e.lower_id = edge['source']
            e.higher_id = edge['target']
            e.knowledge_space_id = id
            e.insert()
        for node in nodes:
            p = Problem.query.get(int(node['id']))
            p.x = node['x']
            p.y = node['y']
            p.knowledge_space_id = id
            p.insert()
        knowledge_space = KnowledgeSpace.query.get(int(id))
        return knowledge_space.json_format(), 200


class UserAPI(Resource):
    def get(self):
        # get the auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token:
            # resp = User.decode_auth_token(auth_token)
            username = get_jwt_identity()
            if not isinstance(username, str):
                user = User.query.filter_by(username=username).first()
                responseObject = {
                    'status': 'success',
                    'data': {
                        'user_id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'admin': user.admin,
                        'name': user.name,
                        'last_name': user.lastname
                    }
                }
                return responseObject, 200
            responseObject = {
                'status': 'fail',
                'message': auth_token
            }
            return responseObject, 401
        else:
            responseObject = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return responseObject, 401


class FormatTestsAPI(Resource):
    def post(self):
        data = request.get_json()

        # TODO check
        ks_id = data['knowledge_space_id']

        edges = Edge.query.filter(Edge.knowledge_space_id == ks_id).all()
        nodes = Problem.query.filter(Problem.knowledge_space_id == ks_id).all()
        print(len(nodes), len(edges))
        if len(nodes) - len(edges) != 1:
            return {'error': 'All nodes must be connected'}, 409

        for edge in edges:
            lower_node_id = edge.lower_id
            root_node = Problem.query.filter(Problem.id == lower_node_id).first()
            if not root_node.json_format()['lower_edge_ids'] and root_node.json_format()['upper_edge_ids']:
                root_node.root = True
                root_node.update()
            else:
                root_node.root = False
                root_node.update()

        visited = []
        queue = []
        i = 1
        root_node = Problem.query.filter(Problem.root == True).first()
        print(root_node.title)

        visited.append(root_node.id)
        queue.append(root_node)

        while queue:
            s = queue.pop(0)
            node_question_id = s.test_question_id
            question = TestQuestion.query.filter(TestQuestion.id == node_question_id).first()
            question.position = i
            question.update()
            i += 1
            print(question.title)

            for neighbour_id in s.json_format()['upper_edge_ids']:
                if neighbour_id not in visited:
                    visited.append(neighbour_id)
                    queue.append(Problem.query.filter(Problem.id == neighbour_id).first())

        return [test.json_format() for test in TestModel.query.all()], 200


api = Api(app)
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(CreateTest, '/test')
api.add_resource(CreateTestTake, '/test_take')
api.add_resource(ProblemAPI, '/problem', '/problem/<problem_id>')
api.add_resource(EdgeAPI, '/edge', '/edge/<edge_id>')
api.add_resource(KnowledgeSpaceAPI, '/knowledge_space')
api.add_resource(UserAPI, '/user')
api.add_resource(TestQuestionsAPI, '/testquestions/<test_id>')
api.add_resource(FormatTestsAPI, '/format-tests')


# def get_current_user():
#     with current_app.request_context():
#         return g.current_user


# @login_manager.request_loader
# def load_user_from_request(request):
#     username = get_jwt_identity()
#     user = User.query.find_by(username = username).first()
#     return user

@identity_loaded.connect_via(app)
def on_identity_loaded(sender, identity):
    # Set the identity user object
    identity.user = current_user
    # Add the UserNeed to the identity
    if hasattr(current_user, 'id'):
        identity.provides.add(UserNeed(current_user.id))

    # Assuming the User model has a list of roles, update the
    # identity with the roles that the user provides
    if hasattr(current_user, 'roles'):
        for role in current_user.roles:
            identity.provides.add(RoleNeed(role.name))


@login_manager.user_loader
def load_user(userid):
    return User.get(userid)


# @principals.identity_loader
# def read_identity_from_flask_login():
#     if current_user.is_authenticated:
#         return Identity(current_user.id)
#     return AnonymousIdentity()

@app.route('/student', methods=['POST', 'GET'])
@jwt_required
# @login_required
# @roles_accepted('ROLE_PROFESSOR')
# @rbac.allow(['PROFESSOR'], methods=['GET'], with_children=False)
# @professor_permission.require(http_exception=403)
# @professor_permission.require()
def handle_students():
    username = get_jwt_identity()
    print(username)
    students = Student.query.all()
    return {"students": [student.json_format() for student in students]}, 200


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


@app.route("/knowledge_space/<int:id>")
def getKnowledgeSpace(id):
    knowledge_space = KnowledgeSpace.query.get(int(id))
    real = KnowledgeSpace.query.filter_by(test_id=knowledge_space.test_id, isReal=True).first()
    '''ret = {
        'expected': knowledge_space.json_format(),
        'real': real.json_format()
    }'''
    return knowledge_space.json_format(), 200


@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    user = User.query.filter(User.username == identity).first()
    return {
        'role': user.roles[0].name
    }


@jwt.expired_token_loader
def my_expired_token_callback(expired_token):
    token_type = expired_token['type']
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'msg': 'The {} token has expired'.format(token_type)
    }), 401
