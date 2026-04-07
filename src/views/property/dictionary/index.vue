<script setup lang="ts">
import {Plus, Upload, Download} from '@element-plus/icons-vue'
import {pmsPmsDicItemDelete, pmsPmsDicItemList} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {ref, defineAsyncComponent, computed} from 'vue'
import {useExport} from '@/common/hooks'

import SideGroup from './components/side-group.vue'

const AddDic = defineAsyncComponent(() => import('./components/add-dic.vue'))

const dicSearch = ref('')

const typeId = ref('')

const {
  data: dicItemListData,
  runAsync: runDicItemList,
  loading: dicItemListLoading,
  refresh: refreshDicItemList,
} = useRequest(pmsPmsDicItemList)

const addDicRef = ref<InstanceType<typeof AddDic>>()

const {runAsync: runDicItemDelete} = useRequest(pmsPmsDicItemDelete)

const filterDicItemList = computed(() => {
  return dicItemListData.value?.data.filter((item: PmsDicItemVO) => {
    return item.itemName.includes(dicSearch.value) || item.itemCode.includes(dicSearch.value)
  })
})

const {exportData, loading: exportLoading} = useExport({
  url: '/pms/dic/item/export' as keyof ApiType,
})

const handleGroupChange = (id: string) => {
  typeId.value = id
  runDicItemList({typeId: id})
}

const handleExport = async () => {
  await exportData({typeId: typeId.value})
}

const handleAddDic = () => {
  addDicRef.value?.open({typeId: typeId.value})
}

const handleDeleteStep = (row: PmsDicItemVO) => {
  ElMessageBox.confirm(`确定删除该字典值吗？${row.itemName}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await runDicItemDelete({itemId: row.id})
    refreshDicItemList()
  })
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-90 shrink-0">
      <SideGroup @change-type="handleGroupChange" />
    </div>

    <div class="flex-1">
      <section-group title="字典管理" class="h-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-bold text-base shrink-0">字典值</h2>
          <el-input v-model="dicSearch" placeholder="搜索名称/CODE" class="w-80! ml-auto mr-3" />
          <el-button :icon="Upload">上传</el-button>
          <el-button :icon="Download" @click="handleExport" :loading="exportLoading">
            下载
          </el-button>
          <el-button :icon="Plus" @click="handleAddDic">添加</el-button>
        </div>
        <el-table
          :data="filterDicItemList"
          border
          :loading="dicItemListLoading"
          row-key="id"
          class="w-full"
        >
          <el-table-column prop="itemName" label="名称" />
          <el-table-column prop="itemCode" label="CODE" />

          <el-table-column label="操作" align="center" width="80">
            <template #default="scope">
              <el-button link type="danger" @click="handleDeleteStep(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section-group>
    </div>

    <AddDic ref="addDicRef" @finish="refreshDicItemList" />
  </div>
</template>
