<script setup lang="ts">
import {reactive, ref, useTemplateRef} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {usePagination, useRequest} from 'vue-request'
import {iamAuth} from '@/service/api/iamAuth'
import {useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {amsSysDic} from '@/service/api/amsSysDic'
import {rules} from '@/common/rules'

// 搜索表单
const searchForm = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AuthPermissionListDTO)

const {
  data: permissionList,
  runAsync: runPermissionList,
  refresh: refreshPermissionList,
  loading: permissionListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(iamAuth.iamAuthPermissionList, {
  manual: false,
  defaultParams: [searchForm],
})

const {runAsync: runUpsertPermission, loading: upsertLoading} = useRequest(
  iamAuth.iamAuthPermissionUpsert
)
const {runAsync: runDeletePermission, loading: deleteLoading} = useRequest(
  iamAuth.iamAuthPermissionDelete
)
const {runAsync: runEnablePermission, loading: enableLoading} = useRequest(
  iamAuth.iamAuthPermissionEnable
)
const {data: dicList} = useRequest(amsSysDic.amsSysDicList, {
  manual: false,
  defaultParams: [{dicType: 9001} as SysDicListDTO],
})
const {data: sysDictList} = useRequest(amsSysDic.amsSysDicList, {
  manual: false,
  defaultParams: [{dicType: 9000} as SysDicListDTO],
})

// 添加/编辑表单
const dialogVisible = ref(false)

// 表单引用
const editFormRef = useTemplateRef('editFormRef')
const [editForm, resetEditForm] = useForm(
  {
    // permCode: 'OPT01',
    // permName: '运营管理平台',
    // permPath: '/oms-opt/project/create',
    // permType: 'MENU',
  } as AuthPermissionUpsertDTO,
  editFormRef
)

// 表单验证规则
// const rules = {
//   permCode: [{required: true, message: '请输入功能编码', trigger: 'blur'}],
//   permName: [{required: true, message: '请输入功能名称', trigger: 'blur'}],
//   permType: [{required: true, message: '请选择功能类型', trigger: 'change'}],
//   sysId: [{required: true, message: '请选择所属平台', trigger: 'change'}],
// }

// 处理添加
const handleAdd = () => {
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: AuthPermissionVO) => {
  dialogVisible.value = true
  // 填充表单数据
  Object.assign(editForm, row)
}

// 处理删除
const handleDelete = async (row: AuthPermissionVO) => {
  await ElMessageBox.confirm('是否确定删除功能', '确认提示')
  await runDeletePermission({permId: row.permId})
  ElMessage.success('删除成功')
  await refreshPermissionList()
}

// 处理状态切换
const handleStatusChange = async (row: AuthPermissionVO) => {
  const nextEnable = !row.enable
  await ElMessageBox.confirm(`是否确定${nextEnable ? '启用' : '禁用'}该功能`, '确认提示')
  await runEnablePermission({permId: row.permId, enable: nextEnable})
  ElMessage.success(`${nextEnable ? '启用' : '禁用'}成功`)
  await runPermissionList(searchForm)
}

// 处理表单提交
const handleSubmit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate()

  await runUpsertPermission(editForm)
  ElMessage.success(`${editForm.permId ? '编辑' : '新增'}成功`)
  dialogVisible.value = false
  refreshPermissionList()
}

const searchFormSchema = defineSchema({
  fields: [
    defineField.Input({label: '功能名称', prop: 'permName'}),
    defineField.Select({label: '所属平台', prop: 'permType'}),
    // defineField.Select({label: '状态', prop: 'enable'}),
  ],
})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="searchFormSchema"
      :model="searchForm"
      @finish="runPermissionList(searchForm)"
      @reset="runPermissionList(searchForm)"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </template>

    <el-table
      :data="permissionList?.data"
      v-loading="permissionListLoading || deleteLoading || enableLoading"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="permCode" label="功能编码" />
      <el-table-column prop="permName" label="功能名称" width="120" />
      <el-table-column prop="permTypeName" label="功能类型" />
      <el-table-column prop="permLevel" label="功能级别"></el-table-column>
      <el-table-column prop="permPname" label="父级名称" />
      <el-table-column prop="sysId" label="所属平台" />
      <el-table-column prop="clientType" label="所属端" width="120"></el-table-column>
      <el-table-column prop="serviceId" label="所属服务" width="120">
        <template #default="{row}">
          {{ row.serviceId || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="permPath" label="功能URL" width="200" />
      <el-table-column prop="sort" label="排序值"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="170" />
      <el-table-column prop="insertBy" label="创建人" />
      <el-table-column prop="insertTime" label="创建时间" width="170" />
      <el-table-column label="状态" width="120">
        <template #default="{row}">
          <el-switch :model-value="row.enable === 1" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{row}">
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
    :title="editForm.permId ? '编辑' : '新增'"
    @closed="resetEditForm"
  >
    <el-form ref="editFormRef" :model="editForm" label-width="100px">
      <el-form-item label="功能编码" prop="permCode" :rules="[rules.required()]">
        <el-input v-model="editForm.permCode" placeholder="请输入" :disabled="!!editForm.permId" />
      </el-form-item>
      <el-form-item label="功能名称" prop="permName">
        <el-input v-model="editForm.permName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="功能类型" prop="permType">
        <el-select
          v-model="editForm.permType"
          placeholder="请选择"
          :props="{label: 'dicName', value: 'dicCode'}"
          :options="dicList?.data"
        />
      </el-form-item>
      <!-- <el-form-item label="功能级别">
        <el-input v-model="editForm.permLevel" placeholder="请输入" type="number" />
      </el-form-item> -->
      <el-form-item label="父级名称">
        <el-select
          v-model="editForm.permPid"
          placeholder="请选择"
          :options="permissionList?.data"
          :props="{label: 'permName', value: 'permCode'}"
        />
      </el-form-item>
      <el-form-item label="所属平台" prop="sysId">
        <el-select
          v-model="editForm.sysId"
          placeholder="请选择"
          :options="sysDictList?.data"
          :props="{label: 'dicName', value: 'dicCode'}"
        ></el-select>
      </el-form-item>
      <!-- <el-form-item label="所属端">
        <el-select v-model="editForm.clientType" placeholder="请选择">
          <el-option label="Web端" value="WEB" />
          <el-option label="APP" value="APP" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="所属服务">
        <el-select v-model="editForm.serviceId" placeholder="请选择">
        </el-select>
      </el-form-item> -->
      <el-form-item label="功能URL">
        <el-input v-model="editForm.permPath" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="功能排序">
        <el-input v-model="editForm.sort" placeholder="请输入" type="number" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="upsertLoading" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
