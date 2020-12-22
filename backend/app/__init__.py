import flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from flask_login import LoginManager
from flask_security import Security, SQLAlchemyUserDatastore
from flask_principal import Principal, Permission, RoleNeed

app = flask.Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)



bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)
login_manager = LoginManager(app)

admin_permission = Permission(RoleNeed('ROLE_ADMIN'))
professor_permission = Permission(RoleNeed('ROLE_PROFESSOR'))

from app import routes
from app.api.models.professor import Professor
from app.api.models.student import Student
from app.api.models.test import TestModel
from app.api.models.test_question import TestQuestion
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test_take import TestTake
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.problem_edge import Problem, Edge, KnowledgeSpace

from app.api.models.user import User
from app.api.models.role import Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

principals = Principal(app)


db.drop_all()
db.create_all()

role1 = Role('ROLE_ADMIN', 'Administrator role')
role2 = Role('ROLE_STUDENT', 'Student role')
role3 = Role('ROLE_PROFESSOR', 'Professor role')
role1.insert()
role2.insert()
role3.insert()

u1 = User('Marko', 'Markovic', 'profesor', 'profesor123', 'profesor@email.com')
u1.add_role(role3)
u1.insert()
prof = Professor(u1.id)
prof.insert()

u2 = User('Nikola', 'Nikolic', 'student', 'student123', 'student@email.com')
u2.add_role(role2)
u2.insert()
stud = Student(u2.id)
stud.insert()

ks = KnowledgeSpace('Algebra', 1)
ks.insert()

p1 = Problem('Proba 1', ks.id, 100, 100)
p2 = Problem('Proba 2', ks.id, 500, 500)
p3 = Problem('Proba 3', ks.id, 500, 100)
p4 = Problem('Proba 4', ks.id, 100, 500)
p1.insert()
p2.insert()
p3.insert()
p4.insert()

e1 = Edge(p1, p2, ks.id)
e2 = Edge(p2, p3, ks.id)
e1.insert()
e2.insert()'''
