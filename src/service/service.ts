import axios from 'axios'
import {enhance} from 'foca-axios'
import {baseUrl} from '@/common/config'

const http = axios.create({
  baseURL: baseUrl,
})

export default enhance(http, {
  getHttpStatus: (response: any) => response.data?.code,
})
