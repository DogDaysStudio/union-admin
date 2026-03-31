<script setup lang="ts">
import {onMounted, ref, defineAsyncComponent, computed} from 'vue'
import {Plus, Search, ArrowRight, School} from '@element-plus/icons-vue'
import {pmsPropertyGroupList} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const AddSop = defineAsyncComponent(() => import('./components/add-sop.vue'))

const addSopRef = ref<InstanceType<typeof AddSop>>()

const {
  data: sopGroupList,
  runAsync: runSopGroupList,
  loading: sopGroupListLoading,
} = useRequest(pmsPropertyGroupList)

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

const handleAddSopFinish = () => {
  runSopGroupList()
}

onMounted(async () => {
  await runSopGroupList()
})
</script>

<template>
  <div class="">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-bold text-xl">SOP 管理</h2>
        <p class="text-gray-500 mt-1">管理和创建SOP分类，可以增加和移动分组，显示包含子项类目。</p>
      </div>
      <div class="flex">
        <el-input
          placeholder="支持搜索SOP名称、SOP子项名称"
          :prefix-icon="Search"
          style="width: 300px"
        ></el-input>
        <el-button class="ml-3.5" :icon="Plus" @click="handleAddSop">新建SOP</el-button>
        <el-button>管理分组</el-button>
      </div>
    </div>

    <div class="flex flex-col gap-10 mt-15 min-h-50" v-loading="sopGroupListLoading">
      <div v-for="sop in sopGroupList?.data" :key="sop.id">
        <h2 class="font-bold text-base">{{ sop.groupName }}</h2>
        <div class="mt-5 grid grid-cols-2 gap-y-5 gap-x-10" v-if="sop.sopList?.length > 0">
          <div
            v-for="item in sop.sopList"
            :key="item.id"
            class="bg-gray-100 rounded-sm overflow-hidden p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-200 transition-all duration-300"
          >
            <el-icon :size="32" class="shrink-0 text-gray-400!">
              <School />
            </el-icon>
            <div class="flex-1">
              <h4 class="line-clamp-1">{{ item.sopName }}</h4>
              <p class="text-gray-500 text-sm mt-1 line-clamp-1">
                包含子项：{{ item.categorySummary }}
              </p>
            </div>
            <el-icon :size="16" class="shrink-0 text-gray-500!">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div v-else class="mt-5 bg-gray-50 rounded-sm p-4 flex items-center justify-center">
          <span class="text-gray-500 text-sm">暂无SOP</span>
        </div>
      </div>
    </div>

    <AddSop ref="addSopRef" @finish="handleAddSopFinish" />
  </div>
</template>
