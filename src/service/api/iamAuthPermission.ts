import http from '../service'

// 权限树
export function iamAuthPermissionTree(payload: AuthPermissionListDTO) {
  return http.post<Res<Record<string, AuthPermissionVO[]>>>('/iam/auth-permission/tree', payload)
}
