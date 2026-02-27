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
