import axios from 'axios'
import {enhance} from 'foca-axios'
import {baseUrl} from '@/common/config'
import {useUserStore} from '@/stores/user'
import {ElMessage} from 'element-plus'

const instance = axios.create({
  baseURL: baseUrl,
})

const http = enhance(instance, {
  getHttpStatus: (response: any) => response.data?.code,
})

http.interceptors.request.use(config => {
  const userStore = useUserStore()
  config.headers['union-auth'] = userStore.token
  return config
})

http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const status = error.response?.data?.code || error.response?.status

    const userStore = useUserStore()

    // 处理未授权错误，自动登出
    if (status === 401) {
      // 调用登出方法
      userStore.logout()

      // 显示错误信息
      ElMessage.error(
        `登录已过期，请重新登录${error.response?.data?.msg ? `: ${error.response?.data?.msg}` : ''}`
      )
    } else {
      ElMessage.error(error.response?.data?.msg || error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

export default http
