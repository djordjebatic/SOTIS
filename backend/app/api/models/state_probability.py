from app import db


class StateProbability(db.Model):
    __tablename__ = 'state_probability'

    id = db.Column(db.Integer, primary_key=True)
    test_take_id = db.Column(db.Integer, db.ForeignKey('test_take.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    value = db.Column(db.Float, nullable=False)

    def __init__(self, test_take_id, problem_id, value):
        self.test_take_id = test_take_id
        self.problem_id = problem_id
        self.value = value

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
            "problem_id": self.problem_id,
            "value": self.value
        }

