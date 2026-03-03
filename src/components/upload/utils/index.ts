import type {UploadUserFile} from 'element-plus'

export function getFileListId(fileList: UploadUserFile[]): string[] {
  return fileList?.map(file => (file.response as any)?.data?.id || file.uid)
}

export const validateFileList = (fileList: UploadUserFile[]) => {
  if (fileList?.some(file => ['ready', 'uploading', 'fail'].includes(file.status))) {
    ElMessage.error('文件未完全上传成功！')
    return Promise.reject('文件未完全上传成功！')
  }
  return Promise.resolve(getFileListId(fileList))
}
