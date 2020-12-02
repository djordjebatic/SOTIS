import { lazy } from 'react-router-guard';

const StudentsPage = lazy(() => import('./views/Pages/StudentsPage.js'));
const TestsPage = lazy(() => import('./views/Pages/TestsPage.js'));
const NewTest = lazy(() => import('./views/Pages/NewTest.js'));
const TakeTest = lazy(() => import('./views/Pages/TakeTest.js'));
const TestDone = lazy(() => import('./views/Pages/TestDone.js'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

export default  [
 // { authorize: ["ROLE_ADMIN"], path: '/users', component: Comments },
  { path: '/students', component: StudentsPage },
  { path: '/tests', component: TestsPage },
  { path: '/newTest', component: NewTest },
  { path: '/takeTest/:id', component: TakeTest },
  { path: '/testDone/:id', component: TestDone },

  //{ path: '/register', component: Register },
  //{ path: '/home', component: lazy(() => import('./containers/DefaultLayout')) },

];
