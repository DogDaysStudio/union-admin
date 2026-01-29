<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import {defineField, defineSchema} from '@/components/form/form-schema.ts'
import {reactive, ref, useTemplateRef} from 'vue'
import {useRequest, usePagination} from 'vue-request'
import {amsSysDic} from '@/service/api/amsSysDic'
import {rules} from '@/common/rules'

const dialogVisible = ref(false)
const isEdit = ref(false)

// SYS_TYPE(9000, 1, "系统分类"), // (union,ams,iam,eportal,pms,openapi,job)
// SYS_PERM_TYPE(9001, 1, "权限分类"),// (menu,api,button,data,file)

const dict = [
  {lable: '公司', value: 1001},
  {lable: '资产分类', value: 1002},
  {lable: '业态', value: 1003},
  {lable: '位置', value: 1004},
  {lable: '房间类型', value: 1005},
  {lable: '客户来源', value: 1006},
  {lable: '客户类型', value: 1007},
  {lable: '设备类型', value: 1008},
  {lable: '业务类型', value: 1009},
  {lable: '广告类型', value: 1010},
  {lable: '点位类型', value: 1011},
  {lable: '媒体类型分类', value: 1012},
  {lable: '停车场位置', value: 1013},
  {lable: '车位类别', value: 1014},
  {lable: '充电位', value: 1015},
  {lable: '车位属性', value: 1016},
  {lable: '供应商合作模式', value: 1017},
  {lable: '供应商分类', value: 1018},
  {lable: '企业性质', value: 1019},
  {lable: '经营模式', value: 1020},
  {lable: '筹集方式', value: 1021},
  {lable: '产权性质', value: 1022},
  {lable: '围合类型', value: 1023},
  {lable: '户型', value: 1024},
  {lable: '区域类别', value: 1025},
  {lable: '停车方式', value: 1026},
]

const listQuery = reactive({
  // pageable: true,
  // pageNum: 1,
  // pageSize: 10,
  enable: 1,
} as SysDicListDTO)

const formState = reactive({
  dicType: 1001,
  dicLevel: 1,
} as SysDicUpsertDTO)

const upsertFormSchema = defineSchema({
  span: 24,
  fields: [
    defineField.Input({label: '上级公司', prop: 'dicPcode'}),
    defineField.Input({label: '公司名称', prop: 'dicName', rules: [rules.required()]}),
    defineField.Input({label: '英文名称', prop: 'dicCode', rules: [rules.required()]}),
    defineField.Input({label: '英文简称', prop: 'dicCodeShort', rules: [rules.required()]}),
    defineField.Input({label: '公司描述', prop: 'dicNotes', type: 'textarea', rows: 4}),
  ],
})

const {
  runAsync: getList,
  loading: listLoading,
  data,
  pageSize,
  current,
  total,
  changeCurrent,
  changePageSize,
} = usePagination(amsSysDic.amsSysDicList, {
  manual: false,
  defaultParams: [listQuery],
})

console.log('data', data, total)

const {runAsync: getDicDetail, loading: detailLoading} = useRequest(amsSysDic.amsSysDicGet, {
  onSuccess: res => {
    if (res.code === 0 && res.data) {
      Object.assign(formState, res.data)
      dialogVisible.value = true
    }
  },
})

const {runAsync: upsertDic, loading: submitLoading} = useRequest(amsSysDic.amsSysDicUpsert, {
  onSuccess: () => {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    dialogVisible.value = false
    getList(listQuery)
  },
})

const {runAsync: deleteDic, loading: deleteLoading} = useRequest(amsSysDic.amsSysDicDelete, {
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
  // Object.assign(formState, {
  //   dicId: undefined,
  //   dicType: 0,
  //   dicPcode: '',
  //   dicCode: '',
  //   dicCodeShort: '',
  //   dicName: '',
  //   dicNameShort: '',
  //   dicSys: '',
  //   dicLevel: 1,
  //   dicSort: 0,
  //   dicNotes: '',
  //   enable: 1,
  // })
  dialogVisible.value = true
}

const handleEdit = (row: SysDicVO) => {
  isEdit.value = true
  getDicDetail({dicId: row.dicId})
}

const modelFormRef = useTemplateRef('modelFormRef')
const handleSubmit = async () => {
  await modelFormRef.value?.validate()
  console.log('formState', formState)

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

// getList(listQuery)
</script>

<template>
  <el-card class="mt-4">
    <template #header>
      <div class="flex justify-between items-center">
        <span>数据列表</span>
        <el-button type="primary" @click="handleAdd">新增字典</el-button>
      </div>
    </template>
    <el-table v-loading="listLoading" :data="data?.data" stripe border>
      <el-table-column label="公司名称" prop="dicName" min-width="150" />
      <el-table-column label="公司简称" prop="dicNameShort" min-width="150" />
      <el-table-column label="英文名称" prop="dicCode" min-width="120" />
      <el-table-column label="英文简称" prop="dicCodeShort" min-width="120" />
      <el-table-column label="上级公司" prop="dicPcode" min-width="120" />
      <el-table-column label="状态" prop="enable" width="100" align="center">
        <template #default="{row}">
          <el-tag :type="row.enable === 1 ? 'success' : 'danger'">
            {{ row.enable === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
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
        v-model:current-page="current"
        v-model:page-size="pageSize"
        :total="total"
        @size-change="changePageSize"
        @current-change="changeCurrent"
      />
      <!-- layout="total, sizes, prev, pager, next, jumper" -->
    </div>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑字典' : '新增字典'"
    width="600px"
    destroy-on-close
    @closed="modelFormRef.resetFields()"
  >
    <el-form :model="formState" ref="modelFormRef">
      <dynamic-field render-row :schema="upsertFormSchema" :model="formState" />
    </el-form>
    <!-- <schema-form :schema="formSchema" :model="formState" :rules="{}" /> -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
