import { createReducer } from 'redux-act'
import * as app from './app'
import { message } from 'antd'

export const REDUCER = 'login'

export const submit = ({ username, password }: { username: string, password: string }) => (
  dispatch: Function,
  getState: Function,
) => {
  dispatch(app.addSubmitForm(REDUCER))

  // let isLoggined = app.login(username, password, dispatch)
  // if (isLoggined) {
  //   dispatch(app.deleteSubmitForm(REDUCER))
  // } else {
  //   dispatch(app.deleteSubmitForm(REDUCER))
  //   message.error('Invalid username or password')
  // }
  app
    .login(username, password, dispatch)
    .then(value => {
      dispatch(app.deleteSubmitForm(REDUCER))
    })
    .catch(err => {
      dispatch(app.deleteSubmitForm(REDUCER))
      alert(err)
    })
}

const initialState = {}
export default createReducer({}, initialState)
