import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

import {NotificationContainer} from 'react-notifications';

import 'react-notifications/lib/notifications.css';

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
      <NotificationContainer/>
    </div>
  )
}

export default TheLayout
