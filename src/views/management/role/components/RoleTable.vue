<script setup lang="ts">
import {watch} from 'vue'
import {useRequest} from 'vue-request'
import {iamAuthRoleGet} from '@/service/api/iamAuth'

const props = defineProps<{
  roleId?: string
  userList?: AuthUserVO[]
}>()

const {data, loading, run} = useRequest(iamAuthRoleGet, {manual: true})

// 监听 roleId 变化，重新获取数据
watch(
  () => props.roleId,
  newRoleId => {
    if (newRoleId) run({roleId: newRoleId})
  },
  {immediate: true}
)
</script>

<template>
  <el-table v-loading="loading" :data="userList ?? data?.data?.userList" style="width: 100%" border>
    <el-table-column prop="certName" label="姓名" width="180" />
    <el-table-column prop="mobile" label="手机号码" width="180" />
    <el-table-column prop="email" label="邮箱地址" min-width="200" />
    <el-table-column prop="orgName" label="部门" min-width="150" />
  </el-table>
</template>
