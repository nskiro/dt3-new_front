import {
  createAction,
  createReducer
} from 'redux-act'
import {
  push
} from 'react-router-redux'
import {
  pendingTask,
  begin,
  end
} from 'react-redux-spinner'
import {
  notification
} from 'antd'
import axios from '../axiosInst'
import _ from 'lodash'

const REDUCER = 'app'
const NS = `@@${REDUCER}/`

const _setFrom = createAction(`${NS}SET_FROM`)
const _setLoading = createAction(`${NS}SET_LOADING`)
const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`)

export const setUserState = createAction(`${NS}SET_USER_STATE`)
export const setUpdatingContent = createAction(`${NS}SET_UPDATING_CONTENT`)
export const setActiveDialog = createAction(`${NS}SET_ACTIVE_DIALOG`)
export const deleteDialogForm = createAction(`${NS}DELETE_DIALOG_FORM`)
export const addSubmitForm = createAction(`${NS}ADD_SUBMIT_FORM`)
export const deleteSubmitForm = createAction(`${NS}DELETE_SUBMIT_FORM`)
export const setLayoutState = createAction(`${NS}SET_LAYOUT_STATE`)

export const setLoading = isLoading => {
  const action = _setLoading(isLoading)
  action[pendingTask] = isLoading ? begin : end
  return action
}

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState()
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(_setHideLogin(false))
  }
  return Promise.resolve()
}

export const initAuth = roles => async (dispatch, getState) => {
  // Use Axios there to get User Data by Auth Token with Bearer Method Authentication
  const state = getState()

  const res = await axios.get('/user/getUserInfo')
  if (res.data) {
    dispatch(
      setUserState({
        userState: {
          ...res.data,
        },
      }),
    )
    const compareRole = _.intersection(roles, res.data.role)
    if (compareRole.length === 0) {
      if (!(state.routing.location.pathname === '/')) {
        dispatch(push('/'))
      }
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }
  const location = state.routing.location
  const from = location.pathname + location.search
  dispatch(_setFrom(from))
  dispatch(push('/login'))
  return Promise.reject()
}

export async function login(username, password, dispatch) {
  // Use Axios there to get User Auth Token with Basic Method Authentication
  try {
    const res = await axios.post('/user/login', {
      username: username,
      password: password
    })
    if (res.data) {
      window.localStorage.setItem('app.Authorization', 'Bearer ' + res.data)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data
      dispatch(_setHideLogin(true))
      dispatch(push('/'))
      return true
    }
    dispatch(push('/login'))
    dispatch(_setFrom(''))

    return false
  } catch (err) {
    console.log(err)
  }
}
export const logout = () => (dispatch, getState) => {
  dispatch(
    setUserState({
      userState: {
        _id: '',
        username: '',
        fullname: '',
        dept: '',
        role: [],
        create_date: null,
        update_date: null,
        last_login: null
      }
    }),
  )
  window.localStorage.removeItem('app.Authorization', '')
  dispatch(push('/login'))
}

const initialState = {
  // APP STATE
  from: '',
  isUpdatingContent: false,
  isLoading: false,
  activeDialog: '',
  dialogForms: {},
  submitForms: {},
  isHideLogin: false,

  // LAYOUT STATE
  layoutState: {
    isMenuTop: true,
    menuMobileOpened: false,
    menuCollapsed: false,
    menuShadow: true,
    themeLight: true,
    squaredBorders: false,
    borderLess: true,
    fixedWidth: false,
    settingsOpened: false,
  },

  // USER STATE
  userState: {
    _id: '',
    username: '',
    fullname: '',
    dept: '',
    role: [],
    create_date: null,
    update_date: null,
    last_login: null
  }
}

export default createReducer({
    [_setFrom]: (state, from) => ({ ...state,
      from
    }),
    [_setLoading]: (state, isLoading) => ({ ...state,
      isLoading
    }),
    [_setHideLogin]: (state, isHideLogin) => ({ ...state,
      isHideLogin
    }),
    [setUpdatingContent]: (state, isUpdatingContent) => ({ ...state,
      isUpdatingContent
    }),
    [setUserState]: (state, {
      userState
    }) => ({ ...state,
      userState
    }),
    [setLayoutState]: (state, param) => {
      const layoutState = { ...state.layoutState,
        ...param
      }
      const newState = { ...state,
        layoutState
      }
      window.localStorage.setItem('app.layoutState', JSON.stringify(newState.layoutState))
      return newState
    },
    [setActiveDialog]: (state, activeDialog) => {
      const result = { ...state,
        activeDialog
      }
      if (activeDialog !== '') {
        const id = activeDialog
        result.dialogForms = { ...state.dialogForms,
          [id]: true
        }
      }
      return result
    },
    [deleteDialogForm]: (state, id) => {
      const dialogForms = { ...state.dialogForms
      }
      delete dialogForms[id]
      return { ...state,
        dialogForms
      }
    },
    [addSubmitForm]: (state, id) => {
      const submitForms = { ...state.submitForms,
        [id]: true
      }
      return { ...state,
        submitForms
      }
    },
    [deleteSubmitForm]: (state, id) => {
      const submitForms = { ...state.submitForms
      }
      delete submitForms[id]
      return { ...state,
        submitForms
      }
    },
  },
  initialState,
)