<script setup lang="ts">
import {Plus, Upload, Download, Sort, EditPen} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {
  pmsPropertySopCategoryList,
  pmsPropertySopCategoryInsert,
  pmsPropertySopStepList,
  pmsPropertySopStepEnable,
  pmsPropertySopStepSort,
  pmsPmsSopDetail,
} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {onMounted, ref, defineAsyncComponent} from 'vue'
import SopCategory from './components/sop-category.vue'
import Sortable from 'sortablejs'
import {useExport} from '@/common/hooks'

const AddStep = defineAsyncComponent(() => import('./components/add-step.vue'))
const UpdateStop = defineAsyncComponent(() => import('./components/update-stop.vue'))

const {
  data: sopCategoryListData,
  runAsync: runSopCategoryList,
  refresh: refreshSopCategoryList,
} = useRequest(pmsPropertySopCategoryList)
const {
  data: sopStepListData,
  runAsync: runSopStepList,
  refresh: refreshSopStepList,
  loading: sopStepListLoading,
} = useRequest(pmsPropertySopStepList)

const newCategoryName = ref('')
const searchStepTitle = ref('')
const currentCategoryId = ref('')
const isAddingCategory = ref(false)
const addStepRef = ref<InstanceType<typeof AddStep>>()
const updateStopRef = ref<InstanceType<typeof UpdateStop>>()
const route = useRoute()
const tableRef = ref<InstanceType<typeof ElTable>>()
const sopId = route.params.id as string

const {runAsync: runSopStepSort, loading: sopStepSortLoading} = useRequest(pmsPropertySopStepSort)

const {runAsync: runSopCategoryInsert, loading: sopCategoryInsertLoading} = useRequest(
  pmsPropertySopCategoryInsert
)
const {runAsync: runSopStepEnable, loading: sopStepEnableLoading} =
  useRequest(pmsPropertySopStepEnable)

const {data: sopDetailData, refresh: refreshSopDetail} = useRequest(pmsPmsSopDetail, {
  manual: false,
  defaultParams: [{sopId}],
})

const {exportData, loading: exportLoading} = useExport({
  url: '/pms/sop-step/export' as keyof ApiType,
})

const handleExport = async () => {
  await exportData({sopId})
}

const handleAddSopCategory = () => {
  isAddingCategory.value = true
}

const handleSopCategorySubmit = async () => {
  await runSopCategoryInsert({
    sopId: sopId,
    categoryName: newCategoryName.value,
  })
  await refreshSopCategoryList()
  isAddingCategory.value = false
  newCategoryName.value = ''
}

const handleAddStep = () => {
  addStepRef.value?.open({categoryId: currentCategoryId.value})
}

const handleEditStep = (row: PmsSopStepVO) => {
  addStepRef.value?.open(row)
}

const handleDeleteStep = (row: PmsSopStepVO) => {
  // ElMessageBox.confirm('确定删除该步骤吗？', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // }).then(async () => {
  //   await runSopStepDelete({ stepId: row.id })
  //   await refreshSopStepList()
  // })
  console.log(row)
}

const handleUpdateStop = () => {
  updateStopRef.value?.open(sopDetailData.value?.data)
}

const handleSopStepEnable = async (row: PmsSopStepVO) => {
  await runSopStepEnable({stepId: row.id, enable: row.enable})
  await refreshSopStepList()
}

const handleSopCategoryClick = async (id: string) => {
  currentCategoryId.value = id
  await runSopStepList({sopId, categoryId: id})
}

const initDraggable = () => {
  const tbody = tableRef.value.$el.querySelector('.el-table__body-wrapper tbody')

  Sortable.create(tbody, {
    animation: 150,
    async onEnd(evt) {
      const {oldIndex, newIndex} = evt
      const currRow = sopStepListData.value?.data?.splice(oldIndex, 1)[0]
      sopStepListData.value?.data?.splice(newIndex, 0, currRow)
      await runSopStepSort({stepIds: sopStepListData.value?.data?.map(item => item.id) || []})
      await refreshSopStepList()
    },
  })
}

onMounted(async () => {
  await runSopCategoryList({sopId})
  currentCategoryId.value = sopCategoryListData.value?.data[0]?.id
  await runSopStepList({sopId, categoryId: currentCategoryId.value})
  initDraggable()
})
</script>

<template>
  <section-group title="SOP 管理">
    <template #title>
      <h2 class="font-bold text-xl/8 flex items-center gap-1 group">
        <span>{{ sopDetailData?.data?.sopName || 'SOP 详情' }}</span>
        <el-button
          class="size-8 opacity-0 group-hover:opacity-100"
          text
          :icon="EditPen"
          @click="handleUpdateStop"
        />
      </h2>
      <p class="flex items-center gap-1 group">
        <span v-if="sopDetailData?.data?.description">{{ sopDetailData?.data?.description }}</span>
        <span v-else class="text-gray-400">
          SOP的说明，比如：适用场景、来源依据、版本相关信息等。
        </span>
        <el-button
          class="size-8 opacity-0 group-hover:opacity-100"
          text
          :icon="EditPen"
          @click="handleUpdateStop"
        />
      </p>
    </template>

    <div class="flex gap-3">
      <div class="w-60 min-h-50">
        <div v-if="sopCategoryListData?.data?.length > 0" class="flex flex-col gap-3">
          <div
            v-for="item in sopCategoryListData.data"
            :key="item.id"
            @click="handleSopCategoryClick(item.id)"
          >
            <SopCategory :sopCategory="item" :isActive="item.id === currentCategoryId" />
          </div>
        </div>
        <div v-else class="flex justify-center items-center mb-4">
          <p class="text-gray-500 text-sm text-center py-5 bg-gray-50 rounded-sm">暂无分类</p>
        </div>
        <el-input
          v-model="newCategoryName"
          placeholder="请输入分类名称"
          class="w-full my-3"
          v-if="isAddingCategory"
          @keyup.enter="handleSopCategorySubmit"
          :disabled="sopCategoryInsertLoading"
        />
        <el-button
          :icon="Plus"
          @click="handleAddSopCategory"
          class="w-full"
          :disabled="isAddingCategory || sopCategoryInsertLoading"
        >
          增加SOP分类
        </el-button>
      </div>

      <div class="flex-1">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-bold text-base shrink-0 mr-50">步骤</h2>
          <el-input v-model="searchStepTitle" placeholder="搜索步骤" />
          <el-button :icon="Upload">上传</el-button>
          <el-button :icon="Download" @click="handleExport" :loading="exportLoading">
            下载
          </el-button>
          <el-button :icon="Plus" @click="handleAddStep">增加步骤</el-button>
        </div>
        <el-table
          ref="tableRef"
          :data="sopStepListData?.data"
          stripe
          border
          :loading="sopStepListLoading || sopStepSortLoading"
          row-key="id"
        >
          <el-table-column prop="enable" label="状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.enable"
                @change="handleSopStepEnable(scope.row)"
                :loading="sopStepEnableLoading"
                :active-value="1"
                :inactive-value="0"
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="prompt" label="提示语" />
          <el-table-column prop="workHours" label="工时" />
          <el-table-column prop="score" label="分值" />
          <el-table-column prop="required" label="必填" />
          <el-table-column prop="photoRequired" label="拍照" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleEditStep(scope.row)">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteStep(scope.row)">删除</el-button>
              <el-button link type="primary" :icon="Sort" class=".drag-handle"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <AddStep ref="addStepRef" @finish="refreshSopStepList" />
    <UpdateStop ref="updateStopRef" @finish="refreshSopDetail" />
  </section-group>
</template>
