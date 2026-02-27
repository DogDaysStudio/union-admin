import type {AxiosRequestConfig} from 'axios'
import http from '../service'

// 省_市_区_商圈 | object:{pid:上级ID}
export function iamCommonAreaList(payload: {pid: any}) {
  return http.post<Res<PairModel[]>>('/iam/common/area/list', payload)
}
// 树形码表 | object:{dicType:字典类型}
export function iamCommonDicListTree(payload: {dicType: any}, config?: AxiosRequestConfig) {
  return http.post<Res<SysDicVO[]>>('/iam/common/dic/list-tree', payload, config)
}
