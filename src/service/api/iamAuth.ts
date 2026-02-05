import {useUserStore} from '@/stores/user'
import http from '../service'

export const iamAuth = {
  // 获取图片验证码
  iamAuthGetImgCode() {
    return http.post<Res<Record<string, string>>>('/iam/auth/get-imgCode')
  },

  // 发送验证码 | object:{mobile:手机号}
  iamAuthSendVerifyCode(payload: {mobile: any}) {
    return http.post<Res<string>>('/iam/auth/send-verifyCode', payload)
  },

  // 登录
  async iamAuthLogin(payload: AuthLoginDTO) {
    const result = await http.post<Res<string>>('/iam/auth/login', payload)
    if (result?.data) {
      useUserStore().setToken(result?.data)
    }

    return result
  },

  // 获取用户信息
  async iamAuthInfo() {
    const result = await http.post<Res<AuthUserModelVO>>('/iam/auth/info')
    if (result?.data) {
      useUserStore().setUserInfo(result?.data)
    }

    return result
  },

  // 获取SSO票据 | object:{appId:应用Id}
  iamAuthSsoTicket(payload: {appId: any}) {
    return http.post<Res<string>>('/iam/auth/sso-ticket', payload)
  },

  // 登出
  async iamAuthLogout(payload: Record<string, any>) {
    const result = await http.post<Res<Record<string, any>>>('/iam/auth/logout', payload)
    useUserStore().logout()

    return result
  },

  // 组织列表
  iamAuthOrgList(payload: AuthOrgListDTO) {
    return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/list', payload)
  },
  // 当前用户的组织树
  iamAuthOrgTree(payload: Record<string, any>) {
    return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/tree', payload)
  },
  // 新增/修改组织
  iamAuthOrgUpsert(payload: AuthOrgUpsertDTO) {
    return http.post<Res<string>>('/iam/auth-org/upsert', payload)
  },
  // 删除组织 | object:{orgId:组织ID}
  iamAuthOrgDelete(payload: {orgId: any}) {
    return http.post<Res<Record<string, any>>>('/iam/auth-org/delete', payload)
  },

  // 权限列表
  iamAuthPermissionList(payload: AuthPermissionListDTO) {
    return http.post<Res<AuthPermissionVO[]>>('/iam/auth-permission/list', payload)
  },
  // 新增/更新权限
  iamAuthPermissionUpsert(payload: AuthPermissionUpsertDTO) {
    return http.post<Res<string>>('/iam/auth-permission/upsert', payload)
  },
  // 删除权限 | object:{permId:权限ID}
  iamAuthPermissionDelete(payload: Record<string, any>) {
    return http.post<Res<string>>('/iam/auth-permission/delete', payload)
  },
  // 启用/禁用权限 | object:{permId:权限ID,enable:bool}
  iamAuthPermissionEnable(payload: {permId: any; enable: boolean}) {
    return http.post<Res<Record<string, any>>>('/iam/auth-permission/enable', payload)
  },

  // 角色列表
  iamAuthRoleList(payload: AuthRoleListDTO) {
    return http.post<Res<AuthRoleVO[]>>('/iam/auth-role/list', payload)
  },
  // 新增/修改角色
  iamAuthRoleUpsert(payload: AuthRoleUpsertDTO) {
    return http.post<Res<string>>('/iam/auth-role/upsert', payload)
  },
  // 删除角色 | object:{roleId:角色ID}
  iamAuthRoleDelete(payload: {roleId: any}) {
    return http.post<Res<Record<string, any>>>('/iam/auth-role/delete', payload)
  },
  // 启用/禁用角色 | object:{roleId:角色ID,enable:bool,enableNotes:原因}
  iamAuthRoleEnable(payload: {roleId: any; enable: boolean; enableNotes: any}) {
    return http.post<Res<Record<string, any>>>('/iam/auth-role/enable', payload)
  },
}
