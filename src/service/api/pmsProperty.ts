import http from '../service'

// 新建字典名（默认名称未命名字典） | object:{groupId:分组ID}
export function pmsPmsDicTypeInsert(payload: {groupId: any}) {
  return http.post<Res<PmsDicTypeVO>>('/pms/dic/type/insert', payload)
}

// 删除字典名（级联软删除） | object:{typeId:字典名ID}
export function pmsPmsDicTypeDelete(payload: {typeId: any}) {
  return http.post<Res<Record<string, any>>>('/pms/dic/type/delete', payload)
}

// 编辑字典值
export function pmsPmsDicItemUpdate(payload: PmsDicItemUpdateDTO) {
  return http.post<Res<PmsDicItemVO>>('/pms/dic/item/update', payload)
}

// 右侧字典值搜索 | object:{typeId:字典名ID, keyword:关键字}
export function pmsPmsDicItemSearch(payload: {typeId: any; keyword: any}) {
  return http.post<Res<PmsDicItemVO[]>>('/pms/dic/item/search', payload)
}

// 字典值列表 | object:{typeId:字典名ID}
export function pmsPmsDicItemList(payload: {typeId: any}) {
  return http.post<Res<PmsDicItemVO[]>>('/pms/dic/item/list', payload)
}

// 批量添加字典值
export function pmsPmsDicItemInsertBatch(payload: PmsDicItemInsertDTO) {
  return http.post<Res<Record<string, any>>>('/pms/dic/item/insert-batch', payload)
}

// 字典值导入Excel
export function pmsPmsDicItemImport() {
  return http.post<Res<ImportResult>>('/pms/dic/item/import')
}

// 字典值导出Excel | object:{typeId:字典名ID}
export function pmsPmsDicItemExport(payload: {typeId: any}) {
  return http.post<Res<string>>('/pms/dic/item/export', payload)
}

// 删除字典值 | object:{itemId:字典值ID}
export function pmsPmsDicItemDelete(payload: {itemId: any}) {
  return http.post<Res<Record<string, any>>>('/pms/dic/item/delete', payload)
}

// 左侧树查询（分组→字典名，含字典值数量）
export function pmsPmsDicGroupTree() {
  return http.post<Res<PmsDicGroupVO[]>>('/pms/dic/group/tree')
}

// 左侧树搜索 | object:{keyword:关键字}，按分组名和字典名模糊匹配
export function pmsPmsDicGroupSearch(payload: Record<string, any>) {
  return http.post<Res<PmsDicGroupVO[]>>('/pms/dic/group/search', payload)
}

// 新建分组（默认名称未命名分组）
export function pmsPmsDicGroupInsert() {
  return http.post<Res<PmsDicGroupVO>>('/pms/dic/group/insert')
}

// 删除分组（级联软删除） | object:{groupId:分组ID}
export function pmsPmsDicGroupDelete(payload: {groupId: any}) {
  return http.post<Res<Record<string, any>>>('/pms/dic/group/delete', payload)
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

// 批量删除分组 | object:{groupIds:[分组ID列表]}，级联软删除每个分组下所有SOP模板
export function pmsPmsSopGroupDeleteBatch(payload: {groupIds: string[]}) {
  return http.post<Res<Record<string, any>>>('/pms/sop-group/delete-batch', payload)
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

// SOP模板详情 | 基础信息 + 分类列表（含步骤数量）
export function pmsPmsSopDetail(payload: PmsSopTemplateDetailQueryDTO) {
  return http.post<Res<PmsSopTemplateDetailVO>>('/pms/sop/detail', payload)
}

// 编辑SOP模板标题与描述
export function pmsPmsSopUpdateBasic(payload: PmsSopTemplateUpdateBasicDTO) {
  return http.post<Res<Record<string, any>>>('/pms/sop/update-basic', payload)
}

// 批量删除SOP模板
export function pmsPmsSopDelete(payload: {sopIds: any}) {
  return http.post<Res<Record<string, any>>>('/pms/sop/delete', payload)
}

// 批量复制SOP（深拷贝）
export function pmsPmsSopCopy(payload: {sopIds: any; targetGroupId: any}) {
  return http.post<Res<string[]>>('/pms/sop/copy', payload)
}

// 编辑SOP分类名称
export function pmsPmsSopCategoryUpdate(payload: PmsSopCategoryUpdateDTO) {
  return http.post<Res<PmsSopCategoryVO>>('/pms/sop-category/update', payload)
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

// 删除SOP步骤 | object:{stepId:步骤ID}
export function pmsPmsSopStepDelete(payload: {stepId: any}) {
  return http.post<Res<Record<string, any>>>('/pms/sop-step/delete', payload)
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
