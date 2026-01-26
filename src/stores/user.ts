import {defineStore} from 'pinia'
import {useRouter} from 'vue-router'

interface State {
  token: string | null
  userInfo: AuthUserModelVO | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: null,
    userInfo: null,
  }),
  actions: {
    setToken(token: string | null) {
      this.token = token
    },
    setUserInfo(userInfo: AuthUserModelVO | null) {
      this.userInfo = userInfo
    },

    // 登出方法
    logout() {
      // 清除token和用户信息
      this.setToken(null)
      this.setUserInfo(null)

      // 跳转到登录页
      const router = useRouter()
      router.push('/login')
    },
  },
  persist: true,
})
