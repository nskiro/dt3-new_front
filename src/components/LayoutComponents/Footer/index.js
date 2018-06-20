import React from 'react'
import { Button } from 'antd'
import './style.scss'

class AppFooter extends React.Component {
  render() {
    return (
      <div className="footer">© {new Date().getFullYear()} Duc Thanh 3. All rights reserved</div>
    )
  }
}

export default AppFooter
