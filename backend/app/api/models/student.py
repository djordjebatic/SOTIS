from app import db
from app.api.models.user import User

"""
tests_taken = db.Table('tests_taken',
                       db.Column('test_id', db.Integer, db.ForeignKey('test.id'), primary_key=True),
                       db.Column('student_id', db.Integer, db.ForeignKey('student.id'), primary_key=True))
"""


class Student(db.Model):
    __tablename__ = 'student'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    test_takes = db.relationship('TestTake', backref='student', lazy=True)

    def __init__(self, user_id):
        self.user_id = user_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def json_format(self):
        user = User.query.filter(User.id == self.user_id).first()
        return {
            'id': self.id,
            'user': user.json_format(),
            'test_takes': [test_take.json_format() for test_take in self.test_takes]
        }
