from app import db


class TestQuestion(db.Model):
    __tablename__ = 'test_question'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)
    test_question_answers = db.relationship('TestQuestionAnswer', backref='test_question', lazy=True)
    test_take_answers = db.relationship('TestTakeAnswer', backref='test_question', lazy=True)

    def __init__(self, title, points, test_id, test_question_answers):
        self.title = title
        self.points = points
        self.test_id = test_id
        self.test_question_answers = test_question_answers

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def json_format(self):
        return {
            'id': self.id,
            'title': self.title,
            'points': self.points,
            'test_id': self.test_id,
            'test_question_answers': [test_question_answer.json_format() for test_question_answer in self.test_question_answers],
            'test_take_answers': [test_take_answer.json_format() for test_take_answer in self.test_take_answers]
        }
