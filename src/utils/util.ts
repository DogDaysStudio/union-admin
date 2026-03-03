import {baseUrl} from '@/common/config'
import {createHeaders} from '@/service/service'

export interface DownloadBlobOptions extends Omit<RequestInit, 'body'> {
  url: string
  body?: Record<string, any>
  name?: string
}

/**
 * 下载流文件（动态文件）
 */
export async function downloadBlob({url, body, headers, name, ...options}: DownloadBlobOptions) {
  url = /^https?:\/\//.test(url) ? url : `${baseUrl}/${url.replace(/^\//, '')}`
  const fetchHeaders = {
    ...createHeaders(),
    'Content-Type': 'application/json',
    ...headers,
  }
  const fetchBody = body || {}

  const response = await fetch(url, {
    method: 'post',
    headers: fetchHeaders,
    body: JSON.stringify(fetchBody),
    ...options,
  })
  const contentType = response.headers.get('content-type')
  if (contentType === 'application/json') {
    const data = await response.json()
    ElMessage.warning(data.msg)
    return
  }

  let filename = response.headers.get('nyg8-filename')
  filename = filename ? decodeURIComponent(filename) : name || '导出.xlsx'
  const blob = await response.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

// 格式化文件大小
export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}
