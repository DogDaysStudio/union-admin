<script setup lang="ts">
import {onMounted, ref, defineAsyncComponent, computed} from 'vue'
import {Plus, Search} from '@element-plus/icons-vue'
import {pmsPmsSopGroupSearch} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import SopCard from './components/sop-card.vue'

const AddSop = defineAsyncComponent(() => import('./components/add-sop.vue'))
const ManagementGroup = defineAsyncComponent(() => import('./components/management-group.vue'))
const CopySop = defineAsyncComponent(() => import('./components/copy-sop.vue'))

const addSopRef = ref<InstanceType<typeof AddSop>>()
const managementGroupRef = ref<InstanceType<typeof ManagementGroup>>()
const copySopRef = ref<InstanceType<typeof CopySop>>()

const groupName = ref('')

const {
  data: sopGroupList,
  runAsync: runSopGroupList,
  loading: sopGroupListLoading,
  refresh: refreshSopGroupList,
} = useRequest(pmsPmsSopGroupSearch)

const groupOptions = computed(() => {
  return (
    sopGroupList.value?.data.map(item => ({
      label: item.groupName,
      value: item.id,
    })) || []
  )
})

const handleAddSop = () => {
  addSopRef.value?.open(groupOptions.value)
}

const handleManagementGroup = () => {
  managementGroupRef.value?.open()
}

const handleCopySop = (payload: {sopIds: string[]}) => {
  copySopRef.value?.open(payload)
}

const handleSearch = () => {
  runSopGroupList({groupName: groupName.value})
}

onMounted(async () => {
  await runSopGroupList()
})
</script>

<template>
  <section-group title="SOP 管理">
    <template #title>
      <h2 class="font-bold text-xl">SOP 管理</h2>
      <p class="text-gray-500 mt-1">管理和创建SOP分类，可以增加和移动分组，显示包含子项类目。</p>
    </template>

    <template #extra>
      <el-input
        placeholder="支持搜索SOP名称、SOP子项名称"
        v-model="groupName"
        :prefix-icon="Search"
        style="width: 300px"
        @keyup.enter="handleSearch"
        clearable
        @clear="handleSearch"
      ></el-input>
      <el-button class="ml-3.5" :icon="Plus" @click="handleAddSop">新建SOP</el-button>
      <el-button @click="handleManagementGroup">管理分组</el-button>
    </template>

    <div class="flex flex-col gap-10 min-h-50" v-loading="sopGroupListLoading">
      <div v-for="group in sopGroupList?.data" :key="group.id">
        <h2 class="font-bold text-base">{{ group.groupName }}</h2>
        <div class="mt-5 grid grid-cols-2 gap-y-5 gap-x-10" v-if="group.sopList?.length > 0">
          <SopCard v-for="sop in group.sopList" :key="sop.id" :item="sop" />
        </div>
        <div class="mt-5 grid grid-cols-2 gap-y-5 gap-x-10" v-else>
          <el-card shadow="never">
            <span class="text-gray-400">暂无SOP</span>
          </el-card>
        </div>
      </div>
    </div>

    <AddSop ref="addSopRef" @finish="refreshSopGroupList" />
    <ManagementGroup
      ref="managementGroupRef"
      @re-group="refreshSopGroupList"
      @re-sort="refreshSopGroupList"
      @add-group="refreshSopGroupList"
      :groupList="sopGroupList?.data"
      @copy-sop="handleCopySop"
    />
    <CopySop ref="copySopRef" @finish="refreshSopGroupList" :groupOptions="groupOptions" />
  </section-group>
</template>
