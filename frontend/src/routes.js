import React from 'react';

const StudentsPage = React.lazy(() => import('./views/pages/StudentsPage'))
const TestsPage = React.lazy(() => import('./views/pages/TestsPage'))
const NewTest = React.lazy(() => import('./views/pages/NewTest'))
const TakeTest = React.lazy(() => import('./views/pages/TakeTest'))
const TestPage = React.lazy(() => import('./views/pages/TestPage'))
const Graph = React.lazy(() => import('./views/pages/Graph/Graph.js'));
const KnowledgeSpace = React.lazy(() => import('./views/pages/KnowledgeSpace/KnowledgeSpace.js'));
const Profile = React.lazy(() => import('./views/pages/Profile/Profile.js'));
const ProfessorsPage = React.lazy(() => import('./views/pages/Professors/Professors.js'));
const Courses = React.lazy(() => import('./views/pages/Courses/Courses.js'));
const CoursePage = React.lazy(() => import('./views/pages/Courses/CoursePage.js'));
const ShowTest = React.lazy(() => import('./views/pages/Test/ShowTest.js'));
const StudentTests = React.lazy(() => import('./views/pages/Test/StudentTests.js'));

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },

  { path: '/students', exact:true, name: 'Students', component: StudentsPage},
  { path: '/tests', exact:true, name: 'Tests', component: TestsPage},
  { path: '/tests/newTest', exact:true, name: 'New Test', component: NewTest},
  { path: '/knowledgeSpace/:id', exact: true, name: 'Graph', component: Graph },
  { path: '/knowledgeSpace', exact: true, name: 'Knowledge Spaces', component: KnowledgeSpace },
  { path: '/tests/takeTest/:id', exact:true, name: 'Test', component: TakeTest},
  { path: '/tests/test/:id', exact:true, name: 'Test', component: TestPage},
  { path: '/profile', exact:true, name: 'Profile', component: Profile},
  { path: '/professors', exact:true, name: 'Professors', component: ProfessorsPage},
  { path: '/courses', exact:true, name: 'Courses', component: Courses},
  { path: '/courses/:id', exact:true, name: 'Course Details', component: CoursePage},
  { path: '/test/:id', exact:true, name: 'Test Details', component: ShowTest},
  { path: '/student/tests', exact: true, name: "Tests", component:StudentTests}

];

export default routes;
