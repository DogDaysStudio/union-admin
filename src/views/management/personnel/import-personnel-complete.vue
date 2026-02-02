<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">导入完成</h1>
      <el-button @click="handleReturn">返回</el-button>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-6">导入完成</h2>

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
        <div class="flex-1 h-1 bg-blue-500 mx-2"></div>
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium mb-2"
          >
            2
          </div>
          <span class="text-sm">执行导入</span>
        </div>
        <div class="flex-1 h-1 bg-blue-500 mx-2"></div>
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium mb-2"
          >
            3
          </div>
          <span class="text-sm">导入完成</span>
        </div>
      </div>

      <!-- 导入结果统计 -->
      <div class="mb-6">
        <h3 class="font-medium mb-4">导入结果统计</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="border rounded-lg p-4 text-center">
            <p class="text-gray-600 mb-1">总条数</p>
            <p class="text-2xl font-semibold">{{ stats.total }}</p>
          </div>
          <div class="border rounded-lg p-4 text-center">
            <p class="text-gray-600 mb-1">成功条数</p>
            <p class="text-2xl font-semibold text-green-500">{{ stats.success }}</p>
          </div>
          <div class="border rounded-lg p-4 text-center">
            <p class="text-gray-600 mb-1">失败条数</p>
            <p class="text-2xl font-semibold text-red-500">{{ stats.failed }}</p>
          </div>
          <div class="border rounded-lg p-4 text-center">
            <p class="text-gray-600 mb-1">成功率</p>
            <p class="text-2xl font-semibold text-blue-500">{{ stats.successRate }}%</p>
          </div>
        </div>
      </div>

      <!-- 失败详情 -->
      <div class="mb-6" v-if="stats.failed > 0">
        <h3 class="font-medium mb-2">失败详情</h3>
        <el-table :data="failedDetails" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="account" label="登录账号" />
          <el-table-column prop="phone" label="手机" />
          <el-table-column prop="message" label="失败原因" />
        </el-table>
        <el-button class="mt-4" @click="handleDownloadFailed">下载失败详情</el-button>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4">
        <el-button @click="handleReturn">返回</el-button>
        <el-button type="primary" @click="handleImportAgain">再次导入</el-button>
        <el-button type="success" @click="handleViewList">查看人员列表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 导入统计
const stats = reactive({
  total: 3,
  success: 2,
  failed: 1,
  successRate: 66.67,
})

// 失败详情
const failedDetails = ref([
  {name: '王小明', account: 'wangxm', phone: '18888888883', message: '手机号格式不正确'},
])

// 处理返回
const handleReturn = () => {
  router.push('/management/personnel/import')
}

// 处理再次导入
const handleImportAgain = () => {
  router.push('/management/personnel/import')
}

// 处理查看人员列表
const handleViewList = () => {
  router.push('/management/personnel')
}

// 处理下载失败详情
const handleDownloadFailed = () => {
  console.log('下载失败详情')
  // 这里可以添加下载失败详情的逻辑
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
