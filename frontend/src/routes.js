import { lazy } from 'react-router-guard';

const StudentsPage = lazy(() => import('./views/Pages/StudentsPage.js'));
const TestsPage = lazy(() => import('./views/Pages/TestsPage.js'));
const NewTest = lazy(() => import('./views/Pages/NewTest.js'));
const TakeTest = lazy(() => import('./views/Pages/TakeTest.js'));
const TestDone = lazy(() => import('./views/Pages/TestDone.js'));
const Login = lazy(() => import('./views/Pages/LoginAndRegistration/Login/Login.js'));
const Register = lazy(() => import('./views/Pages/LoginAndRegistration/Registration/Register.js'));
const Graph = lazy(() => import('./views/Pages/Graph/Graph.js'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

export default  [
 // { authorize: ["ROLE_ADMIN"], path: '/users', component: Comments },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/students', component: StudentsPage },
  { path: '/tests', component: TestsPage },
  { path: '/newTest', component: NewTest },
  { path: '/takeTest/:id', component: TakeTest },
  { path: '/testDone/:id', component: TestDone },
  { path: '/graph', component: Graph },
  //{ path: '/home', component: lazy(() => import('./containers/DefaultLayout')) },

];
