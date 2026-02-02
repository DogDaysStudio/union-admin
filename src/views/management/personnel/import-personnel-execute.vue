<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">执行导入</h1>
      <el-button @click="handleReturn">返回</el-button>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-6">执行导入</h2>

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

      <!-- 导入进度 -->
      <div class="mb-6">
        <el-progress :percentage="importProgress" :status="importStatus" />
        <p class="text-gray-600 mt-2">{{ importMessage }}</p>
      </div>

      <!-- 导入结果预览 -->
      <div class="mb-6">
        <h3 class="font-medium mb-2">导入结果预览</h3>
        <el-table :data="importResult" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="account" label="登录账号" />
          <el-table-column prop="phone" label="手机" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                {{ scope.row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="提示信息" />
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4">
        <el-button @click="handleReturn">返回</el-button>
        <el-button type="primary" @click="handleComplete" :disabled="importProgress < 100">
          完成
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 导入进度
const importProgress = ref(0)
// 导入状态
const importStatus = ref<'success' | 'exception' | ''>('')
// 导入消息
const importMessage = ref('正在导入...')

// 导入结果
const importResult = ref([
  {name: '张小刚', account: 'zhangxg', phone: '18888888881', status: 'success', message: ''},
  {name: '李小花', account: 'lixf', phone: '18888888882', status: 'success', message: ''},
  {
    name: '王小明',
    account: 'wangxm',
    phone: '18888888883',
    status: 'danger',
    message: '手机号格式不正确',
  },
])

// 模拟导入过程
onMounted(() => {
  const timer = setInterval(() => {
    importProgress.value += 10
    if (importProgress.value >= 100) {
      clearInterval(timer)
      importStatus.value = 'success'
      importMessage.value = '导入完成'
    }
  }, 500)
})

// 处理返回
const handleReturn = () => {
  router.push('/management/personnel/import')
}

// 处理完成
const handleComplete = () => {
  router.push('/management/personnel/import/complete')
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
