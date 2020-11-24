from init import db

questions_asked = db.Table('questions_asked',
                           db.Column('test_id', db.Integer, db.ForeignKey('test.id'), primary_key=True),
                           db.Column('question_id', db.Integer, db.ForeignKey('question.id'), primary_key=True))


class Model(db.Model):
    __tablename__ = 'test'

    id = db.Column(db.Integer, primary_key=True)
    date_taken = db.Column(db.DateTime)
    result = db.Column(db.Integer)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)
    questions_asked = db.relationship('Question', secondary=questions_asked, lazy='subquery',
                                      backref=db.backref('tests', lazy=True))

    def __repr__(self):
        return "Test(date_taken = {}, result = {}, professor_id = {}, questions_asked = {}".format(self.date_taken,
                                                                                                   self.result,
                                                                                                   self.professor_id,
                                                                                                   self.questions_asked)