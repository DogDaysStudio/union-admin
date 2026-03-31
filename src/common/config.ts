export const isProd = import.meta.env.VITE_APP_ENV === 'prod'

export const serverUrl = isProd ? 'https://union-sit.anjueasy.com' : 'http://8.135.74.217:88/pms/'

export const baseUrl = serverUrl
