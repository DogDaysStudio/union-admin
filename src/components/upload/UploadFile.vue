<script setup lang="ts">
/**
 * @example
   <upload-file ref="uploadRef" v-model:file-list="form.avatarFid as any"></upload-file>
 */
import {ref, useAttrs, useTemplateRef, computed} from 'vue'
import {baseUrl} from '@/common/config'
import {createHeaders} from '@/service/service'
import {type UploadPropsPublic, type UploadUserFile} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {validateFileList} from './utils'

const attrs = useAttrs()
const props = withDefaults(
  defineProps<
    UploadPropsPublic & {
      customData?: Record<string, any>
    }
  >(),
  {
    action: '/ams/common/file/upload',
    showFileList: true,
    listType: 'picture-card',
    // data: () => ({type: 1000}),
    autoUpload: true,
  }
)

const uploadData = computed(() => ({
  type: 1000,
  ...props.customData,
}))

const uploadRef = useTemplateRef('uploadRef')
defineExpose({
  ...uploadRef.value,
  /**
   * 校验文件列表是否上传成功
   * @returns 文件 ID 列表
   */
  validate() {
    return validateFileList(props.fileList)
  },
})

// 重新抛出 el-upload 的 slots
defineSlots<typeof uploadRef.value.$slots>()

const handlePreview: UploadPropsPublic['onPreview'] = file => {
  dialogImageUrl.value = file.url || ''
  dialogVisible.value = true
}

const handleSuccess = (res: Res, file: UploadUserFile) => {
  if (![200, 201].includes(res.code)) {
    file.status = 'fail'
    ElMessage.error(res.msg || '上传失败')
  }
}

const dialogVisible = ref(false)
const dialogImageUrl = ref('')
</script>

<template>
  <el-upload
    ref="uploadRef"
    @preview="handlePreview"
    @success="handleSuccess"
    v-bind="{...attrs, ...props}"
    :headers="createHeaders()"
    :action="action?.startsWith('http') ? action : baseUrl + action"
    :data="uploadData"
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-if="!$slots.trigger" #trigger>
      <el-icon><Plus /></el-icon>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" append-to-body>
    <el-image :src="dialogImageUrl" />
  </el-dialog>
</template>
