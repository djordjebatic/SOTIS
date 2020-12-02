import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout/DefaultLayout.js'));
const StudentsPage = React.lazy(() => import('./views/Pages/StudentsPage.js'));


ReactDOM.render(
<BrowserRouter>
<React.Suspense fallback={loading()}>
    <Switch>
      <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
      <Redirect to="/students" />
    </Switch>
    </React.Suspense>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
