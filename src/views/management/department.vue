<script setup lang="ts">
import {rules} from '@/common/rules'
import {defineField, defineSchema} from '@/components'
import {
  iamAuthOrgDelete,
  iamAuthOrgList,
  iamAuthOrgTree,
  iamAuthOrgUpsert,
} from '@/service/api/iamAuth'
import {ref, reactive, watchEffect, useTemplateRef} from 'vue'
import {usePagination, useRequest} from 'vue-request'
import AddUser from './role/components/AddUser.vue'

// 搜索表单
const searchForm = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AuthOrgListDTO)

const {
  data: orgList,
  runAsync: runOrgList,
  refresh: refreshOrgList,
  loading: orgListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(iamAuthOrgList, {
  manual: false,
  defaultParams: [searchForm],
})

const {data: orgTree, runAsync: runOrgTree} = useRequest(iamAuthOrgTree)

const {runAsync: runUpsertOrg, loading: upsertLoading} = useRequest(iamAuthOrgUpsert)
const {
  runAsync: runDeleteOrg,
  loading: deleteLoading,
  params: deleteParams,
} = useRequest(iamAuthOrgDelete)

watchEffect(() => {
  console.log('orgList', orgList)
})

// 添加部门表单
const addForm = reactive({} as AuthOrgUpsertDTO)

// 处理搜索
const handleSearch = async () => {
  console.log('搜索', searchForm)
  // 这里可以添加搜索数据的逻辑
  await runOrgList(searchForm)
}

// 处理重置
const handleReset = () => {
  searchForm.pageNum = 1
  runOrgList(searchForm)
}

// 处理添加
const handleAdd = () => {
  // 加载组织树
  runOrgTree({})
  // 显示弹窗
  addDialogVisible.value = true
}

// 添加部门弹窗
const addDialogVisible = ref(false)
const addFormRef = useTemplateRef('addFormRef')
// 处理弹窗确认
const handleAddConfirm = async () => {
  await addFormRef.value?.validate()
  await runUpsertOrg({...addForm, userIdList: userList.value.map(item => item.userId) || []})
  ElMessage.success(addForm.orgId ? '编辑部门成功' : '添加部门成功')
  // 关闭弹窗
  addDialogVisible.value = false
  refreshOrgList()
}

// 处理弹窗取消
const handleAddCancel = () => {
  // 关闭弹窗
  addDialogVisible.value = false
}

// 处理编辑
const handleEdit = (row: AuthOrgVO) => {
  console.log('编辑部门', row)
  // 加载组织树
  runOrgTree({})
  // 填充表单数据
  Object.assign(addForm, row)
  // 显示弹窗
  addDialogVisible.value = true
}

// 处理删除
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除部门吗？', '删除确认')
  await runDeleteOrg({orgId: id})
  ElMessage.success('删除部门成功')
  refreshOrgList()
}

const schema = defineSchema({
  fields: [
    defineField.Input({label: '输入查询', prop: 'orgName', placeholder: '部门名称'}),
    defineField.Select({
      label: '部门状态',
      prop: 'enable',
      options: [
        {label: '启用', value: 1},
        {label: '停用', value: 0},
      ],
    }),
  ],
})

const addUserRef = useTemplateRef('addUserRef')
const userList = ref<AuthUserVO[]>([])
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="schema"
      :model="searchForm"
      @finish="handleSearch"
      @reset="handleReset"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-button type="primary" @click="handleAdd">+ 添加</el-button>
    </template>

    <el-table :data="orgList?.data" style="width: 100%" stripe border v-loading="orgListLoading">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orgName" label="部门名称" />
      <el-table-column
        prop="userIdCount"
        label="部门成员"
        :formatter="row => row.userIdCount || 0"
      />
      <el-table-column prop="updateTime" label="更新时间" width="170" />
      <el-table-column prop="notes" label="部门描述" />
      <el-table-column
        prop="enabled"
        label="启用"
        :formatter="row => (row.enable ? '启用' : '停用')"
      ></el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="{row}">
          <el-button link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            link
            size="small"
            type="danger"
            @click="handleDelete(row.orgId)"
            :loading="deleteParams?.[0]?.orgId === row.orgId && deleteLoading"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <div class="flex justify-end items-center">
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="pageSize"
      :total="total"
      @size-change="changePageSize"
      @current-change="changeCurrent"
    />
  </div>

  <AddUser ref="addUserRef" @submit="((userList = $event), addUserRef.hide())" />

  <!-- 添加部门弹窗 -->
  <el-dialog
    v-model="addDialogVisible"
    :title="addForm.orgId ? '编辑部门' : '添加部门'"
    @closed="addFormRef?.resetFields()"
  >
    <el-form :model="addForm" ref="addFormRef" label-width="100px">
      <el-form-item label="上级部门" prop="orgPid">
        <el-tree-select
          v-model="addForm.orgPid"
          placeholder="选择上级部门"
          :data="orgTree?.data"
          :props="{label: 'orgName'}"
          node-key="orgId"
          check-strictly
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="orgName" :rules="[rules.required()]">
        <el-input v-model="addForm.orgName" placeholder="请填写部门名称" />
      </el-form-item>
      <el-form-item label="人员" prop="userIdList">
        <el-space>
          <el-avatar
            class="cursor-pointer"
            v-for="item in userList"
            :key="item.userId"
            :src="item.avatarFile?.url"
            @click="userList = userList.filter(el => el.userId !== item.userId)"
          >
            {{ item.certName?.[0] }}
          </el-avatar>
          <el-avatar
            class="cursor-default"
            @click="addUserRef?.show(userList.map(item => item.userId))"
          >
            +
          </el-avatar>
        </el-space>
      </el-form-item>
      <el-form-item label="部门描述" prop="notes">
        <el-input
          v-model="addForm.notes"
          type="textarea"
          placeholder="输入部门描述"
          :rows="4"
          show-word-limit
          maxlength="300"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleAddCancel">取消</el-button>
      <el-button type="primary" @click="handleAddConfirm" :loading="upsertLoading">确定</el-button>
    </template>
  </el-dialog>
</template>
