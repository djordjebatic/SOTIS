from app import db
from app.api.models.user import User


class Professor(db.Model):
    __tablename__ = 'professor'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    tests_created = db.relationship('TestModel', backref='professor', lazy=True)

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
            'tests_created': [test.json_format() for test in self.tests_created]
        }
