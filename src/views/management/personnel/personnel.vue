<script setup lang="ts">
import {useActivated, useDicListTree, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed, ref, useTemplateRef} from 'vue'
import {useRouter} from 'vue-router'
import {usePagination, useRequest} from 'vue-request'
import {iamAuthOrgList, iamAuthRoleList} from '@/service/api/iamAuth'
import {
  iamAuthUserEnable,
  iamAuthUserList,
  iamAuthUserResetPassword,
  iamAuthUserUpdateOrg,
  iamAuthUserUpdateRole,
} from '@/service/api/imaAuthUser'
import {rules} from '@/common/rules'
import {ElMessage} from 'element-plus'

const router = useRouter()

// 搜索表单
const [searchForm] = useForm({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AuthUserListDTO)

const {
  data: personnelList,
  runAsync: runPersonnelList,
  refreshAsync: refreshPersonnelList,
  loading: personnelListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(iamAuthUserList, {
  manual: false,
  defaultParams: [searchForm],
})

useActivated(refreshPersonnelList)

const handleMap = {
  updateRole: '修改角色',
  updateDept: '修改部门',
  disable: '停用',
  enable: '启用',
  resetPwd: '重置密码',
}
type HandleType = keyof typeof handleMap

// 角色列表
const {data: roleList} = useRequest(iamAuthRoleList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthRoleListDTO],
})
// 部门列表
const {data: orgList} = useRequest(iamAuthOrgList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthOrgListDTO],
})

// 处理添加
const handleAdd = () => {
  router.push('/management/personnel/add')
}

// 处理导入
const handleImport = () => {
  router.push('/management/personnel/import')
}

// 处理详情
const handleDetail = (user: AuthUserVO) => {
  router.push({name: '/management/personnel/detail/:id', params: {id: user.userId}})
}

// 处理重置密码
const handleResetPassword = (user: AuthUserVO) => {
  console.log('重置密码', user)
  // 这里可以添加重置密码的逻辑
  selectUsers.value = [user]
  editForm.userIdList = [user.userId]
  editDialogType.value = 'resetPwd'
}

const selectUsers = ref<AuthUserVO[]>([])
const handleSelectionChange = (users: AuthUserVO[]) => {
  selectUsers.value = users
}

const multipleTableRef = useTemplateRef('multipleTableRef')

// 修改部门弹窗
const editDialogType = ref<HandleType | ''>('')
const editFormRef = useTemplateRef('editFormRef')
const [editForm, resetEditForm] = useForm(
  {
    userIdList: [] as string[],
    orgId: '',
    roleId: '',
    notes: '',
  },
  editFormRef
)

// 处理修改部门
const handleBatchUpdate = (type: HandleType) => {
  if (!selectUsers.value.length) {
    return ElMessage.warning(`请选择要${handleMap[type]}的人员`)
  }
  editForm.userIdList = selectUsers.value.map(item => item.userId)
  // 显示弹窗
  editDialogType.value = type
}

// 修改部门
const {runAsync: runUpsertUserOrg, loading: upsertLoading} = useRequest(iamAuthUserUpdateOrg)
// 修改角色
const {runAsync: runUpsertUserRole, loading: upsertRoleLoading} = useRequest(iamAuthUserUpdateRole)
// 启用/禁用人员
const {runAsync: runUpsertUserEnable, loading: upsertEnableLoading} = useRequest(iamAuthUserEnable)
// 重置密码
const {runAsync: runUpsertUserResetPassword, loading: upsertResetPasswordLoading} =
  useRequest(iamAuthUserResetPassword)

// 处理修改部门确认
const handleEditConfirm = async () => {
  if (!editFormRef.value) return
  await editFormRef.value?.validate()

  switch (editDialogType.value) {
    case 'updateDept':
      await runUpsertUserOrg({
        userIdList: editForm.userIdList,
        orgIdList: [editForm.orgId],
      })
      ElMessage.success('修改部门成功')
      break
    case 'updateRole':
      await runUpsertUserRole({
        userIdList: editForm.userIdList,
        roleIdList: [editForm.roleId],
      })
      ElMessage.success('修改角色成功')
      break
    case 'disable':
      await runUpsertUserEnable({
        userId: editForm.userIdList[0], // todo:
        enable: false,
      })
      ElMessage.success('停用成功')
      break
    case 'enable':
      await runUpsertUserEnable({
        userId: editForm.userIdList[0],
        enable: true,
      })
      ElMessage.success('启用成功')
      break
    case 'resetPwd':
      await runUpsertUserResetPassword({
        userId: editForm.userIdList[0],
      })
      ElMessage.success('重置密码成功')
      break
    default:
      break
  }

  ElMessage.success(`${handleMap[editDialogType.value]}成功`)
  // 关闭弹窗
  editDialogType.value = ''
  refreshPersonnelList()
}

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({label: '输入查询', prop: 'keyword', placeholder: '姓名/账号/手机'}),
      defineField.Select({
        label: '角色',
        prop: 'roleId',
        props: {label: 'roleName', value: 'roleId'},
        options: roleList?.value?.data,
      }),
      defineField.Select({
        label: '所属部门',
        prop: 'orgId',
        props: {label: 'orgName', value: 'orgId'},
        options: orgList?.value?.data,
      }),
      defineField.Input({label: '账户状态', prop: 'enable'}),
      defineField.DateRangePicker({
        label: '添加时间',
        propMapping: ['insertTimeBegin', 'insertTimeEnd'],
      }),
    ],
  })
)

