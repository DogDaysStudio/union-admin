<script setup lang="ts">
import {useForm} from '@/common/hooks'
import {rules} from '@/common/rules'
import {defineSchema, defineField} from '@/components'
import {
  amsSysDicDelete,
  amsSysDicEnable,
  amsSysDicList,
  amsSysDicUpsert,
} from '@/service/api/amsSysDic'
import {ElMessageBox} from 'element-plus'
import {reactive, useTemplateRef, computed, ref} from 'vue'
import {usePagination, useRequest} from 'vue-request'

const props = defineProps<{
  dicType: number
  dicNames: Partial<Record<keyof SysDicVO, string>>
}>()

const {dicName, dicNameShort, dicCode, dicCodeShort, dicPcode, dicPname, dicNotes} =
  props.dicNames || {}

const dialogVisible = ref(false)

const listQuery = reactive({
  // pageNum: 1,
  // pageSize: 10,
  pageable: false,
  dicType: props.dicType,
  // enable: 1,
} as SysDicListDTO)

const modelFormRef = useTemplateRef('modelFormRef')
const [formModel, resetModel] = useForm({} as SysDicUpsertDTO, modelFormRef)

const {
  runAsync: getList,
  loading: listLoading,
  data,
  pageSize,
  current,
  total,
  changeCurrent,
  changePageSize,
} = usePagination(amsSysDicList, {
  manual: false,
  defaultParams: [listQuery],
})

const upsertFormSchema = computed(() =>
  defineSchema({
    span: 24,
    fields: [
      defineField.Select({
        show: !!dicPcode,
        label: dicPcode,
        prop: 'dicPcode',
        options: data.value?.data.filter(item => item.enable === 1),
        props: {value: 'dicCode', label: 'dicName'},
      }),
      defineField.Input({
        show: !!dicName,
        label: dicName,
        prop: 'dicName',
        rules: [rules.required()],
      }),
      defineField.Input({
        show: !!dicNameShort,
        label: dicNameShort,
        prop: 'dicNameShort',
        rules: [rules.required()],
      }),
      defineField.Input({
        show: !!dicCode,
        label: dicCode,
        prop: 'dicCode',
        rules: [rules.required()],
      }),
      defineField.Input({
        show: !!dicCodeShort,
        label: dicCodeShort,
        prop: 'dicCodeShort',
        rules: [rules.required()],
      }),
      defineField.Input({
        show: !!dicNotes,
        label: dicNotes,
        prop: 'dicNotes',
        type: 'textarea',
        rows: 4,
      }),
    ],
  })
)

const {runAsync: upsertDic, loading: submitLoading} = useRequest(amsSysDicUpsert)
const {runAsync: deleteDic, loading: deleteLoading} = useRequest(amsSysDicDelete)
const {runAsync: enableDic, loading: enableLoading} = useRequest(amsSysDicEnable)

const handleEdit = (row: SysDicVO) => {
  Object.assign(formModel, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await modelFormRef.value?.validate()

  await upsertDic({...formModel, dicType: props.dicType})
  ElMessage.success(formModel.dicId ? '修改成功' : '新增成功')
  dialogVisible.value = false
  getList(listQuery)
}

const handleAdd = () => {
  resetModel()
  dialogVisible.value = true
}

const handleDelete = async (row: SysDicVO) => {
  await ElMessageBox.confirm(`是否确定删除${row.dicName}？`, {title: '确认提示'})

  await deleteDic({dicId: row.dicId})
  ElMessage.success('删除成功')
  getList(listQuery)
}

const handleEnable = async (row: SysDicVO) => {
  await ElMessageBox.confirm(
    row.enable === 1 ? `是否确定禁用${row.dicName}？` : `是否确定启用${row.dicName}？`,
    {title: '确认提示'}
  )

  await enableDic({dicId: row.dicId, enable: row.enable === 1})

  ElMessage.success(row.enable === 1 ? '启用成功' : '禁用成功')
  getList(listQuery)
}

const fieldMap = {
  dicName: {prop: 'dicName', label: dicName, minWidth: '150'},
  dicNameShort: {prop: 'dicNameShort', label: dicNameShort, minWidth: '150'},
  dicCode: {prop: 'dicCode', label: dicCode, minWidth: '120'},
  dicCodeShort: {prop: 'dicCodeShort', label: dicCodeShort, minWidth: '120'},
  dicPname: {prop: 'dicPname', label: dicPname, minWidth: '120'},
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span>数据列表</span>
        <el-button type="primary" @click="handleAdd">新增字典</el-button>
      </div>
    </template>
    <!-- todo: 选完字典类型后，展示不同的字典列表 -->
    <el-table v-loading="listLoading" :data="data?.data" stripe border>
      <!-- <el-table-column v-if="!!dicName" :label="dicName" prop="dicName" min-width="150" />
      <el-table-column
        v-if="!!dicNameShort"
        :label="dicNameShort"
        prop="dicNameShort"
        min-width="150"
      />
      <el-table-column v-if="!!dicCode" :label="dicCode" prop="dicCode" min-width="120" />
      <el-table-column
        v-if="!!dicCodeShort"
        :label="dicCodeShort"
        prop="dicCodeShort"
        min-width="120"
      />
      <el-table-column
        v-if="!!dicPname"
        :label="dicPname"
        prop="dicPname"
        min-width="120"
      /> -->
      <template v-for="col in Object.keys(props.dicNames || {})" :key="col">
        <el-table-column v-if="fieldMap[col]" v-bind="fieldMap[col]" />
      </template>

      <el-table-column label="状态" prop="enable" width="100" align="center">
        <template #default="{row}">
          <el-tag :type="row.enable === 1 ? 'success' : 'danger'">
            {{ row.enable === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
      <!-- layout="total, sizes, prev, pager, next, jumper" -->
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="pageSize"
        :total="total"
        @size-change="changePageSize"
        @current-change="changeCurrent"
      />
    </div>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="formModel.dicId ? '编辑字典' : '新增字典'"
    width="600px"
    destroy-on-close
    @closed="resetModel"
  >
    <el-form :model="formModel" ref="modelFormRef">
      <dynamic-field render-row :schema="upsertFormSchema" :model="formModel" />
    </el-form>
    <!-- <schema-form :schema="formSchema" :model="formState" :rules="{}" /> -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
