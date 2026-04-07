<script setup lang="ts">
import {Plus, Upload, Download, Search} from '@element-plus/icons-vue'
import {
  pmsPmsDicGroupSearch,
  pmsPmsDicItemDelete,
  pmsPmsDicItemList,
} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {ref, defineAsyncComponent, computed} from 'vue'
// import DicGroup from './components/dic-group.vue'
import {useExport} from '@/common/hooks'

// const DEFAULT_GROUP_NAME = '未命名分组'

const AddDic = defineAsyncComponent(() => import('./components/add-dic.vue'))

const defaultProps = {
  children: 'typeList',
  label: data => data.groupName || data.typeName,
}

const keyword = ref('')
const dicSearch = ref('')

const isAddGroup = ref(false)
// const newGroupName = ref(DEFAULT_GROUP_NAME)

const typeId = ref('')

const {
  data: dicGroupListData,
  runAsync: runDicGroupList,
  loading: dicGroupListLoading,
} = useRequest(pmsPmsDicGroupSearch, {
  manual: false,
  defaultParams: [{keyword: ''}],
})

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

const handleGroupChange = (node: PmsDicGroupVO) => {
  typeId.value = node.id
  runDicItemList({typeId: node.id})
}

const handleAddGroup = () => {
  isAddGroup.value = true
}

// const handleCancelAddGroup = () => {
//   isAddGroup.value = false
//   newGroupName.value = DEFAULT_GROUP_NAME
// }

const handleSearchGroup = () => {
  runDicGroupList({keyword: keyword.value})
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
  <el-row :gutter="20">
    <el-col :span="6">
      <section-group title="字典管理" class="h-full">
        <div class="flex justify-between items-center mb-4" v-loading="dicGroupListLoading">
          <el-input
            v-model="keyword"
            placeholder="搜索分组"
            class="mr-3"
            :prefix-icon="Search"
            @keydown.enter="handleSearchGroup"
            clearable
            @clear="handleSearchGroup"
          />
          <el-button :icon="Plus" class="size-8!" @click="handleAddGroup"></el-button>
        </div>

        <el-tree
          :data="dicGroupListData?.data"
          :props="defaultProps"
          style="--el-tree-node-content-height: 36px"
          default-expand-all
          @node-click="handleGroupChange"
          :expand-on-click-node="false"
        >
          <template #default="{data}">
            <span>{{ data.groupName || data.typeName }}</span>
          </template>
        </el-tree>
      </section-group>
    </el-col>

    <el-col :span="18">
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
    </el-col>
    <AddDic ref="addDicRef" @finish="refreshDicItemList" />
  </el-row>
</template>
