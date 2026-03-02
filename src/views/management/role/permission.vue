<script setup lang="ts">
import {computed, ref, useTemplateRef} from 'vue'
import {useRequest} from 'vue-request'
import {ElMessage, ElMessageBox} from 'element-plus'
import {iamAuthRoleGet, iamAuthRoleUpsert} from '@/service/api/iamAuth'
import RoleTable from './components/RoleTable.vue'
import UserPermission from './components/UserPermission.vue'

const {roleId} = defineProps<{
  roleId: string
}>()

// 标签页
const activeTab = ref('permission')

// 角色信息
const {data: roleInfo} = useRequest(iamAuthRoleGet, {
  manual: false,
  defaultParams: [{roleId}],
})
const permIdList = computed(() => roleInfo?.value?.data?.permList?.map(item => item.permId) || [])

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

const userPermission = useTemplateRef('userPermission')
// 更新角色权限(保存权限)
const upsertRole = useRequest(iamAuthRoleUpsert)

// 处理保存权限
const handleSavePermission = async () => {
  const selectedNodes = userPermission.value?.getSelectedNodes() || {}
  const {msg} = await upsertRole.runAsync({
    roleName: roleInfo.value?.data?.roleName,
    userIdList: roleInfo.value?.data?.userList?.map(item => item.userId), // 加上，不然会清空用户数组
    roleId,
    permIdList: Object.values(selectedNodes).flat(),
  } as AuthRoleUpsertDTO)
  if (msg) ElMessage.success(msg)
}
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
      <UserPermission ref="userPermission" :perm-id-list="permIdList" />
      <!-- <el-tabs v-model="activeSubTab">
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
      </el-tabs> -->

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
