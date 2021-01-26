from app import app
from app.api.models.test_take_answer import TestTakeAnswer
from app.api.models.test_question_answer import TestQuestionAnswer
from app.api.models.test import TestModel
from app.api.models.test_take import TestTake
from app.api.models.test import TestModel
from app.api.models.test_question import TestQuestion
from app.api.models.course import Course
from app.api.models.problem_edge import KnowledgeSpace, Problem
from app.api.models.state_probability import StateProbability
from flask import request, send_file
from flask_restful import Resource
import random
from operator import attrgetter

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

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
            root.set("xsi:schemaLocatio",
                     "http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd")
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

                zip_file.writestr("questions/test" + str(test.id) + "-" + str(question.id) + ".xml",
                                  bio_question.getvalue())

            tree._setroot(root)
            tree.write(bio, encoding='UTF-8', xml_declaration=True)

            zip_file.writestr("test" + str(test.id) + ".xml", bio.getvalue())

        data.seek(0)

        return send_file(data, attachment_filename=test.title + '.zip', mimetype='application/zip', as_attachment=True)


class GuidedTestingAPI(Resource):
    def get(self, id):
        test_take = TestTake.query.get(id)
        test = TestModel.query.get(test_take.test_id)

        knowledge_space = KnowledgeSpace.query.filter_by(test_id=test_take.test_id, is_all_states=True).first()
        expected_ks = KnowledgeSpace.query.filter_by(test_id=test_take.test_id, is_all_states=False, is_real=False).first()
        if knowledge_space is None:
            if expected_ks is None or len(expected_ks.problems) < len(test.test_questions):
                return "Knowledge State not found", 404
            else:
                questions = sorted(test.test_questions, key=lambda question: question.position)
                question = questions[0]
        else:
            generate_probabilities(test_take, knowledge_space)
            all_state_probabilities = sorted(test_take.state_probabilities, key=lambda probability: probability.value, reverse=True)
            problem = Problem.query.get(all_state_probabilities[0].problem_id)
            if len(problem.questions) == 0:
                problem = Problem.query.get(all_state_probabilities[1].problem_id)
            questions_titles = problem.title.split(", ")
            question = find_next_question(test_take)
        for i in range(len(question.test_question_answers)):
            question.test_question_answers[i].isCorrect = 0
        ret = {
            "test_title": test.title,
            "question_number": 1,
            "question": question.json_format()
        }
        return ret, 200

    @jwt_required
    def post(self, id):

        test_take = TestTake.query.get(id)
        test = TestModel.query.get(test_take.test_id)

        data = request.get_json()
        answered_question = data['question']
        question_number = data['question_number']
        r = 1
        for answer in answered_question['test_question_answers']:
            test_take_answer = TestTakeAnswer(test_take_id=test_take.id, test_question_id=answered_question['id'],
                                              test_question_answer_id=answer['id'], selected=answer['isCorrect'],
                                              question_number=question_number)
            test_take_answer.insert()
            real_answer = TestQuestionAnswer.query.get(answer['id'])
            if real_answer.isCorrect != answer['isCorrect']:
                r = 0

        theta = 0.5
        states_probabilities = StateProbability.query.filter_by(test_take_id=test_take.id).all()
        question_title = answered_question['title']
        total_q = 0
        total_not_q = 0
        k_q = []
        k_not_q = []
        for probability in states_probabilities:
            problem = Problem.query.get(probability.problem_id)
            questions_titles = problem.title.split(", ")
            if question_title in questions_titles:
                total_q = total_q + probability.value
                k_q.append(probability)
            else:
                total_not_q = total_not_q + probability.value
                k_not_q.append(probability)
        for p in k_q:
            p.value = (1 - theta) * p.value + r*p.value/total_q
            p.update()
        for p in k_not_q:
            p.value = (1 - theta) * p.value + (1-r)*p.value/total_not_q
            p.update()
        # TODO provjeriti da li je kraj
        states_probabilities = StateProbability.query.filter_by(test_take_id=test_take.id).all()
        values = [pr.value for pr in states_probabilities]
        max_value = max(values)
        if max_value > 0.9:
            test_take.done = True
            test_take.update()
            ret = {
                "finished": True
            }
            return ret, 200
        # TODO ako nije, pronaci sledece pitanje
        question = find_next_question(test_take)
        if question is None:
            test_take.done = True
            test_take.update()
            ret = {
                "finished": True
            }
            return ret, 200

        for i in range(len(question.test_question_answers)):
            question.test_question_answers[i].isCorrect = 0
        ret = {
            "test_title": test.title,
            "question_number": question_number+1,
            "question": question.json_format()
        }
        return ret, 200


def generate_probabilities(test_take, knowledge_space):
    for problem in knowledge_space.problems:
        all_probabilities = StateProbability.query.filter_by(problem_id=problem.id).all()
        if len(all_probabilities) > 0:
            probabilities = [p.value for p in all_probabilities]
            p = sum(probabilities)/len(probabilities)
            new_state_probability = StateProbability(test_take_id=test_take.id, problem_id=problem.id, value=p)
            new_state_probability.insert()
        else:
            new_state_probability = StateProbability(test_take_id=test_take.id, problem_id=problem.id,
                                                     value=1 / len(knowledge_space.problems))
            new_state_probability.insert()


def find_next_question(test_take):
    test = TestModel.query.get(test_take.test_id)
    all_questions = test.test_questions
    test_take_answers = TestTakeAnswer.query.filter_by(test_take_id=test_take.id).all()
    finished_questions = [a.test_question_id for a in test_take_answers]
    remained = [question for question in all_questions if question.id not in finished_questions]
    if len(remained) == 0:
        return None
    min_value = 100
    min_list = []
    d = dict()
    all_states_probabilities = StateProbability.query.filter_by(test_take_id=test_take.id)
    for p in all_states_probabilities:
        problem = Problem.query.get(p.problem_id)
        question_titles = problem.title.split(", ")
        for q in question_titles:
            if q in d:
                d[q] = d[q] + p.value
            else:
                d[q] = 0
    for question in remained:
        quantity = abs(2*d[question.title] - 1)
        if quantity < min_value:
            min_list = [question]
            min_value = quantity
        elif quantity == min_value:
            min_list.append(question)
    if len(min_list) == 1:
        return min_list[0]
    question_index = random.randint(0, len(min_list)-1)
    return min_list[question_index]