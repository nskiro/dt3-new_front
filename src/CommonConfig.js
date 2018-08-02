const port = window.location.hostname === 'ducthanh3.com.vn' ? 5500 : 5000

const commonConfig = {
  baseURL: window.location.protocol + '//' + window.location.hostname + ':' + port + '/',
}

export default commonConfig
