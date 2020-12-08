from app import db


class Problem(db.Model):
    __tablename__ = 'problem'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)

    def __init__(self, title):
        self.title = title

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
            'title': self.title,
            'higher_edge_ids': [x.higher_node.id for x in self.lower_edges],
            'lower_edge_ids': [x.lower_node.id for x in self.higher_edges]
        }


class Edge(db.Model):
    __tablename__ = 'edge'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    lower_id = db.Column(db.Integer, db.ForeignKey("problem.id"))

    higher_id = db.Column(db.Integer, db.ForeignKey("problem.id"))

    lower_node = db.relationship(
        Problem, primaryjoin=lower_id == Problem.id, backref="lower_edges"
    )

    higher_node = db.relationship(
        Problem, primaryjoin=higher_id == Problem.id, backref="higher_edges"
    )

    def __init__(self, n1, n2):
        self.lower_node = n1
        self.higher_node = n2

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
            'lower_id': self.lower_id,
            'higher_id': self.higher_id
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

