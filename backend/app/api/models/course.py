from app import db

courses_students = db.Table(
    'courses_students',
    db.Column('student_id', db.Integer(), db.ForeignKey('student.id')),
    db.Column('course_id', db.Integer(), db.ForeignKey('course.id'))
)

courses_professors = db.Table(
    'courses_professors',
    db.Column('professor_id', db.Integer(), db.ForeignKey('professor.id')),
    db.Column('course_id', db.Integer(), db.ForeignKey('course.id'))
)


class Course(db.Model):
    __tablename__ = 'course'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    tests = db.relationship('TestModel', backref='course', lazy=True)
    knowledge_spaces = db.relationship('KnowledgeSpace', backref='course', lazy='subquery')

    students = db.relationship(
        'Student',
        secondary=courses_students,
        backref=db.backref('courses', lazy='dynamic')
    )
    professors = db.relationship(
        'Professor',
        secondary=courses_professors,
        backref=db.backref('courses', lazy='dynamic')
    )

    def __init__(self, title):
        self.title = title

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
            'title': self.title,
            'tests': [test.json_format() for test in self.tests],
            'knowledge_spaces': [ks.json_format() for ks in self.knowledge_spaces],
            'students': [student.json_format() for student in self.students],
            'professors': [professor.json_format() for professor in self.professors]
        }
