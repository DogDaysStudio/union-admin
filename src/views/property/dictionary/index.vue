<script setup lang="ts">
import {onMounted} from 'vue'
import SectionGroup from '@/components/section/SectionGroup.vue'
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
  <SectionGroup>
    <template #title>
      <h2>数据字典</h2>
    </template>
    <el-table :data="dicListData.data" stripe border></el-table>
  </SectionGroup>
</template>
