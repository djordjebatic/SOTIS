from app import db


class TestModel(db.Model):
    __tablename__ = 'test'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    max_score = db.Column(db.Integer)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)
    test_questions = db.relationship('TestQuestion', backref='test', lazy='subquery')
    test_takes = db.relationship('TestTake', backref='test', lazy='subquery')
    knowledge_spaces = db.relationship('KnowledgeSpace', backref='test', lazy='subquery')

    def __init__(self, title, max_score, professor_id):
        self.title = title
        self.max_score = max_score
        self.professor_id = professor_id

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
            "title": self.title,
            "max_score": self.max_score,
            "professor_id": self.professor_id,
            "test_questions": [test_question.json_format() for test_question in self.test_questions],
            "test_takes": [test_take.json_format() for test_take in self.test_takes]
        }
