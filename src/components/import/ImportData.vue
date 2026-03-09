<script setup lang="ts">
/**
 * @example
  <import-data
    template-url="/iam/auth-user/template-export"
    check-url="/iam/auth-user/template-check"
    check-export-url="/iam/auth-user/template-check-export"
    import-url="/iam/auth-user/template-import"
    :title="{
      template: '填写导入员工的信息',
      // templateDesc: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除',
      upload: '上传填好的员工信息表',
      // uploadDesc: '文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M',
    }"
    @finish="console.log('finish')"
  ></import-data>
 */
import {computed, ref, useTemplateRef} from 'vue'
import {Document, UploadFilled, CircleCheck, Warning} from '@element-plus/icons-vue'
import type {UploadUserFile} from 'element-plus'
import http from '@/service/service'
import {downloadBlob} from '@/utils/util'

interface Title {
  template?: string // 模板标题
  templateDesc?: string // 模板描述
  upload?: string // 上传标题
  uploadDesc?: string // 上传描述
}

const props = defineProps<{
  /**
   * 模板下载地址
   */
  templateUrl: string
  /**
   * 校验地址
   */
  checkUrl: string
  /**
   * 导出校验后的模板
   */
  checkExportUrl: string
  /**
   * 导入地址
   */
  importUrl: string
  /**
   * 页面描述
   */
  title?: Title
  /**
   * 文件上传地址
   */
  uploadUrl?: string
  /**
   * 文件上传类型，透传给 UploadFile
   */
  type?: number
}>()

defineEmits<{
  (e: 'finish'): void
}>()

const active = ref<number>(1)
const fileList = ref<UploadUserFile[]>([])
const fid = computed(() => (fileList.value[0]?.response as any)?.data?.id)
const importCount = ref(0)

const downloadLoading = ref(false)
const downloadTemplate = () => {
  downloadLoading.value = true
  downloadBlob({
    url: props.templateUrl,
    name: '模板.xlsx',
  }).finally(() => {
    downloadLoading.value = false
  })
}

const checkLoading = ref(false)
const checkData = ref<UserTemplateImportCheckVO>()
const uploadRef = useTemplateRef('uploadRef')
const step1 = async () => {
  if (!fileList.value?.length) return ElMessage.error('请上传文件')
  await uploadRef.value?.validate()
  if (!props.checkUrl) return

  try {
    checkLoading.value = true
    const {data} = await http.post<Res<UserTemplateImportCheckVO>>(props.checkUrl, {
      fid: fid.value,
    })
    checkData.value = data
  } finally {
    checkLoading.value = false
  }
  active.value = 2
}

const exportLoading = ref(false)
const checkExport = () => {
  if (!props.checkExportUrl) return
  exportLoading.value = true
  downloadBlob({url: props.checkExportUrl, body: {fid: fid.value}}).finally(() => {
    exportLoading.value = false
  })
}

const importLoading = ref(false)
const step2 = async () => {
  if (!props.importUrl) return
  try {
    importLoading.value = true
    const {data: count} = await http.post<Res<number>>(props.importUrl, {
      fid: fid.value,
    })
    importCount.value = count || 0
    active.value = 3
  } finally {
    importLoading.value = false
  }
}
</script>

<template>
  <el-steps :active="active" align-center class="mb-8">
    <el-step title="上传文件" />
    <el-step title="执行导入" />
    <el-step title="导入完成" />
  </el-steps>

  <!-- 第一步 -->
  <template v-if="active === 1">
    <el-card class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-primary)"><Document /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">{{ title?.template || '填写导入项目的信息' }}</div>
          <span class="text-gray-400 text-sm">
            {{
              title?.templateDesc ||
              '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除'
            }}
          </span>
        </div>
        <el-button type="danger" @click="downloadTemplate" :loading="downloadLoading">
          ↓下载模板
        </el-button>
      </div>
    </el-card>

    <el-card class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-primary)"><UploadFilled /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">{{ title?.upload || '上传填好的项目信息表' }}</div>
          <div class="text-gray-400 text-sm">
            {{
              title?.uploadDesc || '文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M'
            }}
          </div>
        </div>
        <upload-file
          :action="uploadUrl"
          ref="uploadRef"
          v-model:file-list="fileList"
          :limit="1"
          :type="type"
          list-type="text"
          class="upload-template"
        >
          <template #trigger>
            <el-button type="danger">↑上传文件</el-button>
          </template>
        </upload-file>
      </div>
    </el-card>

    <div class="flex justify-center">
      <el-button type="danger" @click="step1" :loading="checkLoading">下一步</el-button>
    </div>
  </template>

  <!-- 第二步 -->
  <template v-if="active === 2">
    <el-card class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-success)"><CircleCheck /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">正常数量条数</div>
          <div class="text-gray-400 text-sm">{{ checkData?.numRight || 0 }}条</div>
        </div>
      </div>
    </el-card>

    <el-card class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-warning)"><Warning /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">异常数量条数</div>
          <div class="text-gray-400 text-sm">
            {{ checkData?.numError || 0 }}条
            {{
              checkData?.errorMsgList?.length ? ` （${checkData?.errorMsgList?.join(', ')}）` : ''
            }}
          </div>
        </div>
        <el-button
          v-if="checkData?.numError"
          type="danger"
          @click="checkExport"
          :loading="exportLoading"
        >
          下载异常数据
        </el-button>
      </div>
    </el-card>

    <div class="flex justify-center">
      <el-button
        type="danger"
        @click="step2"
        :loading="importLoading"
        :disabled="!checkData.numRight"
      >
        导入
      </el-button>
      <el-button @click="active--">返回重新上传</el-button>
    </div>
  </template>

  <!-- 第三步 -->
  <template v-if="active === 3">
    <div class="text-center mb-10">
      <el-icon size="50" color="var(--el-color-success)"><CircleCheck /></el-icon>
      <div class="text-2xl">导入完成</div>
      <span class="text-gray-400 text-sm">成功导入项目数量：{{ importCount }}个</span>
    </div>
    <div class="flex justify-center">
      <el-button type="danger" @click="$emit('finish')">完成</el-button>
    </div>
  </template>
</template>

<style scoped lang="scss">
:deep() {
  .upload-template {
    text-align: right;

    & .el-upload-list {
      margin-top: 0;
      min-width: 200px;
      text-align: left;
    }
  }
}
</style>
