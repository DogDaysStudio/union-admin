import {defineStore} from 'pinia'

interface State {
  token: string
  userInfo: AuthUserModelVO
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: null,
    userInfo: null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: AuthUserModelVO) {
      this.userInfo = userInfo
    },
  },
  persist: true,
})
