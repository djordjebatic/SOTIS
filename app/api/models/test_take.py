from app import db

"""
tests_taken = db.Table('tests_taken',
                       db.Column('test_id', db.Integer, db.ForeignKey('test.id'), primary_key=True),
                       db.Column('student_id', db.Integer, db.ForeignKey('student.id'), primary_key=True))
"""


class TestTake(db.Model):
    __tablename__ = 'test_take'

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)
    test_take_answer = db.relationship('TestTakeAnswer', backref='test_take', lazy=True)

    def __repr__(self):
        return "TestTake (score = {}, student_id = {}, test_id = {}".format(self.score, self.student_id,
                                                                            self.test_id)
