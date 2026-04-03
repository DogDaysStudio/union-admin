<script setup lang="ts">
import {Plus, Upload, Download, Search} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {
  pmsPmsDicGroupSearch,
  pmsPropertySopStepList,
  pmsPmsSopStepDelete,
} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {ref, defineAsyncComponent} from 'vue'
// import DicGroup from './components/dic-group.vue'
import {useExport} from '@/common/hooks'

const AddDic = defineAsyncComponent(() => import('./components/add-dic.vue'))

const defaultProps = {
  children: 'typeList',
  label: data => data.groupName || data.typeName,
}

const keyword = ref('')
const dicSearch = ref('')

const {
  data: dicGroupListData,
  runAsync: runDicGroupList,
  loading: dicGroupListLoading,
} = useRequest(pmsPmsDicGroupSearch, {
  manual: false,
  defaultParams: [{keyword: ''}],
})

const {
  data: sopStepListData,
  refresh: refreshSopStepList,
  loading: sopStepListLoading,
} = useRequest(pmsPropertySopStepList)

const currentCategoryId = ref('')
const addDicRef = ref<InstanceType<typeof AddDic>>()
const route = useRoute()
const tableRef = ref<InstanceType<typeof ElTable>>()
const sopId = route.params.id as string

const {runAsync: runSopStepDelete} = useRequest(pmsPmsSopStepDelete)

const {exportData, loading: exportLoading} = useExport({
  url: '/pms/sop-step/export' as keyof ApiType,
})

const handleSearchGroup = () => {
  runDicGroupList({keyword: keyword.value})
}

const handleExport = async () => {
  await exportData({sopId})
}

const handleAddDic = () => {
  addDicRef.value?.open({categoryId: currentCategoryId.value})
}

const handleDeleteStep = (row: PmsSopStepVO) => {
  ElMessageBox.confirm(`确定删除该步骤吗？${row.title}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await runSopStepDelete({stepId: row.id})
    await refreshSopStepList()
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
          <el-button :icon="Plus" class="size-8!"></el-button>
        </div>

        <el-tree
          :data="dicGroupListData?.data"
          :props="defaultProps"
          style="--el-tree-node-content-height: 32px"
          default-expand-all
        />
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
          ref="tableRef"
          :data="sopStepListData?.data"
          stripe
          border
          :loading="sopStepListLoading"
          row-key="id"
          class="w-full"
        >
          <el-table-column prop="title" label="名称" />
          <el-table-column prop="description" label="CODE" />
          <el-table-column prop="description" label="备注" />

          <el-table-column label="操作" align="center" width="80">
            <template #default="scope">
              <el-button link type="danger" @click="handleDeleteStep(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section-group>
    </el-col>
    <AddDic ref="addDicRef" @finish="refreshSopStepList" />
  </el-row>
</template>
