import axios from 'axios'
import {enhance} from 'foca-axios'
import {baseUrl} from '@/common/config'
import {useUserStore} from '@/stores/user'
import {ElMessage} from 'element-plus'

const instance = axios.create({
  baseURL: baseUrl,
})

export const createHeaders = () => {
  const userStore = useUserStore()
  return {
    'union-auth': userStore.token,
  }
}

const http = enhance(instance, {
  getHttpStatus: (response: any) => response.data?.code,
})

http.interceptors.request.use(config => {
  Object.assign(config.headers, createHeaders())
  if (config.method === 'post' && !config.data) {
    config.data = {}
  }
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
    if ([401, 402, 403].includes(status)) {
      // 调用登出方法
      userStore.logout()

      // 显示错误信息
      if (error.response?.config?.showError !== false) {
        ElMessage.error(
          `登录已过期，请重新登录${error.response?.data?.msg ? `: ${error.response?.data?.msg}` : ''}`
        )
      }
    } else {
      // 显示错误信息
      if (error.response?.config?.showError !== false) {
        ElMessage.error(error.response?.data?.msg || error.message || '请求失败')
      }
    }

    return Promise.reject(error)
  }
)

export default http
