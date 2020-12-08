import React from 'react'
import CIcon from '@coreui/icons-react'

const nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Admin',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
    {
    _tag: 'CSidebarNavItem',
    name: 'Label info',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-info'
    },
    label: true
  },
]

export default nav