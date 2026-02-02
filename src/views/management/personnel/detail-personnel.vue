<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">人员详情</h1>
      <el-button @click="handleReturn">返回</el-button>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <!-- 人员基本信息 -->
      <div class="flex items-start mb-6">
        <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          <el-icon class="text-4xl text-gray-400"><User /></el-icon>
        </div>
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <h2 class="text-lg font-semibold mr-3">{{ personnelInfo.name }}</h2>
            <el-tag size="small" type="success">在线</el-tag>
          </div>
          <p class="text-gray-600 mb-2">{{ personnelInfo.department }} / {{ personnelInfo.role }}</p>
          <p class="text-gray-600">入职时间：{{ personnelInfo.entryDate }}</p>
        </div>
        <el-button type="primary" @click="handleEdit">编辑资料</el-button>
      </div>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab">
        <!-- 登录日志 -->
        <el-tab-pane label="登录日志" name="loginLog">
          <el-table :data="loginLogs" style="width: 100%">
            <el-table-column prop="loginTime" label="登录时间" />
            <el-table-column prop="terminalType" label="终端类型" />
            <el-table-column prop="browserVersion" label="浏览器/终端版本" />
            <el-table-column prop="os" label="操作系统" />
            <el-table-column prop="deviceName" label="设备名称" />
            <el-table-column prop="macAddress" label="MAC地址" />
            <el-table-column prop="loginIp" label="登录IP" />
            <el-table-column prop="location" label="地址" />
          </el-table>
        </el-tab-pane>

        <!-- 操作权限 -->
        <el-tab-pane label="操作权限" name="permission">
          <div class="p-4 text-gray-500">
            操作权限信息将在此显示
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {User} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 激活的标签页
const activeTab = ref('loginLog')

// 人员信息
const personnelInfo = reactive({
  id: Number(route.params.id) || 1,
  name: '李小明',
  department: '销售部',
  role: '销售总监',
  entryDate: '2021-03-04',
  online: true
})

// 登录日志数据
const loginLogs = ref([
  {
    loginTime: '2019-08-25 14:54',
    terminalType: '后台web端',
    browserVersion: 'Firefox 68.0',
    os: 'Win10',
    deviceName: 'WindirPC',
    macAddress: 'EB-4E-06-51-3B-16',
    loginIp: '192.168.1.1',
    location: '广东省深圳市'
  }
])

// 处理返回
const handleReturn = () => {
  router.push('/management/personnel')
}

// 处理编辑资料
const handleEdit = () => {
  console.log('编辑资料', personnelInfo.id)
  // 这里可以添加编辑资料的逻辑
  // 例如跳转到编辑页面：router.push(`/management/personnel/edit/${personnelInfo.id}`)
}

// 组件挂载时获取人员详情
onMounted(() => {
  // 这里可以添加获取人员详情的API调用
  console.log('获取人员详情', personnelInfo.id)
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
