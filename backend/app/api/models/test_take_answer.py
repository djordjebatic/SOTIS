from app import db


class TestTakeAnswer(db.Model):
    __tablename__ = 'test_take_answer'

    id = db.Column(db.Integer, primary_key=True)
    test_take_id = db.Column(db.Integer, db.ForeignKey('test_take.id'), nullable=False)
    test_question_id = db.Column(db.Integer, db.ForeignKey('test_question.id'), nullable=False)
    test_question_answer_id = db.Column(db.Integer, db.ForeignKey('test_question_answer.id'), nullable=False)
    selected = db.Column(db.Boolean, nullable=False)
    question_number = db.Column(db.Integer, nullable=False)

    def __init__(self, test_take_id, test_question_id, test_question_answer_id, selected, question_number):
        self.test_take_id = test_take_id
        self.test_question_id = test_question_id
        self.test_question_answer_id = test_question_answer_id
        self.selected = selected
        self.question_number = question_number

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
            "id": self.id,
            "test_take_id": self.test_take_id,
            "test_question_id": self.test_question_id,
            "test_question_answer_id": self.test_question_answer_id,
            "selected": self.selected,
            "question_number": self.question_number
        }

