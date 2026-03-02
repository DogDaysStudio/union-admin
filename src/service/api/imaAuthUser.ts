import http from '../service'

// 新增/更新人员
export function iamAuthUserUpsert(payload: AuthUserUpsertDTO) {
  return http.post<Res<string>>('/iam/auth-user/upsert', payload)
}
// 人员列表
export function iamAuthUserList(payload: AuthUserListDTO) {
  return http.post<Res<AuthUserVO[]>>('/iam/auth-user/list', payload)
}
// 是否当前登录账号已存在 | object:{loginAccount:登录账号}
export function iamAuthUserIsLoginAccountExist(payload: {loginAccount: any}) {
  return http.post<Res<boolean>>('/iam/auth-user/is-loginAccount-exist', payload)
}
// 登录日志列表
export function iamAuthUserListLoginLog(payload: AuthUserLoginLogListDTO) {
  return http.post<Res<AuthUserLoginLogVO[]>>('/iam/auth-user/list-login-log', payload)
}
// 人员详情 | object:{userId:人员ID}
export function iamAuthUserGet(payload: {userId: any}) {
  return http.post<Res<AuthUserVO>>('/iam/auth-user/get', payload)
}
// 修改部门
export function iamAuthUserUpdateOrg(payload: AuthUserUpdateOrgDTO) {
  return http.post<Res<Record<string, any>>>('/iam/auth-user/update-org', payload)
}
// 修改角色
export function iamAuthUserUpdateRole(payload: AuthUserUpdateRoleDTO) {
  return http.post<Res<Record<string, any>>>('/iam/auth-user/update-role', payload)
}
// 重置密码 | object:{userId:人员ID}
export function iamAuthUserResetPassword(payload: {userId: any}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-user/reset-password', payload)
}
// 启用/禁用人员 | object:{userId:人员ID,enable:bool}
export function iamAuthUserEnable(payload: {userId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/iam/auth-user/enable', payload)
}
