from app import db


class TestModel(db.Model):
    __tablename__ = 'test'

    id = db.Column(db.Integer, primary_key=True)
    date_taken = db.Column(db.DateTime)
    result = db.Column(db.Integer)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)
    test_take = db.relationship('TestTake', backref='test', lazy=True)
    test_question = db.relationship('TestQuestion', backref='test', lazy=True)

    def __repr__(self):
        return "Test(date_taken = {}, result = {}, professor_id = {}, test_take = {}".format(self.date_taken,
                                                                                                   self.result,
                                                                                                   self.professor_id,
                                                                                                   self.test_take)