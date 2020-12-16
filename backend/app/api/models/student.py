from app import db

"""
tests_taken = db.Table('tests_taken',
                       db.Column('test_id', db.Integer, db.ForeignKey('test.id'), primary_key=True),
                       db.Column('student_id', db.Integer, db.ForeignKey('student.id'), primary_key=True))
"""


class Student(db.Model):
    __tablename__ = 'student'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    test_takes = db.relationship('TestTake', backref='student', lazy='subquery')

    def __init__(self, name, last_name, username, password):
        self.name = name
        self.last_name = last_name
        self.username = username
        self.password = password

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
            "name": self.name,
            "last_name": self.last_name,
            "username": self.username,
            "test_takes": [test_take.json_format() for test_take in self.test_takes]
        }
