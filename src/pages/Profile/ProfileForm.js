import React, { Component } from 'react'
import { Form, Button, Card, Row, Col, Upload, message } from 'antd'
import { connect } from 'react-redux'
import { setUserState } from 'ducks/app'
import PersonalInfoForm from './PersonalInfoForm'
import DeptInfoForm from './DeptInfoForm'
import config from '../../CommonConfig'
import axios from '../../axiosInst';


const { Meta } = Card
const mapStateToProps = ({ app }, props) => {
  const { userState } = app
  return {
    user: userState,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  updateUser: (user) => {
    dispatch(setUserState({ userState: { ...user } }))
    window.sessionStorage.setItem('app.User', JSON.stringify(user))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
class ProfileForm extends Component {
  changePassword = () => {
    this.personalInfoForm.validateFields((err, value) => {
      if (!err) {
        axios.put('/user/changepassword', value)
          .then((res) => {
            message.success('Your password has been changed!')
          })
          .catch((err) => {
            console.log(err)
          })

      }
    })
  }
  updateDeptNote = () => {
    this.deptInfoForm.validateFields((err, value) => {
      if (!err) {
        axios.put('/api/admin/dept/updateNote', value)
          .then((res) => {
            message.success('Update note complete')
            const temp = { ...this.props.user }
            temp.dept = { ...res.data }
            this.props.updateUser(temp);
          })
          .catch((err) => {
            console.log(err)
          })

      }
    })
  }
  render() {
    const { user } = this.props
    const { dept } = user
    return (
      <Row>
        <Col span={5}>
          <Card
            hoverable
            style={{ width: '90%', display: 'block', margin: 'auto' }}
            cover={
              <img alt="example" src={`data:${dept.avatar.mimetype};base64,${dept.avatar.data}`} />
            }
            actions={[
              <Upload
                name='avatar'
                action={`${config.baseURL}api/admin/dept/updateAvatar`}
                //showUploadList={false}
                data={dept}
                onChange={(info) => {
                  const res = info.file.response;
                  const status = info.file.status;
                  if (status === 'done') {
                    const temp = { ...user }
                    temp.dept = { ...res }
                    this.props.updateUser(temp);
                  }
                  else if (status === 'error') {
                    console.log(res);
                  }
                }}
              >
                <Button type="primary" icon="upload">Upload New Avatar</Button>
              </Upload>
            ]}
          >
            <Meta title={user.fullname} description={`Department: ${dept.name}`} />
          </Card>
        </Col>
        <Col span={11}>
          <DeptInfoForm
            ref={node => (this.deptInfoForm = node)}
            deptInfo={dept}
            onSubmit={this.updateDeptNote}
          />
        </Col>
        <Col span={8}>
          <PersonalInfoForm
            ref={node => (this.personalInfoForm = node)}
            userInfo={user}
            onSubmit={this.changePassword} />
        </Col>
      </Row>
    )
  }
}

export default ProfileForm
