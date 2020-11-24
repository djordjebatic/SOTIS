from init import db

tests_taken = db.Table('tests_taken',
                       db.Column('test_id', db.Integer, db.ForeignKey('test.id'), primary_key=True),
                       db.Column('student_id', db.Integer, db.ForeignKey('student.id'), primary_key=True))


class Student(db.Model):
    __tablename__ = 'student'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    tests_taken = db.relationship('Test', secondary=tests_taken, lazy='subquery',
                                  backref=db.backref('students', lazy=True))

    def __repr__(self):
        return "Student(name = {}, last_name = {}, tests_taken = {}".format(self.name, self.last_name,
                                                                            self.tests_taken)
