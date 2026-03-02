<script setup lang="ts">
import {amsSysDicList} from '@/service/api/amsSysDic'
// import {iamAuthRoleGet, iamAuthRoleUpsert} from '@/service/api/iamAuth'
import {iamAuthPermissionTree} from '@/service/api/iamAuthPermission'
import {keysInTree} from '@/utils/array-util'
import type {TreeNodeData} from 'element-plus'
import {ref, watchEffect} from 'vue'
import {useRequest} from 'vue-request'

const props = defineProps<{
  permIdList: string[]
}>()

defineExpose({
  getSelectedNodes: () => selectedNodes.value,
})

const activeSubTab = ref<string>()

// 码表数据（租赁、物业、资产）
const {data: dicList} = useRequest(amsSysDicList, {
  manual: false,
  defaultParams: [{dicType: 9000} as SysDicListDTO],
  onSuccess: response => {
    // 初始化默认选中的子标签页
    activeSubTab.value ??= response.data?.[0]?.dicCode
  },
})

// 权限树
const {data: permissionTree} = useRequest(iamAuthPermissionTree, {
  manual: false,
  defaultParams: [{pageable: false} as AuthPermissionListDTO],
})

// 选中的节点 { "OMS": [], "PMS": [], "AMS": [] }
const selectedNodes = ref<Record<string, string[]>>({})
// 初始化选中的节点
watchEffect(() => {
  if (permissionTree?.value?.data && props.permIdList) {
    selectedNodes.value = dicList.value?.data?.reduce((prev, item) => {
      prev[item.dicCode] = keysInTree(
        props.permIdList,
        permissionTree.value?.data?.[item.dicCode],
        {key: 'permId'}
      )
      return prev
    }, {})
  }
})

const customNodeClass = (data: TreeNodeData) =>
  !(data as AuthPermissionVO).children?.length ? 'is-last' : ''
</script>

<template>
  <el-tabs v-model="activeSubTab">
    <el-tab-pane
      v-for="dic in dicList?.data"
      :label="dic.dicName"
      :name="dic.dicCode"
      :key="dic.dicCode"
    >
      <el-tree
        show-checkbox
        default-expand-all
        node-key="permId"
        :expand-on-click-node="false"
        :props="{label: 'permName', class: customNodeClass}"
        :data="permissionTree?.data?.[dic.dicCode]"
        @check="
          (_, checkedInfo) =>
            (selectedNodes[dic.dicCode] = [...((checkedInfo?.checkedKeys as string[]) || [])])
        "
        :default-checked-keys="selectedNodes[dic.dicCode]"
      />
    </el-tab-pane>
  </el-tabs>
</template>
