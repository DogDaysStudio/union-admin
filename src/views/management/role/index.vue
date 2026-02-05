<script setup lang="ts">
import {reactive, ref, useTemplateRef} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {usePagination, useRequest} from 'vue-request'
import {iamAuth} from '@/service/api/iamAuth'
import {useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {iamAuthUser} from '@/service/api/imaAuthUser'
import {rules} from '@/common/rules'

const searchForm = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AuthRoleListDTO)

const {
  data: roleList,
  runAsync: runRoleList,
  refresh: refreshRoleList,
  loading: roleListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(iamAuth.iamAuthRoleList, {
  manual: false,
  defaultParams: [searchForm],
})

const upsertRole = useRequest(iamAuth.iamAuthRoleUpsert)
const deleteRole = useRequest(iamAuth.iamAuthRoleDelete)
const enableRole = useRequest(iamAuth.iamAuthRoleEnable)

// 添加/编辑表单
const dialogVisible = ref(false)

// 编辑表单引用
const editFormRef = useTemplateRef('editFormRef')
const [editForm, resetEditForm] = useForm(
  {
    // roleName: '管理员',
    // notes: '这是一个管理员角色',
  } as AuthRoleUpsertDTO,
  editFormRef
)

// 处理添加
const handleAdd = () => {
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: AuthRoleVO) => {
  dialogVisible.value = true
  // 填充表单数据
  Object.assign(editForm, row)
}

// 处理删除
const handleDelete = async (row: AuthRoleVO) => {
  await ElMessageBox.confirm('是否确定删除角色', '确认提示')
  await deleteRole.runAsync({roleId: row.roleId})
  ElMessage.success('删除成功')
  await refreshRoleList()
}

// 处理状态切换
const handleStatusChange = async (row: AuthRoleVO) => {
  const nextEnable = !row.enable
  await ElMessageBox.confirm(`是否确定${nextEnable ? '启用' : '禁用'}该角色`, '确认提示')
  await enableRole.runAsync({roleId: row.roleId, enable: nextEnable, enableNotes: ''})
  ElMessage.success(`${nextEnable ? '启用' : '禁用'}成功`)
  await refreshRoleList()
}

// 处理表单提交
const handleSubmit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate()

  await upsertRole.runAsync(editForm)
  ElMessage.success(`${editForm.roleId ? '编辑' : '新增'}成功`)
  dialogVisible.value = false
  await refreshRoleList()
}

// 处理权限设置
const handlePermissionSet = () => {
  // 权限设置先占位，不实现
  ElMessage.info('权限设置功能暂未实现')
}

// 添加人员弹窗
const addUserDialogVisible = ref(false)
const addUserFormRef = useTemplateRef('addUserFormRef')
const [addUserForm, resetAddUserForm] = useForm({} as AuthRoleUpsertDTO, addUserFormRef)

// 人员列表数据
const {data: employeeList, runAsync: runEmployeeList} = useRequest(iamAuthUser.iamAuthUserList)

// 处理添加人员
const handleAddUser = async (row: AuthRoleVO) => {
  addUserDialogVisible.value = true

  runEmployeeList({pageable: false} as AuthUserListDTO)

  const {data: roleDetail} = await iamAuth.iamAuthRoleGet({roleId: row.roleId})
  addUserForm.roleId = row.roleId
  addUserForm.roleName = row.roleName
  addUserForm.userIdList = roleDetail?.userList.map(item => item.userId)
}

// 处理添加人员提交
const handleAddUserSubmit = async () => {
  if (!addUserFormRef.value) return
  await addUserFormRef.value.validate()

  await upsertRole.runAsync(addUserForm)
  // 这里需要调用 API 来添加人员到角色
  ElMessage.success('添加人员成功')
  addUserDialogVisible.value = false
  await refreshRoleList()
}

// // 清空已选员工
// const handleClearSelected = () => {
//   selectedEmployees.value = []
// }

const searchFormSchema = defineSchema({
  fields: [
    defineField.Input({label: '输入查询', prop: 'roleName'}),
    defineField.Select({
      label: '角色状态',
      prop: 'enable',
      options: [
        {label: '启用', value: 1},
        {label: '禁用', value: 0},
      ],
    }),
  ],
})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="searchFormSchema"
      :model="searchForm"
      @finish="runRoleList(searchForm)"
      @reset="runRoleList(searchForm)"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </template>

    <el-table
      :data="roleList?.data"
      v-loading="roleListLoading || deleteRole.loading.value || enableRole.loading.value"
    >
      <el-table-column prop="roleName" label="角色名称" width="120" />
      <el-table-column label="人员" width="80">
        <template #default="{row}">
          {{ row.userIdCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="描述" />
      <el-table-column prop="updateTime" label="更新时间" width="170" />
      <el-table-column label="启用" width="80">
        <template #default="{row}">
          <el-switch :model-value="row.enable === 1" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{row}">
          <el-button link size="small" @click="handleAddUser(row)">添加人员</el-button>
          <el-button link size="small" @click="handlePermissionSet()">设置权限</el-button>
          <el-button link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>
  <!-- 分页 -->
  <el-pagination
    class="float-right"
    v-model:current-page="current"
    v-model:page-size="pageSize"
    :total="total"
    @size-change="changePageSize"
    @current-change="changeCurrent"
  />

  <!-- 新增/编辑弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="editForm.roleId ? '编辑角色' : '添加角色'"
    @closed="resetEditForm"
  >
    <el-form ref="editFormRef" :model="editForm" label-width="100px">
      <el-form-item label="添加角色" prop="roleName">
        <el-input v-model="editForm.roleName" placeholder="请填写角色名称" maxlength="30" />
      </el-form-item>
      <el-form-item label="角色描述" prop="notes">
        <el-input
          v-model="editForm.notes"
          placeholder="输入职务描述"
          type="textarea"
          maxlength="300"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="upsertRole.loading.value" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加人员弹窗 -->
  <el-dialog v-model="addUserDialogVisible" title="添加人员" @closed="resetAddUserForm">
    <el-form ref="addUserFormRef" :model="addUserForm">
      <el-form-item prop="roleName">
        <el-input v-model="addUserForm.roleName" placeholder="请输入" disabled />
      </el-form-item>

      <el-form-item prop="userIdList" :rules="[rules.must]">
        <el-transfer
          class="full"
          v-model="addUserForm.userIdList"
          :data="employeeList?.data"
          :titles="['选择员工', '已选员工']"
          :props="{label: 'certName', key: 'userId'}"
          filterable
          :filter-method="(query, item) => item.certName.includes(query)"
        ></el-transfer>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddUserSubmit" :loading="upsertRole.loading.value">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
