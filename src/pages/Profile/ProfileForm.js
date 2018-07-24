import React, { Component } from 'react'
import { Form, Button, Card, Row, Col, Upload, message, Select } from 'antd'
import { connect } from 'react-redux'
import { setUserState } from 'ducks/app'
import CustomCard from 'components/LayoutComponents/CustomCard'
import PersonalInfoForm from './PersonalInfoForm'
import DeptInfoForm from './DeptInfoForm'
import config from '../../CommonConfig'
import axios from '../../axiosInst'
import _ from 'lodash'

const { Meta } = Card
const { Option } = Select
const mapStateToProps = ({ app }, props) => {
  const { userState } = app
  return {
    user: userState,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  updateUser: user => {
    dispatch(setUserState({ userState: { ...user } }))
    window.sessionStorage.setItem('app.User', JSON.stringify(user))
  },
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@Form.create()
class ProfileForm extends Component {

  state = {
    selectedDept: null
  }

  changePassword = e => {
    e.preventDefault()
    this.personalInfoForm.validateFields((err, value) => {
      if (!err) {
        axios
          .put('/user/changepassword', value)
          .then(res => {
            message.success('Your password has been changed!')
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }
  updateDeptNote = e => {
    e.preventDefault()
    this.deptInfoForm.validateFields((err, value) => {
      if (!err) {
        axios
          .put('/api/admin/dept/updateNote', value)
          .then(res => {
            message.success('Update note complete')
            const temp = { ...this.props.user }
            temp.dept.slice(_.findIndex(temp.dept, obj => obj._id === res.data._id), 1, {...res.data})
            this.props.updateUser(temp)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }
  onSelectDept = value => {
    axios.get('/api/admin/dept', {params: {id: value}})
    .then(res => {
      this.setState({selectedDept: res.data[0]})
    })
  }

  render() {
    const { selectedDept } = this.state
    const { user } = this.props
    const { dept } = user
    return (
      <div>
        <Row>
          <Col span={5}>
            <Select style={{width: '100%'}} onChange={this.onSelectDept}>
              {
                dept.length ? dept.map(obj => {
                  return <Option key={obj._id} value={obj._id}>{obj.name}</Option>
                }) : null
              }
            </Select>
          </Col>
        </Row>
        <Row>
        <Col span={5}>
          <CustomCard title="Department Avatar">
            <Card
              hoverable
              style={{ width: '90%', display: 'block', margin: 'auto' }}
              cover={
                selectedDept ? (
                <img
                  alt="example"
                  src={`data:${selectedDept.avatar.mimetype};base64,${selectedDept.avatar.data}`}
                />
                ) : null
              }
              actions={[
                <Upload
                  name="avatar"
                  action={`${config.baseURL}api/admin/dept/updateAvatar`}
                  //showUploadList={false}
                  data={selectedDept}
                  onChange={info => {
                    const res = info.file.response
                    const status = info.file.status
                    if (status === 'done') {
                      const temp = { ...user }
                      temp.dept = { ...res }
                      this.props.updateUser(temp)
                    } else if (status === 'error') {
                      console.log(res)
                    }
                  }}
                >
                  <Button type="primary" icon="upload">
                    Upload New Avatar
                  </Button>
                </Upload>,
              ]}
            >
              <Meta title={user.fullname} description={selectedDept ? `Department: ${selectedDept.name}` : ''} />
            </Card>
          </CustomCard>
        </Col>
        <Col span={11}>
          <CustomCard title="Note">
          {selectedDept ? (
              <DeptInfoForm
                ref={node => (this.deptInfoForm = node)}
                deptInfo={selectedDept}
                onSubmit={this.updateDeptNote}
                key={selectedDept._id}
              />
            ) : null 
          }
          </CustomCard>
        </Col>
        <Col span={8}>
          <CustomCard title="Change Account Password">
          {selectedDept ? (
              <PersonalInfoForm
                ref={node => (this.personalInfoForm = node)}
                userInfo={user}
                onSubmit={this.changePassword}
            /> ) : null
          }
          </CustomCard>
        </Col>
      </Row>
      </div>
    )
  }
}

export default ProfileForm
