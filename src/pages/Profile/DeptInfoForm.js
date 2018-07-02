import React, { Component } from 'react'
import { Form, Input, Button, Card } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const { TextArea } = Input

@Form.create()
class DeptInfoForm extends Component {
  render() {
    const { deptInfo } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Card title="Department Note" style={{ width: '95%', display: 'block', margin: 'auto' }}>
        <Form layout="horizontal" onSubmit={this.props.onSubmit}>
          <FormItem label="" {...formItemLayout}>
            {getFieldDecorator('dId', {
              initialValue: deptInfo._id,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem label="Note" {...formItemLayout}>
            {getFieldDecorator('note', {
              initialValue: deptInfo.note,
            })(<TextArea rows={13} />)}
          </FormItem>
          <FormItem {...formItemLayout}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default DeptInfoForm
