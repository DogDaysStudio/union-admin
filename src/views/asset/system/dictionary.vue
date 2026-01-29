<script setup lang="ts">
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import {defineField, defineSchema} from '@/components/form/form-schema.ts'
import {
  computed,
  onMounted,
  onUpdated,
  reactive,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import {useRequest, usePagination} from 'vue-request'
import {amsSysDic} from '@/service/api/amsSysDic'
import {rules} from '@/common/rules'

interface Tree {
  label: string
  value?: number | number
  children?: Tree[]
}

const dialogVisible = ref(false)

// SYS_TYPE(9000, 1, "系统分类"), // (union,ams,iam,eportal,pms,openapi,job)
// SYS_PERM_TYPE(9001, 1, "权限分类"),// (menu,api,button,data,file)

const dict = [
  {label: '公司', value: 1001},
  {label: '资产分类', value: 1002},
  {label: '业态', value: 1003},
  {label: '位置', value: 1004},
  {label: '房间类型', value: 1005},
  {label: '客户来源', value: 1006},
  {label: '客户类型', value: 1007},
  {label: '设备类型', value: 1008},
  {label: '业务类型', value: 1009},
  {label: '广告类型', value: 1010},
  {label: '点位类型', value: 1011},
  {label: '媒体类型分类', value: 1012},
  {label: '停车场位置', value: 1013},
  {label: '车位类别', value: 1014},
  {label: '充电位', value: 1015},
  {label: '车位属性', value: 1016},
  {label: '供应商合作模式', value: 1017},
  {label: '供应商分类', value: 1018},
  {label: '企业性质', value: 1019},
  {label: '经营模式', value: 1020},
  {label: '筹集方式', value: 1021},
  {label: '产权性质', value: 1022},
  {label: '围合类型', value: 1023},
  {label: '户型', value: 1024},
  {label: '区域类别', value: 1025},
  {label: '停车方式', value: 1026},
]

const tree: Tree[] = [
  {
    label: '数据字典',
    value: 0,
    children: dict,
  },
]

const activeNode = ref(dict[0].value)

// const initState = {}

const listQuery = reactive({
  // pageNum: 1,
  // pageSize: 10,
  pageable: false,
  enable: 1,
} as SysDicListDTO)

// const formState = reactive({
//   dicType: 1001,
//   dicLevel: 1,
// } as SysDicUpsertDTO)
const formState = reactive({
  dicType: 1001,
  dicLevel: 1,
  // dicCode: '',
  // dicName: '',
} as SysDicUpsertDTO)
onMounted(() => {
  modelFormRef.value?.setInitialValues(formState)
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

watchEffect(() => {
  console.log('data', data.value)
})

const upsertFormSchema = computed(() =>
  defineSchema({
    span: 24,
    fields: [
      defineField.Select({
        label: '上级公司',
        prop: 'dicPcode',
        options: data.value?.data,
        props: {value: 'dicCode', label: 'dicName'},
      }),
      defineField.Input({label: '公司名称', prop: 'dicName', rules: [rules.required()]}),
      defineField.Input({label: '英文名称', prop: 'dicCode', rules: [rules.required()]}),
      defineField.Input({label: '英文简称', prop: 'dicCodeShort', rules: [rules.required()]}),
      defineField.Input({label: '公司描述', prop: 'dicNotes', type: 'textarea', rows: 4}),
    ],
  })
)

const {runAsync: getDicDetail, loading: detailLoading} = useRequest(amsSysDic.amsSysDicGet, {
  onSuccess: res => {
    if (res.code === 0 && res.data) {
      Object.assign(formState, res.data)
      dialogVisible.value = true
    }
  },
})

const {runAsync: upsertDic, loading: submitLoading} = useRequest(amsSysDic.amsSysDicUpsert, {
  onSuccess: (_, [params]) => {
    ElMessage.success(params.dicId ? '修改成功' : '新增成功')
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
  resetFields(modelFormRef.value!, formState)

  console.log('formState', formState)

  dialogVisible.value = true
}

function resetFields(form: FormInstance, state: Record<string, any>) {
  const emptyState = Object.fromEntries(Object.entries(state).map(([key]) => [key, undefined]))
  // Object.assign(state, emptyState)
  form?.setInitialValues(emptyState)
  form?.resetFields()
}

const handleEdit = (row: SysDicVO) => {
  console.log('row', row)

  // getDicDetail({dicId: row.dicId})
  modelFormRef.value?.resetFields()
  Object.assign(formState, row)
  dialogVisible.value = true
}

const modelFormRef = useTemplateRef('modelFormRef')
// onMounted(() => {
//   modelFormRef.value?.setInitialValues(formState)
// })
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

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleNodeClick = (data: Tree) => {
  console.log('handleNodeClick', data)
  if (!data.value) return
  activeNode.value = data.value
}

onUpdated(() => {
  console.log('onUpdated activeNode', activeNode.value)
})

const filterText = ref('')
const treeRef = useTemplateRef('treeRef')
watch(filterText, val => {
  treeRef.value!.filter(val)
})
</script>

<template>
  <el-row :gutter="24">
    <el-col :span="6">
      <el-input v-model="filterText" placeholder="请输入关键字进行过滤" />
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="tree"
        :props="defaultProps"
        @node-click="activeNode = $event.value"
        default-expand-all
        highlight-current
        node-key="value"
        :current-node-key="activeNode"
        :filter-node-method="(value, data) => (!value ? true : data.label.includes(value))"
      />
    </el-col>
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span>数据列表</span>
            <el-button type="primary" @click="handleAdd">新增字典</el-button>
          </div>
        </template>
        <!-- todo: 选完字典类型后，展示不同的字典列表 -->
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
    </el-col>
  </el-row>

  <!-- destroy-on-close -->
  <el-dialog
    v-model="dialogVisible"
    :title="formState.dicId ? '编辑字典' : '新增字典'"
    width="600px"
    @closed="(console.log('closed'), modelFormRef.resetFields())"
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
