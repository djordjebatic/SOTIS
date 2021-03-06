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
import pandas as pd

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
from app.api.models.course import Course
from app.api.models.state_probability import StateProbability

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

principals = Principal(app)


db.drop_all()
db.create_all()

course = Course("Quick mafs")
course.insert()

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

u3 = User('Milan', 'Milanovic', 'admin', 'admin123', 'admin@email.com', True)
u3.add_role(role1)
u3.insert()
# stud = Student(u3.id)
# stud.insert()

u4 = User('Milan', 'Milanovic', 'student2', 'student123', 'student2@email.com', True)
u4.add_role(role2)
u4.insert()
stud2 = Student(u4.id)
stud2.insert()

course.professors.append(prof)
course.students.append(stud)
course.students.append(stud2)
course.update()

test = TestModel(title='Test example', professor_id=prof.id, max_score=15, course_id=1)
test.insert()

q1 = TestQuestion(title='a', points=3, test_id=test.id)
q1.insert()
q1.position = q1.id
q1.update()
q1a1 = TestQuestionAnswer(question_id=q1.id, title='Answer 1', isCorrect=True)
q1a1.insert()
q1a2 = TestQuestionAnswer(question_id=q1.id, title='Answer 2', isCorrect=False)
q1a2.insert()

q2 = TestQuestion(title='b', points=3, test_id=test.id)
q2.insert()
q2.position = q2.id
q2.update()
q2a1 = TestQuestionAnswer(question_id=q2.id, title='Answer 1', isCorrect=True)
q2a1.insert()
q2a2 = TestQuestionAnswer(question_id=q2.id, title='Answer 2', isCorrect=False)
q2a2.insert()

q3 = TestQuestion(title='c', points=3, test_id=test.id)
q3.insert()
q3.position = q3.id
q3.update()
q3a1 = TestQuestionAnswer(question_id=q3.id, title='Answer 1', isCorrect=True)
q3a1.insert()
q3a2 = TestQuestionAnswer(question_id=q3.id, title='Answer 2', isCorrect=False)
q3a2.insert()

q4 = TestQuestion(title='d', points=3, test_id=test.id)
q4.insert()
q4.position = q4.id
q4.update()
q4a1 = TestQuestionAnswer(question_id=q4.id, title='Answer 1', isCorrect=True)
q4a1.insert()
q4a2 = TestQuestionAnswer(question_id=q4.id, title='Answer 2', isCorrect=False)
q4a2.insert()

q5 = TestQuestion(title='e', points=3, test_id=test.id)
q5.insert()
q5.position = q5.id
q5.update()
q5a1 = TestQuestionAnswer(question_id=q5.id, title='Answer 1', isCorrect=True)
q5a1.insert()
q5a2 = TestQuestionAnswer(question_id=q5.id, title='Answer 2', isCorrect=False)
q5a2.insert()

ks = KnowledgeSpace('Algebra', 1, False, course_id=1)
ks.insert()

p1 = Problem('a', ks.id, 0, 0, q1.id)
p1.questions.append(q1)
p2 = Problem('b', ks.id, 400, 0, q2.id)
p2.questions.append(q2)
p3 = Problem('c', ks.id, 400, -400, q3.id)
p3.questions.append(q3)
p4 = Problem('d', ks.id, 0, -400, q4.id)
p4.questions.append(q4)
p5 = Problem('e', ks.id, 700, -150, q5.id)
p5.questions.append(q5)
p1.insert()
p2.insert()
p3.insert()
p4.insert()
p5.insert()

e1 = Edge(p1, p2, ks.id)
e2 = Edge(p4, p3, ks.id)
e3 = Edge(p3, p5, ks.id)
e4 = Edge(p2, p5, ks.id)

e1.insert()
e2.insert()
e3.insert()
e4.insert()

new_testTake = TestTake(test_id=1, student_id=1, score=0)
new_testTake.insert()
test_take2 = TestTake(test_id=1, student_id=2, score=0)
test_take2.insert()


test = TestModel(title='Test 2', professor_id=prof.id, max_score=15, course_id=1)
test.insert()

q1 = TestQuestion(title='a', points=3, test_id=test.id)
q1.insert()
q1.position = q1.id
q1.update()
q1a1 = TestQuestionAnswer(question_id=q1.id, title='Answer 1', isCorrect=True)
q1a1.insert()
q1a2 = TestQuestionAnswer(question_id=q1.id, title='Answer 2', isCorrect=False)
q1a2.insert()

q2 = TestQuestion(title='b', points=3, test_id=test.id)
q2.insert()
q2.position = q2.id
q2.update()
q2a1 = TestQuestionAnswer(question_id=q2.id, title='Answer 1', isCorrect=True)
q2a1.insert()
q2a2 = TestQuestionAnswer(question_id=q2.id, title='Answer 2', isCorrect=False)
q2a2.insert()

q3 = TestQuestion(title='c', points=3, test_id=test.id)
q3.insert()
q3.position = q3.id
q3.update()
q3a1 = TestQuestionAnswer(question_id=q3.id, title='Answer 1', isCorrect=True)
q3a1.insert()
q3a2 = TestQuestionAnswer(question_id=q3.id, title='Answer 2', isCorrect=False)
q3a2.insert()

q4 = TestQuestion(title='d', points=3, test_id=test.id)
q4.insert()
q4.position = q4.id
q4.update()
q4a1 = TestQuestionAnswer(question_id=q4.id, title='Answer 1', isCorrect=True)
q4a1.insert()
q4a2 = TestQuestionAnswer(question_id=q4.id, title='Answer 2', isCorrect=False)
q4a2.insert()

q5 = TestQuestion(title='e', points=3, test_id=test.id)
q5.insert()
q5.position = q5.id
q5.update()
q5a1 = TestQuestionAnswer(question_id=q5.id, title='Answer 1', isCorrect=True)
q5a1.insert()
q5a2 = TestQuestionAnswer(question_id=q5.id, title='Answer 2', isCorrect=False)
q5a2.insert()

ks = KnowledgeSpace('Programiranje', 2, False, course_id=1)
ks.insert()

p1 = Problem('a', ks.id, 0, 0, q1.id)
p1.questions.append(q1)
p2 = Problem('b', ks.id, 400, 0, q2.id)
p2.questions.append(q2)
p3 = Problem('c', ks.id, 400, -400, q3.id)
p3.questions.append(q3)
p4 = Problem('d', ks.id, 0, -400, q4.id)
p4.questions.append(q4)
p5 = Problem('e', ks.id, 700, -150, q5.id)
p5.questions.append(q5)
p1.insert()
p2.insert()
p3.insert()
p4.insert()
p5.insert()

e1 = Edge(p1, p2, ks.id)
e2 = Edge(p4, p3, ks.id)
e3 = Edge(p3, p5, ks.id)
e4 = Edge(p2, p5, ks.id)

e1.insert()
e2.insert()
e3.insert()
e4.insert()
