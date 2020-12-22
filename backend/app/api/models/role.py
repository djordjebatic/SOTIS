from app import db
from flask_security import RoleMixin

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    description = db.Column(db.String(255))

    def __init__(self, name, description):
        RoleMixin.__init__(self)
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_by_name(name):
        return Role.query.filter_by(name=name).first()
    
    def get_name(self):
        return self.name