<script setup lang="ts">
import {useActivated, useDicListTree, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed, ref, useTemplateRef} from 'vue'
import {useRouter} from 'vue-router'
import {usePagination, useRequest} from 'vue-request'
import {iamAuthOrgList, iamAuthRoleList} from '@/service/api/iamAuth'
import {iamAuthUserList, iamAuthUserUpdateOrg} from '@/service/api/imaAuthUser'
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

// 处理批量修改角色
const handleBatchUpdateRole = () => {
  console.log('修改角色')
  // 这里可以添加批量修改角色的逻辑
}

// 处理批量停用
const handleBatchDisable = () => {
  console.log('停用')
  // 这里可以添加批量停用的逻辑
}

// 处理批量启用
const handleBatchEnable = () => {
  console.log('启用')
  // 这里可以添加批量启用的逻辑
}

// 处理批量重置密码
const handleBatchResetPwd = () => {
  console.log('重置密码')
  // 这里可以添加批量重置密码的逻辑
}

// 处理详情
const handleDetail = (user: AuthUserVO) => {
  router.push({name: '/management/personnel/detail/:id', params: {id: user.userId}})
}

// 处理重置密码
const handleResetPassword = (user: AuthUserVO) => {
  console.log('重置密码', user)
  // 这里可以添加重置密码的逻辑
}

const handleSelectionChange = (val: AuthUserVO[]) => {
  editDeptForm.users = val
  editDeptForm.userList = val.map(item => item.userId)
}

const multipleTableRef = useTemplateRef('multipleTableRef')

// 修改部门弹窗
const editDeptDialogVisible = ref(false)
const editDeptFormRef = useTemplateRef('editDeptFormRef')
const [editDeptForm, resetEditDeptForm] = useForm(
  {
    users: [] as AuthUserVO[],
    userList: [] as string[],
    orgId: '',
    notes: '',
  },
  editDeptFormRef
)

// 处理修改部门
const handleBatchUpdateDept = () => {
  if (!editDeptForm.users.length) {
    ElMessage.warning('请选择要修改部门的人员')
    return
  }
  // 显示弹窗
  editDeptDialogVisible.value = true
}

// 修改部门
const {runAsync: runUpsertUserOrg, loading: upsertLoading} = useRequest(iamAuthUserUpdateOrg)

// 修改角色
// const {runAsync: runUpsertUserRole, loading: upsertRoleLoading} = useRequest(iamAuthUserUpdateRole)

// 处理修改部门确认
const handleEditDeptConfirm = async () => {
  if (!editDeptFormRef.value) return
  await editDeptFormRef.value?.validate()
  // 这里可以添加修改部门的逻辑
  await runUpsertUserOrg({
    userIdList: editDeptForm.userList,
    orgIdList: [editDeptForm.orgId],
  })
  ElMessage.success('修改部门成功')
  // 关闭弹窗
  editDeptDialogVisible.value = false
  refreshPersonnelList()
}

// 处理修改部门取消
const handleEditDeptCancel = () => {
  // 关闭弹窗
  editDeptDialogVisible.value = false
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
        <el-button @click="handleBatchUpdateDept">修改部门</el-button>
        <el-button @click="handleBatchUpdateRole">修改角色</el-button>
        <el-button @click="handleBatchDisable">停用</el-button>
        <el-button @click="handleBatchEnable">启用</el-button>
        <el-button @click="handleBatchResetPwd">重置密码</el-button>
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
    v-model="editDeptDialogVisible"
    title="修改部门"
    @closed="
      () => {
        resetEditDeptForm()
        multipleTableRef?.clearSelection()
      }
    "
  >
    <el-form :model="editDeptForm" ref="editDeptFormRef" label-width="100px">
      <el-form-item label="已选员工" prop="userList" :rules="[rules.required()]">
        <el-select v-model="editDeptForm.userList" placeholder="选择员工" multiple>
          <el-option
            v-for="item in editDeptForm.users"
            :key="item.userId"
            :label="item.certName + ' ' + `${item.orgName} / ${item.roleName}`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="修改部门" prop="orgId" :rules="[rules.required()]">
        <el-select
          v-model="editDeptForm.orgId"
          placeholder="选择部门"
          filterable
          default-first-option
        >
          <el-option
            v-for="item in orgList?.data"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原因备注" prop="notes" :rules="[rules.required()]">
        <el-input
          v-model="editDeptForm.notes"
          type="textarea"
          placeholder="请输入原因备注"
          :rows="4"
          show-word-limit
          maxlength="300"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleEditDeptCancel">取消</el-button>
      <el-button type="primary" :loading="upsertLoading" @click="handleEditDeptConfirm">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
