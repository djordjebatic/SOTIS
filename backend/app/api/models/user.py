from app import db, bcrypt, app, jwt, login_manager
import datetime
from flask_security import UserMixin

roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user_table.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

class User(db.Model, UserMixin):

    __tablename__ = 'user_table'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(200), nullable=False)
    isAdmin = db.Column(db.Boolean, nullable=False, default=False)
    active = db.Column(db.Boolean, nullable=False, default=False)
    roles = db.relationship(
        'Role',
        secondary=roles_users,
        backref=db.backref('users', lazy='dynamic')
    )

    def __str__(self):
        return self.email

    def __init__(self, name, last_name, username, password, email, isAdmin=False):
        self.name = name
        self.last_name = last_name
        self.username = username
        self.password = password
        self.email = email
        self.active = True
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        object_id = self.id
        return str(object_id)

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
            'name': self.name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'role': self.roles[0].name
        }

    def get_security_payload(self):
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'role': self.roles[0].name
        }

    def add_role(self, role):
        self.roles.append(role)

    def add_roles(self, roles):
        for role in roles:
            self.add_role(role)

    def get_roles(self):
        for role in self.roles:
            yield role

    def encode_auth_token(self, username):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=5),
                'iat': datetime.datetime.utcnow(),
                'sub': username
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e
    
    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'