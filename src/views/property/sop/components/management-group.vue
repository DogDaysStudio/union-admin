<script setup lang="ts">
import {ref, computed} from 'vue'
import {Plus, Download, Upload, Rank} from '@element-plus/icons-vue'
import type {TreeNodeData, TreeInstance, CheckboxValueType} from 'element-plus'

const treeProps = {
  label: (data: TreeNodeData) => {
    return data.groupName || data.sopName
  },
  children: 'sopList',
}

const emit = defineEmits<{
  (e: 'addGroup'): void
}>()

const visible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const treeRef = ref<TreeInstance>()
const sopGroups = ref<PmsSopGroupVO[]>([])

const allSopKeys = computed(() => {
  const groupIds = sopGroups.value.map(item => item.id)
  const sopIds = sopGroups.value.flatMap(item => item.sopList.map(sop => sop.id))
  return [...groupIds, ...sopIds]
})

const handleOpen = (groups: PmsSopGroupVO[]) => {
  sopGroups.value = groups
  visible.value = true
}

const handleClose = () => {
  visible.value = false
  handleUncheckAll()
}

const handleSubmit = () => {
  console.log('submit')
}

const handleAddGroup = () => {
  emit('addGroup')
}

const handleUncheckAll = () => {
  checkAll.value = false
  isIndeterminate.value = false
  treeRef.value?.setCheckedKeys([])
}

const handleCheckAll = () => {
  treeRef.value?.setCheckedKeys(allSopKeys.value)
}

const handleCheckAllChange = (val: CheckboxValueType) => {
  if (val) {
    handleCheckAll()
  } else {
    handleUncheckAll()
  }
}

const handleSopCheckChange = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys()
  if (checkedKeys?.length === allSopKeys.value.length) {
    checkAll.value = true
    isIndeterminate.value = false
    return
  }
  if (checkedKeys?.length === 0) {
    checkAll.value = false
    isIndeterminate.value = false
    return
  }
  checkAll.value = false
  isIndeterminate.value = true
  return
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" width="760px">
    <template #title>
      <h2 class="font-bold text-xl">管理分组</h2>
      <p class="text-gray-500 text-sm mt-1">
        对分组管理及其SOP条目管理，可删除分组、移动和复制条目到其他分组
      </p>
    </template>
    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全部
        </el-checkbox>
        <el-button link :icon="Download" class="ml-3!">全部折叠</el-button>
        <el-button link :icon="Upload">全部展开</el-button>
        <el-button type="primary" @click="handleAddGroup" link :icon="Plus" class="ml-auto!">
          新建分组
        </el-button>
      </div>
      <el-tree
        ref="treeRef"
        :data="sopGroups"
        :props="treeProps"
        default-expand-all
        node-key="id"
        show-checkbox
        @check-change="handleSopCheckChange"
        check-strictly
        draggable
        :expand-on-click-node="false"
        style="--el-tree-node-content-height: 32px"
      >
        <template #default="{data}">
          <div class="flex items-center justify-between flex-1 pr-2">
            <span>{{ data.groupName || data.sopName }}</span>
            <el-icon :size="14" class="shrink-0 text-gray-500!">
              <Rank />
            </el-icon>
          </div>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
