export const isProd = import.meta.env.VITE_APP_ENV === 'prod'

export const serverUrl = isProd
  ? 'https://union-sit.anjueasy.com'
  : 'https://union-sit.anjueasy.com'

export const baseUrl = serverUrl
