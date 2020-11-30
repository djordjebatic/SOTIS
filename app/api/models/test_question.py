from app import db


class TestQuestion(db.Model):
    __tablename__ = 'test_question'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)
    test_question_answer = db.relationship('TestQuestionAnswer', backref='test_question', lazy=True)
    test_take_answer = db.relationship('TestTakeAnswer', backref='test_question', lazy=True)

    def __repr__(self):
        return "Question(title = {}, correct_answer = {}, points = {}".format(self.title, self.correct_answer,
                                                                              self.points)