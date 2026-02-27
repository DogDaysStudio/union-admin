export {}

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    /**
     * 是否显示错误信息，默认：`true`
     */
    showError?: boolean
  }
}
