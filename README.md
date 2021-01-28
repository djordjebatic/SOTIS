# SOTIS

## Features

* Login and Registration.
* Creation of tests with multiple choice questions in regular of guided fashion.
* Creation of knowledge space in form of directed acyclic graph where nodes represent problems in created domain and edges dependencies between them.
  Each test is assigned with a corresponding knowledge space where each question belongs to a single problem in the domain.
* Creation of real knowledge space based on students answers using IITA algorithm.
* Visualisation of knowledge space as well as representation of visual and quantitative differences between real and assumed knowledge space.

## Project Setup

Project is realized using the following technologies: Flask, React and PostgreSQL. These instructions will get you a copy of the project up and running on your local machine.

1. Clone the repository.
```
git clone https://github.com/djordjebatic/SOTIS
```
2. Install react dependencies
```
cd frontend
npm install
```
3. Install python packages
```
cd backend
pip install -r requirements.txt
```
4. Run flask and react projects


## Authors
* Milica Skipina
* Djordje Batic
