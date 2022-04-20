import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const authKey = sessionStorage.getItem("richform-key");
    const authValue = sessionStorage.getItem("richform-value");
    if (authKey == "" || authValue == "") console.warn("未定义token信息")
    else config.headers[authKey] = authValue
    return config;
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data, status } = response
    if (status != 200) {
      Message({ message: res.msg || 'Error', type: 'error', duration: 5 * 1000 })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
