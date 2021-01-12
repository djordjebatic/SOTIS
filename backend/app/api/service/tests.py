from app import app
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test_take import TestTake
from app.api.models.test import TestModel
from app.api.models.course import Course
from flask import request, send_file
from flask_restful import Resource

import zipfile
from io import BytesIO
import xml.etree.cElementTree as ET


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


class TestAPI(Resource):
    def get(self, id):
        test = TestModel.query.get(int(id))
        questions = test.test_questions
        for i in range(len(questions)):
            question_answers = test.test_questions[i].test_question_answers
            for j in range(len(question_answers)):
                test.test_questions[i].test_question_answers[j].isCorrect = 0

        return test.json_format(), 200

    def put(self, id):
        data = request.get_json()
        students = data['students']
        for student in students:
            new_testTake = TestTake(test_id=id, student_id=student['id'], score=0)
            new_testTake.insert()
        test = TestModel.query.get(int(id))
        questions = test.test_questions
        for i in range(len(questions)):
            question_answers = test.test_questions[i].test_question_answers
            for j in range(len(question_answers)):
                test.test_questions[i].test_question_answers[j].isCorrect = 0

        return test.json_format(), 200


class QTITestAPI(Resource):
    def post(self, id):
        test = TestModel.query.get(id)

        if not test:
            return 'error', 404

        data = BytesIO()

        with zipfile.ZipFile(data, 'w') as zip_file:

            tree = ET.ElementTree()
            bio = BytesIO()

            root = ET.Element("qti-assessment-test")
            root.set("xmlns", "http://www.imsglobal.org/xsd/imsqtiasi_v3p0")
            root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
            root.set("xsi:schemaLocatio", "http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd")
            root.set("identifier", str(test.id))
            root.set("title", test.title)

            test_items = ET.SubElement(root, "qti-assessment-items")

            for question in test.test_questions:

                tree_question = ET.ElementTree()
                bio_question = BytesIO()

                question_item = ET.SubElement(test_items, "qti-assessment-item")
                question_item.set("xmlns", "http://www.imsglobal.org/xsd/imsqtiasi_v3p0")
                question_item.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
                question_item.set("identifier", str(question.id))
                question_item.set("title", question.title)
                question_item.set("adaptive", "false")
                question_item.set("time-dependent", "false")

                question_response = ET.SubElement(question_item, "qti-response-declaration")
                question_response.set("identifier", "RESPONSE")
                question_response.set("cardinality", "single")
                question_response.set("base-type", "identifier")

                question_response_correct = ET.SubElement(question_response, "qti-correct-response")
                question_response_correct_value = ET.SubElement(question_response_correct, "qti-value")

                possible_answers = TestQuestionAnswer.query.filter(TestQuestionAnswer.question_id == question.id).all()

                for answer in possible_answers:
                    if answer.isCorrect:
                        question_response_correct_value.text = str(answer.id)

                question_outcome = ET.SubElement(question_item, "qti-outcome-declaration")
                question_outcome.set("identifier", "SCORE")
                question_outcome.set("cardinality", "single")
                question_outcome.set("base-type", "float")

                question_body = ET.SubElement(question_item, "qti-item-body")

                question_interaction = ET.SubElement(question_body, "qti-choice-interaction")
                question_interaction.set("response-identifier", "RESPONSE")
                question_interaction.set("shuffle", "true")
                question_interaction.set("max-choices", "0")

                question_prompt = ET.SubElement(question_interaction, "qti-prompt")
                question_prompt.text = question.title

                for answer in possible_answers:
                    question_answer = ET.SubElement(question_interaction, "qti-simple-choice")
                    question_answer.set("identifier", str(answer.id))
                    question_answer.set("fixed", "false")
                    question_answer.text = answer.title

                question_proccesing = ET.SubElement(question_item, "qti-response-processing")
                question_proccesing.set("template", "")

                tree_question._setroot(question_item)
                tree_question.write(bio_question, encoding='UTF-8', xml_declaration=True)

                zip_file.writestr("questions/test" + str(test.id) + "-" + str(question.id) + ".xml", bio_question.getvalue())

            tree._setroot(root)
            tree.write(bio, encoding='UTF-8', xml_declaration=True)

            zip_file.writestr("test" + str(test.id) + ".xml", bio.getvalue())

        data.seek(0)

        return send_file(data, attachment_filename=test.title + '.zip', mimetype='application/zip', as_attachment=True)