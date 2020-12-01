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

db.drop_all()
db.create_all()
'''s1 = Student(name='Milica', last_name='Skipina')
s2 = Student(name='Djordje', last_name='Batic')
db.session.add(s1)
db.session.add(s2)
db.session.commit()'''