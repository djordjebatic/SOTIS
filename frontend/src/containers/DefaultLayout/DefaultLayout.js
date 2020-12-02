import React, {Component, Suspense} from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import * as router from 'react-router-dom';
import "../../../node_modules/react-notifications/lib/notifications.css"
import "../../../node_modules/react-notifications/lib/Notifications.js"
import axios from 'axios';
import {
  Container, Modal, ModalBody, ModalFooter, Label,
  Button, Form, Input, InputGroup, FormText,
  InputGroupAddon, InputGroupText, Row, ModalHeader, Nav
} from 'reactstrap';
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'
import {SideNav,  Chevron} from 'react-side-nav'
import {NotificationContainer, NotificationManager} from 'react-notifications';

// sidebar nav config
import navigation from '../../_nav';
import adminnavigation from '../../nav_admin';
import studentnavigation from '../../nav_student';
import professornavigation from '../../nav_professor';
// routes config
import routes from '../../routes';
//import config from '../../config';
//import '../../scss/vendors/custom.css';
import '../../../node_modules/react-side-nav/dist/themes.css';
import '../../css/custom.css';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const url = (process.env.REACT_APP_DOMAIN) + ':' + (process.env.REACT_APP_PORT) + '/';
const NavLink = props => (<Link to={props.to} {...props}><i className={`fa ${props.icon}`} />{props.label}</Link>);


const menuItems = [
      { id: 11,
        label: 'New Test',
        link: '/newAd',
        icon: 'fa fa-book',
        class: '_2Vept undefined _VrCvP _3HbC6 _2Ll57 undefined'
      },
      { id: 12,
        label: 'Item 1.2',
        icon: 'fas fa-bullhorn',
        link: '/item12',
      },
];

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.navig = this.navig.bind(this);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  navig = () => {
    if (localStorage.getItem("role") === "ROLE_ADMIN") {
      return adminnavigation;
    }else if (localStorage.getItem("role") === "ROLE_STUDENT") {
      return studentnavigation;
    }else if (localStorage.getItem("role") === "ROLE_PROFESSOR") {
      return professornavigation;
    } else {
      return navigation;
    }

  }

  navBar = () => {
    let ret = (<Sidebar bgColor='black' isCollapsed={false}>
      <Suspense>
        {/*<SideNav items={this.navig()} {...this.props} router={router}/>*/}
        <SideNav
  items={menuItems}
  linkComponent={NavLink}
  chevronComponent={Chevron}
  iconComponent={Icon}
/>
      </Suspense>
    </Sidebar>);

    if (localStorage.getItem('role'))
      return ret;
    else
      return ret;
  };

  navBar = () => {
    let ret = (<Sidebar bgColor='black' isCollapsed={false}>
   
    <LogoText>Tests App</LogoText>
  {/*  <DropdownItem
      values={['First', 'Second', 'Third']}
      bgColor={'black'}>
      Menu
    </DropdownItem>
<Suspense>
        {<SideNav items={this.navig()} {...this.props} router={router}/>}
        <SideNav bgColor='black'
items={this.navig()} {...this.props} router={router}  linkComponent={NavLink}
  chevronComponent={Chevron}
  iconComponent={Icon}
  className = "default-theme side-nav-item level-0 _VrCvP _3HbC6 _2Ll57"
/>
      </Suspense>
    <Item bgColor='black'>
      <Icon><i className="fas fa-home"/></Icon>
      Home
    </Item>
  */}
    <Item bgColor='black' onClick={event => this.props.history.push('/students')}>
      <Icon><i class="fas fa-users"></i></Icon>
      Students
    </Item>
    <Item bgColor='black' onClick={event => this.props.history.push('/tests')}>
      <Icon><i className="fas fa-sitemap"/></Icon>
      Tests
    </Item>
    <Item bgColor='black' onClick={event => this.props.history.push('/newTest')}>
      <Icon><i className="far fa-plus-square"/></Icon>
      New test
    </Item>
    <InputItem type='text' placeholder={'Search...'}/>
  </Sidebar>);

    if (localStorage.getItem('role'))
      return ret;
    else
      return ret;
  };

  render() {
    return (
      <div>

        <div style={{display:"flex"}}>
          <aside style={{flex:"1"}} >{this.navBar()}</aside>
          <main style={{flex:"6", margin:"20px", minHeight:"100%"}}>
            <br></br>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route 
                             key={idx}
                             path={route.path}
                             exact={route.exact}
                             name={route.name}
                             render={props => (
                               <route.component {...props} />
                               )}/>
                    ) : (null);
                  })}
                  <Redirect from="/" to="/"/>
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <NotificationContainer/>
      </div>
    );
  }
}

export default DefaultLayout;
