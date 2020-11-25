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
from app.api.models.answer import Answer
from app.api.models.professor import Professor
from app.api.models.question import Question
from app.api.models.student import Student
from app.api.models.test import TestModel