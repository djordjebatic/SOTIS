from app import db
from app.api.models.student import Student
from app.api.models.user import User


class TestTake(db.Model):
    __tablename__ = 'test_take'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    test_take_answers = db.relationship('TestTakeAnswer', backref='test_take', lazy='subquery')
    done = db.Column(db.Boolean, nullable=False)

    def __init__(self, student_id, test_id, score):
        self.student_id = student_id
        self.test_id = test_id
        self.score = score
        self.done = False

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def json_format(self):
        student = Student.query.get(self.student_id)
        user = User.query.filter(User.id == student.user_id).first()
        student_json = {
            "id": student.id,
            "user": user.json_format()
        }
        return {
            "id": self.id,
            "student": student_json,
            "test_id": self.test_id,
            "score": self.score,
            "test_take_answers": [test_take_answer.json_format() for test_take_answer in self.test_take_answers],
            "done": self.done
        }
