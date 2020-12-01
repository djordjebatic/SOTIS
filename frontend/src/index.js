import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import StudentsPage from "./views/Pages/StudentsPage.js"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

ReactDOM.render(
<BrowserRouter>
    <Switch>
      <Route
        path="/students"
        render={props => <StudentsPage {...props} />}
      />
      <Redirect to="/students" />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
