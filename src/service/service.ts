import axios from 'axios'
import {enhance} from 'foca-axios'
import {baseUrl} from '@/common/config'
import {useUserStore} from '@/stores/user'

const instance = axios.create({
  baseURL: baseUrl,
})

const http = enhance(instance, {
  getHttpStatus: (response: any) => response.data?.code,
})

http.interceptors.request.use(config => {
  config.headers['token'] = useUserStore().token
  return config
})

http.interceptors.response.use(response => {
  return response
})

export default http
