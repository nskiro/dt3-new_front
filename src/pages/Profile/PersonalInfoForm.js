import React, { Component } from 'react'
import { Form, Input, Button, Card } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

@Form.create()
class PersonalInfoForm extends Component {
  render() {
    const { userInfo } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    return (
      <Card title="Change Password" style={{ width: '95%', display: 'block', margin: 'auto' }}>
        <Form layout="horizontal" onSubmit={this.props.onSubmit}>
          <FormItem label="" {...formItemLayout}>
            {getFieldDecorator('pId', {
              initialValue: userInfo._id,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem label="New Password" {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input new pasword!' },
                { min: 6, message: 'Password length must be greater than 5 characters' },
              ],
            })(<Input type="password" />)}
          </FormItem>
          <FormItem label="Confirm New Password" {...formItemLayout}>
            {getFieldDecorator('password2', {
              rules: [
                { required: true, message: 'Confirm your new password' },
                {
                  message: 'Password does not match!',
                  validator: (rule, value, cb) =>
                    value === getFieldValue('password') ? cb() : cb(true),
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout}>
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default PersonalInfoForm
