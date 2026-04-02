<script setup lang="ts">
import {ref, computed} from 'vue'
import {
  Plus,
  Download,
  Upload,
  Rank,
  Close,
  Check,
  CopyDocument,
  Delete,
} from '@element-plus/icons-vue'
import type {
  TreeNodeData,
  TreeInstance,
  CheckboxValueType,
  RenderContentContext,
  TreeKey,
} from 'element-plus'
import {
  pmsPropertyGroupSort,
  pmsPropertySopMove,
  pmsPropertyGroupUInsert,
  pmsPmsSopDelete,
  pmsPmsSopGroupDeleteBatch,
} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

type Node = RenderContentContext['node']

const treeProps = {
  label: (data: TreeNodeData) => {
    return data.groupName || data.sopName
  },
  children: 'sopList',
}

const {groupList = []} = defineProps<{
  groupList: PmsSopGroupVO[]
}>()

const emit = defineEmits<{
  (e: 're-group'): void
  (e: 're-sort'): void
  (e: 'add-group'): void
  (e: 'copy-sop', payload: {sopIds: string[]}): void
}>()

const visible = ref(false)
const isAdd = ref(false)
const newGroupName = ref('')
const checkedKeys = ref<TreeKey[]>([])

const treeRef = ref<TreeInstance>()

const {runAsync: sortGroupAsync, loading: sortGroupLoading} = useRequest(pmsPropertyGroupSort)
const {runAsync: moveSopAsync, loading: moveSopLoading} = useRequest(pmsPropertySopMove)
const {runAsync: addGroupAsync, loading: addGroupLoading} = useRequest(pmsPropertyGroupUInsert)
const {runAsync: deleteGroupAsync} = useRequest(pmsPmsSopGroupDeleteBatch)
const {runAsync: deleteSopAsync} = useRequest(pmsPmsSopDelete)

const allSopKeys = computed(() => {
  const groupIds = groupList.map(item => item.id)
  const sopIds = groupList.flatMap(item => item.sopList.map(sop => sop.id))
  return [...groupIds, ...sopIds]
})

const isCheckedAll = computed(() => {
  return checkedKeys.value.length === allSopKeys.value.length
})

const isIndeterminate = computed(() => {
  return checkedKeys.value.length > 0 && checkedKeys.value.length < allSopKeys.value.length
})

const handleOpen = () => {
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
  isAdd.value = true
}

const handleCancelAddGroup = () => {
  isAdd.value = false
  newGroupName.value = ''
}

const handleAddGroupConfirm = async () => {
  const lastGroup = [...groupList].sort((a, b) => b.sortOrder - a.sortOrder)[0]
  const sortOrder = lastGroup ? lastGroup.sortOrder + 1 : 0
  await addGroupAsync({groupName: newGroupName.value, sortOrder})
  emit('add-group')
  handleCancelAddGroup()
}

const handleNodeDrop = (draggingNode: Node, dropNode: Node) => {
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
  const groupIds = groupList.map(item => item.id)
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
  checkedKeys.value = []
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
  const keys = treeRef.value?.getCheckedKeys()
  checkedKeys.value = keys || []
}

const handleToggleAllExpanded = (expanded: boolean) => {
  const allNodes = treeRef.value.store._getAllNodes()
  allNodes.forEach(node => {
    node.expanded = expanded
  })
}

const handleCopy = () => {
  const nodes = treeRef.value?.getCheckedNodes()
  const sopIds = nodes?.filter(item => !!item.groupId).map(item => item.id)
  emit('copy-sop', {sopIds})
}

const handleDelete = () => {
  const nodes = treeRef.value?.getCheckedNodes()
  const sopIds = nodes?.filter(item => !!item.groupId).map(item => item.id)
  const groupIds = nodes?.filter(item => !item.groupId).map(item => item.id)
  const msg = `确定删除${groupIds?.length}个分组，${sopIds?.length}个SOP吗？`

  ElMessageBox.confirm(msg, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteSopAsync({sopIds})
    await deleteGroupAsync({groupIds})
    emit('re-group')
  })
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
        <div class="flex items-center">
          <el-checkbox
            v-model="isCheckedAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            :disabled="isAdd"
          >
            全部
          </el-checkbox>
          <el-button link :icon="Download" class="ml-3!" @click="handleToggleAllExpanded(false)">
            全部折叠
          </el-button>
          <el-button link :icon="Upload" @click="handleToggleAllExpanded(true)">全部展开</el-button>
        </div>
        <div class="ml-auto" v-if="checkedKeys.length <= 0 && !isAdd">
          <el-button type="primary" @click="handleAddGroup" link :icon="Plus">新建分组</el-button>
        </div>
        <div class="ml-auto" v-if="checkedKeys.length > 0">
          <el-button type="primary" @click="handleCopy" link :icon="CopyDocument">复制</el-button>
          <el-button type="danger" @click="handleDelete" link :icon="Delete">删除</el-button>
        </div>
      </div>
      <el-tree
        ref="treeRef"
        :data="groupList"
        :props="treeProps"
        default-expand-all
        node-key="id"
        show-checkbox
        @check-change="handleSopCheckChange"
        :draggable="!isAdd"
        :check-on-click-node="true"
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

      <div v-if="isAdd" class="mt-2 pl-6 flex items-center gap-2">
        <el-input v-model="newGroupName" placeholder="请输入分组名称" />
        <el-button
          type="primary"
          :icon="Check"
          class="ml-auto! size-8"
          :loading="addGroupLoading"
          @click="handleAddGroupConfirm"
        />
        <el-button :icon="Close" class="ml-auto! size-8" @click="handleCancelAddGroup" />
      </div>
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
