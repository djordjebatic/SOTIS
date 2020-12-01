from app import db


class TestQuestionAnswer(db.Model):
    __tablename__ = 'test_question_answer'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('test_question.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    isCorrect = db.Column(db.Boolean, nullable=False)
    test_take_answers = db.relationship('TestTakeAnswer', backref='test_question_answer', lazy=True)

    def __init__(self, question_id, title, isCorrect):
        self.question_id = question_id
        self.title = title
        self.isCorrect = isCorrect

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
            'question_id': self.question_id,
            'title': self.title,
            'isCorrect': self.isCorrect,
            'test_take_answers': [test_take_answer.json_format() for test_take_answer in
                                  self.test_take_answers]
        }
