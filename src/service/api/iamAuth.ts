import {useUserStore} from '@/stores/user'
import http from '../service'

// 获取图片验证码
export function iamAuthGetImgCode() {
  return http.post<Res<Record<string, string>>>('/iam/auth/get-imgCode')
}

// 发送验证码 | object:{mobile:手机号}
export function iamAuthSendVerifyCode(payload: {mobile: any}) {
  return http.post<Res<string>>('/iam/auth/send-verifyCode', payload)
}

// 登录
export async function iamAuthLogin(payload: AuthLoginDTO) {
  const result = await http.post<Res<string>>('/iam/auth/login', payload)
  if (result?.data) {
    useUserStore().setToken(result?.data)
  }

  return result
}

// 获取用户信息
export async function iamAuthInfo() {
  const result = await http.post<Res<AuthUserModelVO>>('/iam/auth/info')
  if (result?.data) {
    useUserStore().setUserInfo(result?.data)
  }

  return result
}

// 获取SSO票据 | object:{appId:应用Id}
export function iamAuthSsoTicket(payload: {appId: any}) {
  return http.post<Res<string>>('/iam/auth/sso-ticket', payload)
}

// 登出
export async function iamAuthLogout(payload: Record<string, any>) {
  const result = await http.post<Res<Record<string, any>>>('/iam/auth/logout', payload)
  useUserStore().logout()

  return result
}

// 组织列表
export function iamAuthOrgList(payload: AuthOrgListDTO) {
  return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/list', payload)
}
// 当前用户的组织树
export function iamAuthOrgTree(payload: Record<string, any>) {
  return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/tree', payload)
}
// 新增/修改组织
export function iamAuthOrgUpsert(payload: AuthOrgUpsertDTO) {
  return http.post<Res<string>>('/iam/auth-org/upsert', payload)
}
// 删除组织 | object:{orgId:组织ID}
export function iamAuthOrgDelete(payload: {orgId: any}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-org/delete', payload)
}

// 权限列表
export function iamAuthPermissionList(payload: AuthPermissionListDTO) {
  return http.post<Res<AuthPermissionVO[]>>('/iam/auth-permission/list', payload)
}
// 新增/更新权限
export function iamAuthPermissionUpsert(payload: AuthPermissionUpsertDTO) {
  return http.post<Res<string>>('/iam/auth-permission/upsert', payload)
}
// 删除权限 | object:{permId:权限ID}
export function iamAuthPermissionDelete(payload: Record<string, any>) {
  return http.post<Res<string>>('/iam/auth-permission/delete', payload)
}
// 启用/禁用权限 | object:{permId:权限ID,enable:bool}
export function iamAuthPermissionEnable(payload: {permId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-permission/enable', payload)
}

// 角色列表
export function iamAuthRoleList(payload: AuthRoleListDTO) {
  return http.post<Res<AuthRoleVO[]>>('/iam/auth-role/list', payload)
}
// 新增/修改角色
export function iamAuthRoleUpsert(payload: AuthRoleUpsertDTO) {
  return http.post<Res<string>>('/iam/auth-role/upsert', payload)
}
// 删除角色 | object:{roleId:角色ID}
export function iamAuthRoleDelete(payload: {roleId: any}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-role/delete', payload)
}
// 启用/禁用角色 | object:{roleId:角色ID,enable:bool,enableNotes:原因}
export function iamAuthRoleEnable(payload: {roleId: any; enable: boolean; enableNotes: any}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-role/enable', payload)
}
// 角色详情 | object:{roleId:角色ID}
export function iamAuthRoleGet(payload: {roleId: any}) {
  return http.post<Res<AuthRoleVO>>('/iam/auth-role/get', payload)
}
