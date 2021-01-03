import React from 'react'
import CIcon from '@coreui/icons-react'

const nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Students',
    to: '/students',
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Courses',
    to: '/courses',
    icon: <CIcon name="cil-grid" customClasses="c-sidebar-nav-icon"/>
  },
]
export default nav