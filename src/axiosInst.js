import axios from 'axios'

const port = window.location.hostname === 'ducthanh3.com.vn' ? 5500 : 5000

const axiosInst = axios.create({
  baseURL: window.location.protocol + '//' + window.location.hostname + ':' + port + '/',
})

axiosInst.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//axiosInst.defaults.headers.common['Authorization'] = window.localStorage.getItem('app.User') !== null ? 'Bearer ' + JSON.parse(window.sessionStorage.getItem('app.User')).token : null

export default axiosInst
