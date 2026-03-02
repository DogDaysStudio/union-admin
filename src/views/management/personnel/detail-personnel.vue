<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {User} from '@element-plus/icons-vue'
import {iamAuthUserGet, iamAuthUserListLoginLog} from '@/service/api/imaAuthUser'
import {usePagination, useRequest} from 'vue-request'
import UserPermission from '../role/components/UserPermission.vue'

const router = useRouter()
const route = useRoute('/management/personnel/detail/:id')

const {data, loading, total, pageSize, current} = usePagination(iamAuthUserListLoginLog, {
  manual: false,
  defaultParams: [{userId: route.params.id}],
})

const {data: authUser} = useRequest(iamAuthUserGet, {
  manual: false,
  defaultParams: [{userId: route.params.id}],
})
const personnelInfo = computed(() => authUser.value?.data || ({} as AuthUserVO))

// 激活的标签页
const activeTab = ref('loginLog')

// 处理编辑资料
const handleEdit = () => {
  router.push({
    name: '/management/personnel/edit/:userId',
    params: {userId: personnelInfo.value.userId},
  })
}
</script>

<template>
  <!-- 人员基本信息 -->
  <div class="flex items-start mb-6">
    <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
      <el-icon class="text-4xl text-gray-400"><User /></el-icon>
    </div>
    <div class="flex-1">
      <div class="flex items-center mb-2">
        <h2 class="text-lg font-semibold mr-3">{{ personnelInfo.certName }}</h2>
        <el-tag size="small" type="success">在线</el-tag>
      </div>
      <p class="text-gray-600 mb-2">{{ personnelInfo.orgName }} / {{ personnelInfo.roleName }}</p>
      <p class="text-gray-600">入职时间：{{ personnelInfo.insertTime }}</p>
    </div>
    <el-button type="primary" @click="handleEdit">编辑资料</el-button>
  </div>

  <!-- 标签页 -->
  <el-tabs v-model="activeTab">
    <!-- 登录日志 -->
    <el-tab-pane label="登录日志" name="loginLog">
      <el-table :data="data?.data" v-loading="loading">
        <el-table-column prop="insertTime" label="登录时间" />
        <el-table-column prop="appType" label="终端类型" />
        <el-table-column prop="browser" label="浏览器/终端版本" />
        <el-table-column prop="os" label="操作系统" />
        <el-table-column prop="device" label="设备名称" />
        <el-table-column prop="mac" label="MAC地址" />
        <el-table-column prop="ip" label="登录IP" />
        <el-table-column prop="address" label="地址" />
      </el-table>
      <el-pagination
        class="float-right"
        v-model:current-page="current"
        v-model:page-size="pageSize"
        :total="total"
      />
    </el-tab-pane>

    <!-- 操作权限 -->
    <el-tab-pane label="操作权限" name="permission">
      <user-permission :perm-id-list="personnelInfo.permIdList" />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
