from app import db
from app.api.models.problem_edge import Problem, KnowledgeSpace

problems_questions = db.Table(
    'problems_test_questions',
    db.Column('problem_id', db.Integer(), db.ForeignKey('problem.id')),
    db.Column('test_question_id', db.Integer(), db.ForeignKey('test_question.id'))
)

class TestQuestion(db.Model):
    __tablename__ = 'test_question'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    position = db.Column(db.Integer)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)
    test_question_answers = db.relationship('TestQuestionAnswer', backref='test_question', lazy='subquery')
    test_take_answers = db.relationship('TestTakeAnswer', backref='test_question', lazy='subquery')
    problem = db.relationship('Problem', uselist=False, backref='test_question', lazy='subquery')
    problems = db.relationship(
        'Problem',
        secondary=problems_questions,
        backref=db.backref('questions', lazy='subquery')
    )

    def __init__(self, title, points, test_id):
        self.title = title
        self.points = points
        self.test_id = test_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def json_format(self):
        ks = KnowledgeSpace.query.filter_by(test_id=self.test_id, is_real=False).first()
        problem_id = ''
        if ks:
            problem = Problem.query.filter_by(knowledge_space_id=ks.id, test_question_id=self.id).first()
            if problem:
                problem_id = problem.id
        return {
            "id": self.id,
            "title": self.title,
            "points": self.points,
            "test_id": self.test_id,
            "problem_id": problem_id,
            "position": self.position,
            "test_question_answers": [test_question_answer.json_format() for test_question_answer in self.test_question_answers],
            "test_take_answers": [test_take_answer.json_format() for test_take_answer in self.test_take_answers]
        }