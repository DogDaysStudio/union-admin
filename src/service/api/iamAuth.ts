import {useUserStore} from '@/stores/user'
import http from '../service'

export const iamAuth = {
  // 获取图片验证码
  iamAuthGetImgCode() {
    return http.post<Res<Record<string, string>>>('/iam/auth/get-imgCode')
  },

  // 发送验证码 | object:{mobile:手机号}
  iamAuthSendVerifyCode(payload: Record<string, any>) {
    return http.post<Res<string>>('/iam/auth/send-verifyCode', payload)
  },

  // 登录
  async iamAuthLogin(payload: AuthLoginDTO) {
    const result = await http.post<Res<string>>('/iam/auth/login', payload)
    useUserStore().setToken(result.data)

    return result
  },

  // 获取用户信息
  async iamAuthInfo() {
    const result = await http.post<Res<AuthUserModelVO>>('/iam/auth/info')
    useUserStore().setUserInfo(result.data)
    return result
  },
}
