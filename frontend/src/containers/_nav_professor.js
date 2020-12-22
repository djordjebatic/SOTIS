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
    name: 'Tests',
    to: '/tests',
    icon: <CIcon name="cil-pencil" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Knowledge Spaces',
    to: '/knowledgeSpace',
    icon: <CIcon name="cil-bookmark" customClasses="c-sidebar-nav-icon"/>
  }
]
export default nav