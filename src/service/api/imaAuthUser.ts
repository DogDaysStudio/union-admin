import http from '../service'

export const iamAuthUser = {
  // 新增/更新人员
  iamAuthUserUpsert(payload: AuthUserUpsertDTO) {
    return http.post<Res<string>>('/iam/auth-user/upsert', payload)
  },
  // 人员列表
  iamAuthUserList(payload: AuthUserListDTO) {
    return http.post<Res<AuthUserVO[]>>('/iam/auth-user/list', payload)
  },
}
