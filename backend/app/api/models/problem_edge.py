from app import db


class KnowledgeSpace(db.Model):
    __tablename__ = 'knowledge_space'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    isReal = db.Column(db.Boolean, nullable=False)
    problems = db.relationship('Problem', backref='knowledge_space', lazy='subquery')
    edges = db.relationship('Edge', backref='knowledge_space', lazy='subquery')
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'), nullable=False)

    def __init__(self, title, test_id, isReal):
        self.title = title,
        self.test_id = test_id
        self.isReal = isReal

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
            "test_id": self.test_id,
            "problems": [problem.json_format() for problem in self.problems],
            "edges": [edge.json_format() for edge in self.edges],
            "isReal": self.isReal
        }


class Problem(db.Model):
    __tablename__ = 'problem'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    knowledge_space_id = db.Column(db.Integer, db.ForeignKey('knowledge_space.id'), nullable=False)
    #question = db.relationship('TestQuestion', backref='problem', lazy='subquery')
    test_question_id = db.Column(db.Integer, db.ForeignKey('test_question.id'), nullable=False)

    def __init__(self, title, knowledge_space_id, x, y, test_question_id):
        self.title = title
        self.knowledge_space_id = knowledge_space_id
        self.x = x
        self.y = y
        self.test_question_id = test_question_id

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
            "upper_edge_ids": [x.higher_node.id for x in self.lower_edges],
            "lower_edge_ids": [x.lower_node.id for x in self.upper_edges],
            "x": self.x,
            "y": self.y,
            "knowledge_space_id": self.knowledge_space_id,
            "test_question_id": self.test_question_id
        }


class Edge(db.Model):
    __tablename__ = 'edge'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    knowledge_space_id = db.Column(db.Integer, db.ForeignKey('knowledge_space.id'), nullable=False)

    lower_id = db.Column(db.Integer, db.ForeignKey("problem.id"))

    higher_id = db.Column(db.Integer, db.ForeignKey("problem.id"))

    lower_node = db.relationship(
        Problem, primaryjoin=lower_id == Problem.id, backref="lower_edges"
    )

    higher_node = db.relationship(
        Problem, primaryjoin=higher_id == Problem.id, backref="upper_edges"
    )

    def __init__(self, n1, n2, knowledge_space_id):
        self.lower_node = n1
        self.higher_node = n2
        self.knowledge_space_id = knowledge_space_id

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
            "lower_id": self.lower_id,
            "higher_id": self.higher_id,
            "knowledge_space_id": self.knowledge_space_id
        }


if __name__ == '__main__':

    '''
    db.drop_all()
    db.create_all()

    p1 = Problem('Proba 1')
    p2 = Problem('Proba 2')
    p3 = Problem('Proba 3')
    p1.insert()
    p2.insert()

    e1 = Edge(p1, p2)
    e2 = Edge(p2, p3)
    e3 = Edge(p1, p3)
    e1.insert()
    e2.insert()
    e3.insert()

    print(p1.json_format())
    print(p2.json_format())
    print(p3.json_format())
    '''