const gender = useDicListTree({dicType: 9002})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="schema"
      :model="searchForm"
      @finish="runPersonnelList(searchForm)"
      @reset="runPersonnelList(searchForm)"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-space>
        <el-button type="primary" @click="handleAdd">+ 添加</el-button>
        <el-button @click="handleImport">导入</el-button>
        <el-dropdown>
          <el-button>导出 ▼</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>导出Excel</el-dropdown-item>
              <el-dropdown-item>导出CSV</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="handleBatchUpdate('updateDept')">修改部门</el-button>
        <el-button @click="handleBatchUpdate('updateRole')">修改角色</el-button>
        <el-button @click="handleBatchUpdate('disable')">停用</el-button>
        <el-button @click="handleBatchUpdate('enable')">启用</el-button>
        <el-button @click="handleBatchUpdate('resetPwd')">重置密码</el-button>
      </el-space>
    </template>

    <el-table
      ref="multipleTableRef"
      :data="personnelList?.data"
      stripe
      border
      v-loading="personnelListLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="certName" label="姓名" />
      <el-table-column
        prop="gender"
        label="性别"
        :formatter="row => gender?.find(item => item.dicCode === row.gender)?.dicName || '-'"
      />
      <el-table-column prop="orgName" label="所属部门" />
      <el-table-column prop="roleName" label="当前角色" />
      <el-table-column prop="loginAccount" label="登录账号" width="140" />
      <el-table-column prop="mobile" label="手机" width="120" />
      <!-- todo -->
      <!-- <el-table-column label="在线状态">
        <template #default="scope">
          <div class="flex items-center">
            <el-tag size="small" :type="scope.row.online ? 'success' : 'info'">
              {{ scope.row.online ? '在线' : '离线' }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="特性" />
      <el-table-column prop="source" label="来源渠道" width="120" /> -->
      <el-table-column prop="lastLoginTime" label="最后登陆时间" width="170" />
      <el-table-column prop="enable" label="启用">
        <template #default="scope">
          <!-- <el-switch v-model="row.enable" disabled /> -->
          <el-tag size="small" :type="scope.row.enable ? 'success' : 'danger'">
            {{ scope.row.enable ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="scope">
          <el-button link size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button link size="small" type="danger" @click="handleResetPassword(scope.row)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <el-pagination
    class="float-right"
    v-model:current-page="current"
    v-model:page-size="pageSize"
    :total="total"
    @size-change="changePageSize"
    @current-change="changeCurrent"
  />

  <!-- 修改部门弹窗 -->
  <el-dialog
    :model-value="!!editDialogType"
    @update:model-value="editDialogType = ''"
    :title="handleMap[editDialogType]"
    @closed="
      () => {
        selectUsers = []
        resetEditForm()
        multipleTableRef?.clearSelection()
      }
    "
  >
    <el-form :model="editForm" ref="editFormRef" label-width="100px">
      <el-form-item label="已选员工" prop="userIdList" :rules="[rules.required()]">
        <el-select v-model="editForm.userIdList" placeholder="选择员工" multiple>
          <el-option
            v-for="item in selectUsers"
            :key="item.userId"
            :label="item.certName + ' ' + `${item.orgName} / ${item.roleName}`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="['updateDept', 'enable'].includes(editDialogType)"
        label="修改部门"
        prop="orgId"
        :rules="[rules.required()]"
      >
        <el-select v-model="editForm.orgId" placeholder="选择部门" filterable default-first-option>
          <el-option
            v-for="item in orgList?.data"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="['updateRole', 'enable'].includes(editDialogType)"
        label="修改角色"
        prop="roleId"
        :rules="[rules.required()]"
      >
        <el-select v-model="editForm.roleId" placeholder="选择角色" filterable default-first-option>
          <el-option
            v-for="item in roleList?.data"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
        <div v-if="editDialogType === 'updateRole'" class="text-orange-500 text-sm mt-2">
          如果该员工已被分配其它职务，再添加职务权限会过大！
        </div>
      </el-form-item>
      <el-form-item label="原因备注" prop="notes" :rules="[rules.required()]">
        <el-input
          v-model="editForm.notes"
          type="textarea"
          placeholder="请输入原因备注"
          :rows="4"
          show-word-limit
          maxlength="300"
        />
        <div v-if="editDialogType === 'resetPwd'" class="text-orange-500 text-sm mt-2">
          新密码将以手机短信发送至员工的手机号码
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogType = ''">取消</el-button>
      <el-button
        type="primary"
        :loading="
          upsertLoading || upsertRoleLoading || upsertEnableLoading || upsertResetPasswordLoading
        "
        @click="handleEditConfirm"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
