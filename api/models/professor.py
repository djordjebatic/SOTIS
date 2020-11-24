from init import db


class Professor(db.Model):
    __tablename__ = 'professor'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    tests_created = db.relationship('Test', backref='professor', lazy=True)

    def __repr__(self):
        return "Professor(name = {}, last_name = {}, tests_created = {}".format(self.name, self.last_name,
                                                                                self.tests_created)
