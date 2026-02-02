import type {UploadUserFile} from 'element-plus'

export function getFileListId(fileList: UploadUserFile[]): string[] {
  return fileList?.map(file => (file.response as any)?.data?.id || file.uid)
}

export const validateFileList = (fileList: UploadUserFile[]) => {
  if (fileList?.some(file => file.status === 'fail')) {
    ElMessage.error('文件未完全上传成功，请检查')
    return Promise.reject('文件未完全上传成功，请检查')
  }
  return Promise.resolve(getFileListId(fileList))
}
