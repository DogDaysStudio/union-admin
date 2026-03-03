import http from '../service'

// 日志列表
export function iamSysActionLogList(payload: SysActionLogListDTO) {
  return http.post<Res<SysActionLogVO[]>>('/iam/sys-action-log/list', payload)
}

// 清空日志
export function iamSysActionLogClear(payload: SysActionLogListDTO) {
  return http.post<Res<Record<string, any>>>('/iam/sys-action-log/clear', payload)
}
