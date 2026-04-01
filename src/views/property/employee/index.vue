<script setup lang="ts">
import {useRequest} from 'vue-request'
import {onMounted} from 'vue'
import {pmsPropertyEmployeeList} from '@/service/api/pmsProperty'

const {data: employeeListData, runAsync: runEmployeeList} = useRequest(pmsPropertyEmployeeList)

onMounted(() => {
  runEmployeeList()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <el-table :data="employeeListData?.data" stripe border></el-table>
  </div>
</template>
