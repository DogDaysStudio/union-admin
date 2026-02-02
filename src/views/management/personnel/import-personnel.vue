<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">批量导入</h1>
      <el-button @click="handleReturn">返回</el-button>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-6">批量导入</h2>

      <!-- 步骤指示器 -->
      <div class="flex items-center justify-between mb-8" style="max-width: 600px">
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium mb-2"
          >
            1
          </div>
          <span class="text-sm">上传文件</span>
        </div>
        <div class="flex-1 h-1 bg-blue-200 mx-2"></div>
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-medium mb-2"
          >
            2
          </div>
          <span class="text-sm">执行导入</span>
        </div>
        <div class="flex-1 h-1 bg-gray-200 mx-2"></div>
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-medium mb-2"
          >
            3
          </div>
          <span class="text-sm">导入完成</span>
        </div>
      </div>

      <!-- 模板下载区域 -->
      <div class="border border-gray-200 rounded-lg p-4 mb-4">
        <h3 class="font-medium mb-2">填写导入员工的信息</h3>
        <p class="text-gray-600 mb-4">
          请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除
        </p>
        <el-button type="primary" @click="handleDownloadTemplate">下载模板</el-button>
      </div>

      <!-- 文件上传区域 -->
      <div class="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 class="font-medium mb-2">上传填好的员工信息表</h3>
        <p class="text-gray-600 mb-4">
          文件后缀名必须为 xls 或 xlsx（即Excel格式），文件大小不得大于10M
        </p>
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="true"
          :file-list="fileList"
          accept=".xls,.xlsx"
          :limit="1"
        >
          <el-button type="primary">上传文件</el-button>
          <template #tip>
            <div class="text-xs text-gray-500 mt-2">只能上传 Excel 文件，且不超过 10MB</div>
          </template>
        </el-upload>
      </div>

      <!-- 下一步按钮 -->
      <div class="flex justify-center">
        <el-button type="primary" size="large" @click="handleNextStep" :disabled="!fileList.length">
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 文件列表
const fileList = ref<any[]>([])

// 处理返回
const handleReturn = () => {
  router.push('/management/personnel')
}

// 处理下载模板
const handleDownloadTemplate = () => {
  console.log('下载模板')
  // 这里可以添加下载模板的逻辑
  // 例如：window.location.href = '/api/download/template'
}

// 处理文件上传
const handleFileChange = (file: any, fileList: any[]) => {
  console.log('文件上传', file, fileList)
  // 这里可以添加文件上传的逻辑
}

// 处理下一步
const handleNextStep = () => {
  console.log('下一步')
  // 这里可以添加下一步的逻辑
  // 例如跳转到执行导入页面：router.push('/management/personnel/import/execute')
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
