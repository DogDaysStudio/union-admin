import http from '../service'

// 树形码表
export function pmsPropertyDicListTree(payload?: {dicType: any}) {
  return http.post<Res<SysDicVO[]>>('/common/dic/list-tree', payload)
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

// 按分组名称模糊搜索 | object:{groupName:关键词}，为空则返回全部（同列表）
export function pmsPmsSopGroupSearch(payload?: Record<string, any>) {
  return http.post<Res<PmsSopGroupVO[]>>('/pms/sop-group/search', payload)
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

// 批量删除SOP模板
export function pmsPmsSopCopy(payload: {sopIds: any; targetGroupId: any}) {
  return http.post<Res<string[]>>('/pms/sop/copy', payload)
}

// 查询SOP分类列表（含步骤数量）
export function pmsPropertySopCategoryList(payload: {sopId: string}) {
  return http.post<Res<PmsSopCategoryVO[]>>('/pms/sop-category/list', payload)
}

// 新建SOP分类
export function pmsPropertySopCategoryInsert(payload: PmsSopCategoryInsertDTO) {
  return http.post<Res<PmsSopCategoryVO>>('/pms/sop-category/insert', payload)
}

// 删除SOP分类
export function pmsPropertySopCategoryDelete(payload: {categoryId: string}) {
  return http.post<Res<string>>('/pms/sop-category/delete', payload)
}

// 查询步骤列表
export function pmsPropertySopStepList(payload: {sopId: string; categoryId: string}) {
  return http.post<Res<PmsSopStepVO[]>>('/pms/sop-step/list', payload)
}

// 步骤排序
export function pmsPropertySopStepSort(payload: {stepIds: string[]}) {
  return http.post<Res<string>>('/pms/sop-step/sort', payload)
}

// 新建步骤
export function pmsPropertySopStepInsert(payload: PmsSopStepInsertDTO) {
  return http.post<Res<PmsSopStepVO>>('/pms/sop-step/insert', payload)
}

// 编辑步骤
export function pmsPropertySopStepUpdate(payload: PmsSopStepUpdateDTO) {
  return http.post<Res<PmsSopStepVO>>('/pms/sop-step/update', payload)
}

// 导入步骤Excel
export function pmsPropertySopStepImport() {
  return http.post<Res<PmsSopImportResultVO>>('/pms/sop-step/import')
}

// 导出步骤Excel
export function pmsPropertySopStepExport(payload: {sopId: string}) {
  return http.post<Res<string>>('/pms/sop-step/export', payload)
}

// 启用/关闭步骤
export function pmsPropertySopStepEnable(payload: {stepId: string; enable: number}) {
  return http.post<Res<string>>('/pms/sop-step/enable', payload)
}

// 员工分页查询
export function pmsPropertyEmployeeList(payload?: PmsEmployeeListDTO) {
  return http.post<Res<PmsEmployeeVO[]>>('/pms/employee/list', payload)
}

// 员工详情
export function pmsPropertyEmployeeDetail(payload: {id: string}) {
  return http.post<Res<PmsEmployeeVO>>('/pms/employee/get', payload)
}

// 客户信息管理

// 客户列表（分页+筛选）
export function pmsPropertyCustomerList(payload?: PmsCustomerListDTO) {
  return http.post<Res<PmsCustomerVO[]>>('/pms/customer/list', payload)
}

// 客户详情
export function pmsPropertyCustomerGet(payload: {customerId: string}) {
  return http.post<Res<PmsCustomerVO>>('/pms/customer/get', payload)
}

// 新建客户（手机号唯一键upsert）
export function pmsPropertyCustomerInsert(payload: PmsCustomerInsertDTO) {
  return http.post<Res<string>>('/pms/customer/insert', payload)
}

// 客户编辑
export function pmsPropertyCustomerUpdate(payload: PmsCustomerUpdateDTO) {
  return http.post<Res<string>>('/pms/customer/update', payload)
}

// 新增客户车辆
export function pmsPropertyCustomerVehicleInsert(payload: PmsCustomerVehicleInsertDTO) {
  return http.post<Res<string>>('/pms/customer/vehicle/insert', payload)
}

// 删除车辆（软删除）
export function pmsPropertyCustomerVehicleDelete(payload: {vehicleId: string}) {
  return http.post<Res<string>>('/pms/customer/vehicle/delete', payload)
}

// 客户信息导出Excel
export function pmsPropertyCustomerExport(payload: {customerId: string}) {
  return http.post<Res<string>>('/pms/customer/export', payload)
}
