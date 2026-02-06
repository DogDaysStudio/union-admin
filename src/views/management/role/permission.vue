<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {useRequest} from 'vue-request'
import {ElMessage, ElMessageBox, type TreeNodeData} from 'element-plus'
import {iamAuthPermissionTree} from '@/service/api/iamAuthPermission'
import {amsSysDicList} from '@/service/api/amsSysDic'
import {iamAuthRoleGet, iamAuthRoleUpsert} from '@/service/api/iamAuth'
import {keysInTree} from '@/utils/array-util'
import RoleTable from './components/RoleTable.vue'

const {roleId} = defineProps<{
  roleId: string
}>()

// 标签页
const activeTab = ref('permission')
const activeSubTab = ref<string>()

// 角色信息
const {data: roleInfo} = useRequest(iamAuthRoleGet, {
  manual: false,
  defaultParams: [{roleId}],
})

// 更新角色权限(保存权限)
const upsertRole = useRequest(iamAuthRoleUpsert)

// 权限树
const {data: permissionTree} = useRequest(iamAuthPermissionTree, {
  manual: false,
  defaultParams: [{pageable: false} as AuthPermissionListDTO],
})

// 选中的节点 { "OMS": [], "PMS": [], "AMS": [] }
const selectedNodes = ref<Record<string, string[]>>({})
// 初始化选中的节点
watchEffect(() => {
  if (permissionTree?.value?.data && roleInfo.value?.data?.permList) {
    selectedNodes.value = dicList.value?.data?.reduce((prev, item) => {
      prev[item.dicCode] = keysInTree(
        roleInfo.value?.data?.permList?.map(item => item.permId),
        permissionTree.value?.data?.[item.dicCode],
        {key: 'permId'}
      )
      return prev
    }, {})
  }
})

// 码表数据（租赁、物业、资产）
const {data: dicList} = useRequest(amsSysDicList, {
  manual: false,
  defaultParams: [{dicType: 9000} as SysDicListDTO],
  onSuccess: response => {
    // 初始化默认选中的子标签页
    activeSubTab.value ??= response.data?.[0]?.dicCode
  },
})

// 处理保存权限
const handleSavePermission = async () => {
  const {msg} = await upsertRole.runAsync({
    roleName: roleInfo.value?.data?.roleName,
    userIdList: roleInfo.value?.data?.userList?.map(item => item.userId), // 加上，不然会清空用户数组
    roleId,
    permIdList: Object.values(selectedNodes.value).flat(),
  } as AuthRoleUpsertDTO)
  if (msg) ElMessage.success(msg)
}

// 处理添加人员
const handleAddMember = () => {
  // 实现添加人员逻辑
}

// 处理编辑角色
const handleEditRole = () => {
  // 实现编辑角色逻辑
}

// 处理停用角色
const handleDisableRole = async () => {
  await ElMessageBox.confirm('是否确定停用该角色', '确认提示')
  // 实现停用角色逻辑
  // const {msg} = await upsertRole.runAsync({
  //   roleId,
  //   enable: 1,
  // } as AuthRoleUpsertDTO)
  // if (msg) ElMessage.success(msg)
}

// 处理删除角色
const handleDeleteRole = async () => {
  await ElMessageBox.confirm('是否确定删除该角色', '确认提示')
  // 实现删除角色逻辑
  ElMessage.success('角色删除成功')
}

const customNodeClass = (data: TreeNodeData) =>
  !(data as AuthPermissionVO).children?.length ? 'is-last' : ''
</script>

<template>
  <!-- 角色信息头部 -->
  <section-group :header="false" content-class="pb-0!">
    <div class="flex items-center justify-between mb-base">
      <div class="flex items-center">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <i class="el-icon-user text-blue-500 text-xl"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold">{{ roleInfo?.data?.roleName }}</h2>
          <p class="text-gray-500 text-sm">{{ roleInfo?.data?.notes || '暂无相关描述' }}</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <el-button type="primary" @click="handleAddMember">
          <i class="el-icon-plus mr-1"></i>
          添加人员
        </el-button>
        <el-button @click="handleEditRole">
          <i class="el-icon-edit mr-1"></i>
          编辑角色
        </el-button>
        <el-button @click="handleDisableRole">
          <i class="el-icon-switch-button mr-1"></i>
          停用角色
        </el-button>
        <el-button type="danger" @click="handleDeleteRole">
          <i class="el-icon-delete mr-1"></i>
          删除角色
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="empty-tabs">
      <el-tab-pane label="操作权限" name="permission"></el-tab-pane>
      <el-tab-pane label="成员列表" name="member"></el-tab-pane>
    </el-tabs>
  </section-group>

  <!-- 标签页 -->
  <section-group :header="false" content-class="pt-0!">
    <!-- 操作权限内容 -->
    <div v-if="activeTab === 'permission'">
      <!-- 子标签页 -->
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

      <!-- 保存按钮 -->
      <div class="mt-6 flex justify-end">
        <el-button type="primary" :loading="upsertRole.loading.value" @click="handleSavePermission">
          保存权限
        </el-button>
      </div>
    </div>

    <!-- 成员列表内容 -->
    <div v-else-if="activeTab === 'member'" class="p-4">
      <role-table :user-list="roleInfo?.data.userList" />
    </div>
  </section-group>
</template>

<style scoped>
:deep() {
  .empty-tabs {
    & .el-tabs__header {
      margin-bottom: 0;
    }
    & .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
}

.is-last {
  display: inline-block;
}
</style>
