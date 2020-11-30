from app import db


class TestTakeAnswer(db.Model):
    __tablename__ = 'test_take_answer'

    id = db.Column(db.Integer, primary_key=True)
    test_take_id = db.Column(db.Integer, db.ForeignKey('test_take.id'), nullable=False)
    test_question_id = db.Column(db.Integer, db.ForeignKey('test_question.id'), nullable=False)
    test_question_answer_id = db.Column(db.Integer, db.ForeignKey('test_question_answer.id'), nullable=False)
    selected = db.Column(db.Boolean, nullable=False)

