<script setup lang="ts">
import {pmsPropertyDicList, pmsPropertyDicDelete} from '@/service/api/pmsProperty'
import {usePagination, useRequest} from 'vue-request'

const {
  data: dicListData,
  refreshAsync: refreshDicList,
  loading: dicListLoading,
  current,
  pageSize,
  total,
} = usePagination(pmsPropertyDicList, {
  manual: false,
})

const {runAsync: runDicDelete} = useRequest(pmsPropertyDicDelete)

const handleDelete = (row: SysDicVO) => {
  ElMessageBox.confirm(`确定删除该字典吗？${row.dicName}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await runDicDelete({dicId: row.dicId})
    refreshDicList()
  })
}
</script>

<template>
  <section-group title="数据列表">
    <template #extra>
      <el-space>
        <el-button>新增字典</el-button>
      </el-space>
    </template>

    <el-table ref="multipleTableRef" :data="dicListData?.data" border v-loading="dicListLoading">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="dicName" label="名称" />
      <el-table-column prop="dicCode" label="CODE" />
      <el-table-column prop="operation" label="操作" width="80" align="center">
        <template #default="{row}">
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <el-pagination
    class="float-right"
    v-model:current-page="current"
    v-model:page-size="pageSize"
    :total="total"
  />
</template>
