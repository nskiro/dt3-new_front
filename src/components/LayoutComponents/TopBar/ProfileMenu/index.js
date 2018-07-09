import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'ducks/app'
import { Menu, Dropdown, Avatar } from 'antd'

const mapDispatchToProps = dispatch => ({
  logout: event => {
    event.preventDefault()
    dispatch(logout())
  },
})

const mapStateToProps = (state, props) => ({
  userState: state.app.userState,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class ProfileMenu extends React.Component {
  state = {
    count: 7,
  }

  addCount = () => {
    this.setState({
      count: this.state.count + 1,
    })
  }

  render() {
    const { count } = this.state
    const { userState, logout } = this.props
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <div className="rfq__widget__system-status__item">
            <strong>Hello, {userState.fullname}</strong>
            <div>Dept: {userState.dept.name}</div>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="#/profile">
            <i className="topbar__dropdownMenuIcon icmn-user" /> Edit Profile
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript: void(0);" onClick={logout}>
            <i className="topbar__dropdownMenuIcon icmn-exit" /> Logout
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="topbar__dropdown d-inline-block">
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomLeft"
          onVisibleChange={this.addCount}
        >
          <a className="ant-dropdown-link" href="#">
            <Avatar className="topbar__avatar" shape="square" size="large" icon="user" />
          </a>
        </Dropdown>
      </div>
    )
  }
}

export default ProfileMenu
