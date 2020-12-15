import flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = flask.Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

from app import routes
from app.api.models.professor import Professor
from app.api.models.student import Student
from app.api.models.test import TestModel
from app.api.models.test_question import TestQuestion
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test_take import TestTake
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.problem_edge import Problem, Edge, KnowledgeSpace


db.drop_all()
db.create_all()
ks = KnowledgeSpace('Prostor znanja')
ks.insert()

p1 = Problem('Proba 1', ks.id, 1, 1)
p2 = Problem('Proba 2', ks.id, 1, 1)
p3 = Problem('Proba 3', ks.id, 1, 1)
p4 = Problem('Proba 4', ks.id, 1, 1)
p1.insert()
p2.insert()
p3.insert()
p4.insert()

e1 = Edge(p1, p2, ks.id)
e2 = Edge(p2, p3, ks.id)
#e3 = Edge(p1, p3, ks.id)
e1.insert()
e2.insert()
#e3.insert()
