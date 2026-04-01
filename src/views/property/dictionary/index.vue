<script setup lang="ts">
import {onMounted} from 'vue'
import {pmsPropertyDicListTree, pmsPropertyDicList} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const {runAsync: runDicListTree} = useRequest(pmsPropertyDicListTree)
const {data: dicListData, runAsync: runDicList} = useRequest(pmsPropertyDicList)

onMounted(() => {
  runDicListTree()
  runDicList()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <el-table :data="dicListData?.data" stripe border></el-table>
  </div>
</template>
