<script setup lang="ts">
import {useModel} from '@/common/hooks'
import {rules} from '@/common/rules'
import {defineSchema, defineField} from '@/components'
import {amsSysDic} from '@/service/api/amsSysDic'
import {ElMessageBox, ElMessage} from 'element-plus'
import {reactive, useTemplateRef, computed, ref} from 'vue'
import {usePagination, useRequest} from 'vue-request'

const props = defineProps<{
  dicType: number
}>()

const dialogVisible = ref(false)
const editDialogVisible = ref(false)

const listQuery = reactive({dicType: props.dicType, pageable: false} as SysDicListDTO)

const modelFormRef = useTemplateRef('modelFormRef')
const [formModel, resetFormModel] = useModel({dicList: [{}] as SysDicUpsertDTO[]}, modelFormRef)
const editModelRef = useTemplateRef('editModelRef')
const [editModel, resetEditModel] = useModel({} as SysDicUpsertDTO, editModelRef)

const {
  runAsync: amsSysDicList,
  loading: amsSysDicListLoading,
  data,
} = usePagination(amsSysDic.amsSysDicList, {
  manual: false,
  defaultParams: [listQuery],
})

const upsertFormSchema = computed(() =>
  defineSchema({
    span: 24,
    fields: [
      defineField.ListField({
        prop: 'dicList',
        formItemProps: {labelWidth: 0},
        schema: {
          fields: [
            defineField.Input({
              prop: 'dicName',
              label: '经营模式',
              rules: [rules.required()],
            }),
            defineField.Input({prop: 'dicCode', label: '简写', rules: [rules.required()]}),
          ],
        },
      }),
    ],
  })
)
const editFormSchema = defineSchema({
  span: 24,
  fields: [
    defineField.Input({
      prop: 'dicName',
      label: '经营模式',
      rules: [rules.required()],
    }),
    defineField.Input({prop: 'dicCode', label: '简写', rules: [rules.required()]}),
  ],
})

const {runAsync: upsertDic, loading: submitLoading} = useRequest(amsSysDic.amsSysDicUpsert)
const {runAsync: deleteDic, loading: deleteLoading} = useRequest(amsSysDic.amsSysDicDelete)
const {runAsync: enableDic, loading: enableLoading} = useRequest(amsSysDic.amsSysDicEnable)

const handleEdit = (row: SysDicVO) => {
  Object.assign(editModel, row)
  editDialogVisible.value = true
}

const handleEditSubmit = async () => {
  await editModelRef.value?.validate()

  await upsertDic({...editModel, dicType: props.dicType})

  ElMessage.success('修改成功')
  editDialogVisible.value = false
  amsSysDicList(listQuery)
}

const handleSubmit = async () => {
  await modelFormRef.value?.validate()

  for (const item of formModel.dicList) {
    await upsertDic({...item, dicType: props.dicType})
  }

  ElMessage.success('新增成功')
  dialogVisible.value = false
  amsSysDicList(listQuery)
}

const handleDelete = async (row: SysDicVO) => {
  await ElMessageBox.confirm(`是否确定删除${row.dicName}？`, {title: '确认提示'})

  await deleteDic({dicId: row.dicId})
  ElMessage.success('删除成功')
  amsSysDicList(listQuery)
}

const handleEnable = async (row: SysDicVO) => {
  await ElMessageBox.confirm(
    row.enable === 1 ? `是否确定禁用${row.dicName}？` : `是否确定启用${row.dicName}？`,
    {title: '确认提示'}
  )

  await enableDic({dicId: row.dicId, enable: !row.enable})

  ElMessage.success(row.enable === 1 ? '禁用成功' : '启用成功')
  amsSysDicList(listQuery)
}

const handleAdd = () => {
  // if (!formModel.dicList?.length) {
  //   formModel.dicList = [{} as SysDicUpsertDTO]
  // }
  dialogVisible.value = true
}
</script>

<template>
  <section-group title="数据列表">
    <template #extra>
      <el-button type="primary" @click="handleAdd">新增经营模式</el-button>
    </template>
    <el-table v-loading="amsSysDicListLoading" :data="data?.data" stripe border>
      <el-table-column type="selection" width="50" />
      <el-table-column label="经营模式" prop="dicName" min-width="150" />
      <el-table-column label="简写" prop="dicCode" min-width="120" />
      <el-table-column label="状态" prop="enable" width="100" align="center">
        <template #default="{row}">
          <el-tag :type="row.enable === 1 ? 'success' : 'danger'">
            {{ row.enable === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{row}">
          <el-button
            :type="row.enable === 1 ? 'danger' : 'success'"
            link
            :loading="enableLoading"
            @click="handleEnable(row)"
          >
            {{ row.enable === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link :loading="deleteLoading" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <el-dialog
    v-model="editDialogVisible"
    title="编辑经营模式"
    width="600px"
    destroy-on-close
    @closed="resetEditModel"
  >
    <el-form :model="editModel" ref="editModelRef">
      <dynamic-field render-row :schema="editFormSchema" :model="editModel" />
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleEditSubmit">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogVisible"
    title="新增经营模式"
    width="600px"
    destroy-on-close
    @closed="resetFormModel"
  >
    <el-form :model="formModel" ref="modelFormRef">
      <dynamic-field render-row :schema="upsertFormSchema" :model="formModel" />
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
