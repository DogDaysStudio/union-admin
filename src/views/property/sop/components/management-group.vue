<script setup lang="ts">
import {ref, computed} from 'vue'
import {Plus, Download, Upload, Rank} from '@element-plus/icons-vue'
import type {
  TreeNodeData,
  TreeInstance,
  CheckboxValueType,
  RenderContentContext,
} from 'element-plus'
import {pmsPropertyGroupSort, pmsPropertySopMove} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

type Node = RenderContentContext['node']

const treeProps = {
  label: (data: TreeNodeData) => {
    return data.groupName || data.sopName
  },
  children: 'sopList',
}

const emit = defineEmits<{
  (e: 're-group'): void
  (e: 're-sort'): void
}>()

const visible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const treeRef = ref<TreeInstance>()
const sopGroups = ref<PmsSopGroupVO[]>([])

const {runAsync: sortGroupAsync, loading: sortGroupLoading} = useRequest(pmsPropertyGroupSort)
const {runAsync: moveSopAsync, loading: moveSopLoading} = useRequest(pmsPropertySopMove)

const allSopKeys = computed(() => {
  const groupIds = sopGroups.value.map(item => item.id)
  const sopIds = sopGroups.value.flatMap(item => item.sopList.map(sop => sop.id))
  return [...groupIds, ...sopIds]
})

const handleOpen = (groups: PmsSopGroupVO[]) => {
  sopGroups.value = groups
  visible.value = true
}

const handleAllowDrop = (draggingNode: Node, dropNode: Node, type: 'inner' | 'prev' | 'next') => {
  const draggingData = draggingNode.data as unknown as PmsSopGroupVO | PmsSopTemplateVO
  const dropData = dropNode.data as unknown as PmsSopGroupVO | PmsSopTemplateVO

  const isGraggingGroup = 'groupName' in draggingData
  const isDroppingGroup = 'groupName' in dropData
  const isDraggingSop = 'sopName' in draggingData

  if (isGraggingGroup && isDroppingGroup && type !== 'inner') return true // 只能将分组拖拽到其他分组

  if (isDraggingSop && isDroppingGroup && type === 'inner') {
    // 只能将SOP拖拽到其他分组
    return true
  }

  return false
}

const handleAddGroup = () => {
  // emit('re-group')
}

const handleNodeDrop = (draggingNode: Node, dropNode: Node, type: 'inner' | 'before' | 'after') => {
  console.log({draggingNode, dropNode, type})
  const isDroppingGroup = 'groupName' in draggingNode.data
  const isDroppingSop = 'sopName' in draggingNode.data
  if (isDroppingGroup) {
    handleSortGroup()
  }
  if (isDroppingSop) {
    handleMoveSop(draggingNode, dropNode)
  }
}

const handleSortGroup = async () => {
  const groupIds = sopGroups.value.map(item => item.id)
  await sortGroupAsync({groupIds})
  emit('re-sort')
}

const handleMoveSop = async (draggingNode: Node, dropNode: Node) => {
  const sopId = (draggingNode.data as PmsSopTemplateVO).id
  const targetGroupId = (dropNode.data as PmsSopGroupVO).id
  await moveSopAsync({sopId, targetGroupId})
  emit('re-group')
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
    <div class="flex flex-col" v-loading="sortGroupLoading || moveSopLoading">
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
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
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
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep() {
  .el-tree-node.is-drop-inner {
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
