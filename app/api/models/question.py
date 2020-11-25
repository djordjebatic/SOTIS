from app import db


class Question(db.Model):
    __tablename__ = 'question'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    correct_answer_id = db.Column(db.Integer, nullable=False)
    answers = db.relationship('Answer', backref='question', lazy=True)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)

    def __repr__(self):
        return "Question(title = {}, correct_answer = {}, points = {}".format(self.title, self.correct_answer,
                                                                              self.points)