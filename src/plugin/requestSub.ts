import axios from 'axios'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'

const API_URL: string | undefined = import.meta.env.VITE_URL_API_WBE_BEAUTY_BOX

const requestSub = axios.create({
  baseURL: API_URL,
  withCredentials: false
})

requestSub.defaults.headers.put['Content-Type'] = 'application/json'

const token = Cookies.get('access_token')
requestSub.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : ''

requestSub.interceptors.request.use(request => request)

requestSub.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const { _config, data, status } = error.response

    if (status === 400) {
      ElMessage.error({ message: `Error: ${data.message || 'Bad Request'}`, duration: 5000 })
    }
    if (!error.response || error.response.status >= 500) {
      ElMessage.error({ message: 'Internal Server Error', duration: 5000 })
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default requestSub
