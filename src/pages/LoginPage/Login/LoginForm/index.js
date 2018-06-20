import React from 'react'
import { connect } from 'react-redux'
import { REDUCER, submit } from 'ducks/login'
import { Form, Input, Button, Icon } from 'antd'

const FormItem = Form.Item

const mapStateToProps = (state, props) => ({
  isSubmitForm: state.app.submitForms[REDUCER],
})

@connect(mapStateToProps)
@Form.create()
class LoginForm extends React.Component {
  static defaultProps = {}

  // $FlowFixMe
  onSubmit = (isSubmitForm: ?boolean) => event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    if (!isSubmitForm) {
      form.validateFields((error, values) => {
        if (!error) {
          dispatch(submit(values))
        }
      })
    }
  }

  render() {
    const { form, isSubmitForm } = this.props

    return (
      <div className="cat__pages__login__block__form">
        <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
          <FormItem>
            {form.getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your e-mail address' }],
            })(
              <Input
                placeholder="Username"
                size="large"
                addonBefore={<Icon type="user" style={{ fontSize: 16 }} />}
              />,
            )}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('password', {
              initialValue: '123123',
              rules: [{ required: true, message: 'Please input your password' }],
            })(
              <Input
                placeholder="Password"
                size="large"
                type="password"
                addonBefore={<Icon type="key" style={{ fontSize: 16 }} />}
              />,
            )}
          </FormItem>
          <div className="form-actions">
            <Button
              type="primary"
              style={{ width: '100%' }}
              size="large"
              htmlType="submit"
              loading={isSubmitForm}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default LoginForm
