import React from 'react'
import { Row, Col } from 'antd'
import LoginForm from './LoginForm'
import LogoDT from '../../../images/Logo DT.png'
import LogoEB from '../../../images/Logo EB.png'

import './style.scss'

class Login extends React.Component {
  state = {}

  componentDidMount() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style.overflow = ''
  }

  render() {
    return (
      <div className="main-login main-login--fullscreen">
        <Row type="flex" justify="space-around" align="middle">
          <Col span={6}>
            <img
              src={LogoDT}
              alt="Ergo Baby"
              style={{ maxHeight: '156px', display: 'block', margin: 'auto' }}
            />
          </Col>
          <Col span={12}>
            <div className="login-form">
              <LoginForm email={this.state.restoredEmail} />
            </div>
          </Col>
          <Col span={6}>
            <img
              src={LogoEB}
              alt="Ergo Baby"
              style={{ maxHeight: '156px', display: 'block', margin: 'auto' }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Login
