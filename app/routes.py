from app import app
from app.api.models.student import Student

@app.route('/')
@app.route('/index')
def index():
    return "Hello World!"

@app.route('/student', methods=['POST', 'GET'])
def handle_students():
    students = Student.query.all()
    result = [
        {
        "id": student.id,
        "name": student.name,
        "last_name":student.last_name
        } for student in students
    ]
    return {"students": result}