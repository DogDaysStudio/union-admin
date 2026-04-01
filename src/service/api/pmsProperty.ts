import http from '../service'

// 树形码表
export function pmsPropertyDicListTree(payload?: {dicType: any}) {
  return http.post<Res<SysDicVO[]>>('/pms/dic/list-tree', payload)
}

// 字典列表
export function pmsPropertyDicList(payload?: SysDicListDTO) {
  return http.post<Res<SysDicVO[]>>('/pms/dic/list', payload)
}

// 新增/修改字典
export function pmsPropertyDicUpsert(payload: Record<string, any>) {
  return http.post<Res<string>>('/pms/dic/upsert', payload)
}

// 字典详情
export function pmsPropertyDicGet(payload: Record<string, any>) {
  return http.post<Res<PairModel>>('/pms/dic/get', payload)
}

// 启用/禁用字典
export function pmsPropertyDicEnable(payload: Record<string, any>) {
  return http.post<Res<string>>('/pms/dic/enable', payload)
}

// 删除字典
export function pmsPropertyDicDelete(payload: Record<string, any>) {
  return http.post<Res<string>>('/pms/dic/delete', payload)
}

// 分组列表（含SOP模板）
export function pmsPropertyGroupList(payload?: Record<string, any>) {
  return http.post<Res<PmsSopGroupVO[]>>('/pms/sop-group/list', payload)
}

// 新建分组
export function pmsPropertyGroupUInsert(payload: PmsSopGroupInsertDTO) {
  return http.post<Res<string>>('/pms/sop-group/insert', payload)
}

// 删除分组
export function pmsPropertyGroupDelete(payload: Record<string, any>) {
  return http.post<Res<string>>('/pms/sop-group/delete', payload)
}

// 分组排序
export function pmsPropertyGroupSort(payload: {groupIds: string[]}) {
  return http.post<Res<string>>('/pms/sop-group/sort', payload)
}

// 移动SOP到目标分组
export function pmsPropertySopMove(payload: {sopId: string; targetGroupId: string}) {
  return http.post<Res<string>>('/pms/sop/move', payload)
}

// 新建SOP模板
export function pmsPropertySopTemplateInsert(payload: PmsSopTemplateInsertDTO) {
  return http.post<Res<string>>('/pms/sop/insert', payload)
}

// 删除SOP模板
export function pmsPropertySopTemplateDelete(payload: {sopId: string}) {
  return http.post<Res<string>>('/pms/sop/delete', payload)
}

// 复制SOP模板
export function pmsPropertySopTemplateCopy(payload: {sopId: string; targetGroupId: string}) {
  return http.post<Res<string>>('/pms/sop/copy', payload)
}

// 员工分页查询
export function pmsPropertyEmployeeList(payload?: PmsEmployeeListDTO) {
  return http.post<Res<PmsEmployeeVO[]>>('/pms/employee/list', payload)
}
