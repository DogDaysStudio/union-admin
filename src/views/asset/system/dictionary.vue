<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import {defineField, defineSchema} from '@/utils/form-schema'
import {reactive, ref} from 'vue'
import {useRequest} from 'vue-request'
import {amsSysDic} from '@/service/api/amsSysDic'

const dialogVisible = ref(false)
const isEdit = ref(false)

const listQuery = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
  dicId: '',
  dicType: 0,
  dicPcode: '',
  dicCode: '',
  dicCodeShort: '',
  dicName: '',
  dicNameShort: '',
  dicSys: '',
  dicLevel: 0,
  enable: -1,
})

const total = ref(0)
const tableData = ref<SysDicVO[]>([])

const formState = reactive<SysDicUpsertDTO>({
  dicType: 0,
  dicPcode: '',
  dicCode: '',
  dicCodeShort: '',
  dicName: '',
  dicNameShort: '',
  dicSys: '',
  dicLevel: 1,
  dicSort: 0,
  dicNotes: '',
  enable: 1,
})

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '字典名称', prop: 'dicName', required: true}),
    defineField.Input({label: '字典编码', prop: 'dicCode', required: true}),
    defineField.Input({label: '字典简称', prop: 'dicCodeShort'}),
    defineField.Input({label: '字典名称简称', prop: 'dicNameShort'}),
    defineField.Input({label: '所属系统', prop: 'dicSys'}),
    defineField.InputNumber({label: '排序值', prop: 'dicSort'}),
    defineField.Input({label: '备注', prop: 'dicNotes', type: 'textarea'}),
  ],
})

const {runAsync: getList, loading: listLoading} = useRequest(amsSysDic.amsSysDicList, {
  manual: true,
  onSuccess: res => {
    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.total || 0
    }
  },
})

const {runAsync: getDicDetail, loading: detailLoading} = useRequest(amsSysDic.amsSysDicGet, {
  manual: true,
  onSuccess: res => {
    if (res.code === 0 && res.data) {
      Object.assign(formState, res.data)
      dialogVisible.value = true
    }
  },
})

const {runAsync: upsertDic, loading: submitLoading} = useRequest(amsSysDic.amsSysDicUpsert, {
  manual: true,
  onSuccess: () => {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    dialogVisible.value = false
    getList(listQuery)
  },
})

const {runAsync: deleteDic, loading: deleteLoading} = useRequest(amsSysDic.amsSysDicDelete, {
  manual: true,
  onSuccess: () => {
    ElMessage.success('删除成功')
    getList(listQuery)
  },
})

const {runAsync: enableDic, loading: enableLoading} = useRequest(amsSysDic.amsSysDicEnable, {
  manual: true,
  onSuccess: (_, params) => {
    ElMessage.success(params[0].enable === 1 ? '启用成功' : '禁用成功')
    getList(listQuery)
  },
})

const handleSearch = () => {
  listQuery.pageNum = 1
  getList(listQuery)
}

const handleReset = () => {
  listQuery.dicId = ''
  listQuery.dicCode = ''
  listQuery.dicName = ''
  listQuery.enable = -1
  handleSearch()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formState, {
    dicId: undefined,
    dicType: 0,
    dicPcode: '',
    dicCode: '',
    dicCodeShort: '',
    dicName: '',
    dicNameShort: '',
    dicSys: '',
    dicLevel: 1,
    dicSort: 0,
    dicNotes: '',
    enable: 1,
  })
  dialogVisible.value = true
}

const handleEdit = (row: SysDicVO) => {
  isEdit.value = true
  getDicDetail({dicId: row.dicId})
}

const handleSubmit = () => {
  upsertDic(formState)
}

const handleDelete = async (row: SysDicVO) => {
  await ElMessageBox.confirm('确定要删除该字典吗？', '提示', {type: 'warning'})
  deleteDic({dicId: row.dicId})
}

const handleEnable = (row: SysDicVO) => {
  enableDic({
    dicId: row.dicId,
    enable: row.enable === 1 ? 0 : 1,
  })
}

const handleSizeChange = (val: number) => {
  listQuery.pageSize = val
  getList(listQuery)
}

const handleCurrentChange = (val: number) => {
  listQuery.pageNum = val
  getList(listQuery)
}

getList(listQuery)
</script>

<template>
  <el-card>
    <template #header>数据筛选</template>
    <el-form :model="listQuery" label-width="80px">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="字典名称">
            <el-input v-model="listQuery.dicName" placeholder="请输入字典名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字典编码">
            <el-input v-model="listQuery.dicCode" placeholder="请输入字典编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="listQuery.enable" placeholder="请选择状态" clearable>
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>

  <el-card class="mt-4">
    <template #header>
      <div class="flex justify-between items-center">
        <span>数据列表</span>
        <el-button type="primary" @click="handleAdd">新增字典</el-button>
      </div>
    </template>
    <el-table v-loading="listLoading" :data="tableData" stripe border>
      <el-table-column prop="dicName" label="字典名称" min-width="150" />
      <el-table-column prop="dicCode" label="字典编码" min-width="150" />
      <el-table-column prop="dicCodeShort" label="字典简称" min-width="120" />
      <el-table-column prop="dicNameShort" label="名称简称" min-width="120" />
      <el-table-column prop="dicSys" label="所属系统" min-width="120" />
      <el-table-column prop="dicSort" label="排序值" width="100" align="center" />
      <el-table-column prop="enable" label="状态" width="100" align="center">
        <template #default="{row}">
          <el-tag :type="row.enable === 1 ? 'success' : 'danger'">
            {{ row.enable === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dicNotes" label="备注" min-width="150" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link :loading="detailLoading" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            :type="row.enable === 1 ? 'danger' : 'success'"
            link
            :loading="enableLoading"
            @click="handleEnable(row)"
          >
            {{ row.enable === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button type="danger" link :loading="deleteLoading" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="listQuery.pageNum"
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑字典' : '新增字典'"
    width="600px"
    destroy-on-close
  >
    <schema-form :schema="formSchema" :model="formState" :rules="{}" />
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
