import http from '../service'

export const iamAuthUser = {
  // 新增/更新人员
  iamAuthUserUpsert(payload: AuthUserUpsertDTO) {
    return http.post<Res<string>>('/iam/auth-user/upsert', payload)
  },
}
