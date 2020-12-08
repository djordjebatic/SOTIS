import React from 'react'
import CIcon from '@coreui/icons-react'

const nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Student',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
 
]

export default nav