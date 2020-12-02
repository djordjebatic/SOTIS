import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle,
  NavbarBrand, Nav, NavItem
} from 'reactstrap';
import PropTypes from 'prop-types';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Tests </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none" hidden={!(localStorage.getItem("role") === "ROLE_CUSTOMER")}>
            <NavLink to="/basket" className="nav-link"><i className="icon-basket-loaded"></i></NavLink>
          </NavItem>
          <NavbarBrand className="d-md-down-none" onClick={this.props.onLogin} hidden={localStorage.getItem("ulogovan")}>
            <i className="icon-list"></i>Log in
        </NavbarBrand>
          <NavItem className="d-md-down-none" hidden={localStorage.getItem("ulogovan")}>
            <NavLink to="/register" className="nav-link"><i className="icon-bell"></i>Register</NavLink>
          </NavItem>


          <UncontrolledDropdown nav direction="down" hidden={!localStorage.getItem("ulogovan")}>
            <DropdownToggle nav>
              <i className="icon-user icons font-2xl d-block"></i>
            </DropdownToggle>
            <DropdownMenu right>
            <DropdownItem>
                <NavLink to="/profile" style={{color:"black"}} className="nav-link"><i style={{color:"black"}} className="fa fa-user-circle"></i>Profile</NavLink>
                </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i style={{ color: "black" }} className="fa fa-lock"></i> Logout
                </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
