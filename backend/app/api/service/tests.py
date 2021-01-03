from app import app
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test import TestModel
from app.api.models.course import Course
from flask import request
from flask_restful import Resource


class GetTestAPI(Resource):
    def get(self, test_id):
        test = TestModel.query.get(int(test_id))
        return test.json_format(), 200


class GetTestTakeAPI(Resource):
    def get(self, test_id):
        test = TestModel.query.get(int(test_id))
        return [test_take.json_format() for test_take in test.test_takes], 200


class TestStudentsAPI(Resource):
    def get(self, test_id):
        test = TestModel.query.get(test_id)
        course = Course.query.get(test.course_id)
        return [student.json_format() for student in course.students], 200
