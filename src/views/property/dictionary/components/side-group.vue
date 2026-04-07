<script setup lang="ts">
import {Plus, Search} from '@element-plus/icons-vue'
import {nextTick, ref} from 'vue'
import {ElInput} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  pmsPmsDicGroupSearch,
  pmsPmsDicGroupInsert,
  pmsPmsDicTypeInsert,
} from '@/service/api/pmsProperty'

const DefaultGroupName = '未命名分组'
const DefaultTypeName = '未命名字典'

const emit = defineEmits<{
  (e: 'change-type', id: string): void
}>()

const keyword = ref('')
const typeId = ref('')

const newGroupName = ref(DefaultGroupName)
const isAddingGroup = ref(false)
const inputGroupNameRef = ref<InstanceType<typeof ElInput>>()

const addingTypeGroupId = ref('')
const newTypeName = ref(DefaultTypeName)
const inputTypeNameRef = ref<InstanceType<typeof ElInput>>()

const {
  data: dicGroupListData,
  // runAsync: runDicGroupList,
  loading: dicGroupListLoading,
  refresh: refreshDicGroupList,
} = useRequest(pmsPmsDicGroupSearch, {
  manual: false,
  defaultParams: [{keyword: ''}],
})

const {runAsync: runDicGroupInsert} = useRequest(pmsPmsDicGroupInsert)
const {runAsync: runDicTypeInsert} = useRequest(pmsPmsDicTypeInsert)

const handleTypeChange = (item: PmsDicTypeVO) => {
  typeId.value = item.id
  emit('change-type', item.id)
}

const handleSearchGroup = () => {
  console.log('search group')
}

const handleAddGroup = () => {
  isAddingGroup.value = true
  nextTick(() => {
    inputGroupNameRef.value?.focus()
  })
}

const handleAddGroupCancel = () => {
  isAddingGroup.value = false
  newGroupName.value = DefaultGroupName
}

const handleGroupSubmit = async () => {
  if (newGroupName.value.trim() === '' || newGroupName.value.trim() === DefaultGroupName) {
    handleAddGroupCancel()
    return
  }
  await runDicGroupInsert({groupName: newGroupName.value})
  handleAddGroupCancel()
  refreshDicGroupList()
}

const handleAddType = (group: PmsDicGroupVO) => {
  addingTypeGroupId.value = group.id
  console.log('add type', group)
}

const handleTypeSubmit = async () => {
  if (newTypeName.value.trim() === '' || newTypeName.value.trim() === DefaultTypeName) {
    handleTypeCancel()
    return
  }
  await runDicTypeInsert({groupId: addingTypeGroupId.value})
  handleTypeCancel()
  refreshDicGroupList()
}

const handleTypeCancel = () => {
  addingTypeGroupId.value = ''
  newTypeName.value = DefaultTypeName
}
</script>

tem
<template>
  <section-group title="字典管理" class="h-full">
    <template #extra>
      <el-button
        :icon="Plus"
        link
        type="primary"
        @click="handleAddGroup"
        :disabled="isAddingGroup"
      ></el-button>
    </template>

    <div v-loading="dicGroupListLoading" class="flex flex-col gap-3">
      <el-input
        v-model="keyword"
        placeholder="搜索分组"
        class="mr-3"
        :prefix-icon="Search"
        @keydown.enter="handleSearchGroup"
        clearable
        @clear="handleSearchGroup"
        :disabled="isAddingGroup"
      />

      <el-collapse>
        <el-collapse-item
          v-for="group in dicGroupListData?.data"
          :key="group.id"
          :title="group.groupName"
        >
          <div
            v-for="item in group.typeList"
            :key="item.id"
            class="cursor-pointer px-3 text-sm/9 transition-all duration-300 rounded-sm"
            :class="{
              'bg-sky-50 text-sky-600': typeId === item.id,
              'text-gray-500 hover:bg-gray-100': typeId !== item.id,
            }"
            @click="handleTypeChange(item)"
          >
            <span>{{ item.typeName }}</span>
          </div>
          <el-button
            :icon="Plus"
            text
            type="primary"
            class="w-full justify-start! pl-3!"
            @click="handleAddType(group)"
            v-if="addingTypeGroupId !== group.id"
            :disabled="addingTypeGroupId === group.id"
          >
            字典
          </el-button>
          <el-input
            v-model="newTypeName"
            ref="inputTypeNameRef"
            v-if="addingTypeGroupId === group.id"
            @blur="handleTypeSubmit"
            @keyup.enter="handleTypeSubmit"
          ></el-input>
        </el-collapse-item>
      </el-collapse>
      <el-input
        v-model="newGroupName"
        ref="inputGroupNameRef"
        v-if="isAddingGroup"
        @blur="handleGroupSubmit"
        @keyup.enter="handleGroupSubmit"
      ></el-input>
    </div>
  </section-group>
</template>
