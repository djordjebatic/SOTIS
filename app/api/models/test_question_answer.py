from app import db


class TestQuestionAnswer(db.Model):
    __tablename__ = 'test_question_answer'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('test_question.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    isCorrect = db.Column(db.Boolean, nullable=False)
    test_take_answer = db.relationship('TestTakeAnswer', backref='test_question_answer', lazy=True)


