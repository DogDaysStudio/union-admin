<script setup lang="ts">
import {ref, computed} from 'vue'
import {useForm} from '@/common/hooks/useForm'
import type {FormInstance} from 'element-plus'
import {pmsPropertySopStepInsert, pmsPropertySopStepUpdate} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const visible = ref(false)
const formRef = ref<FormInstance>()

const [form, resetForm] = useForm(
  {
    title: undefined,
    description: undefined,
    prompt: undefined,
    workHours: undefined,
    score: undefined,
    required: undefined,
    photoRequired: undefined,
    categoryId: undefined,
    id: undefined,
  },
  formRef
)

const rules = {
  categoryId: [{required: true, message: '请选择分类', trigger: 'blur'}],
  title: [{required: true, message: '请输入标题', trigger: 'blur'}],
  description: [{required: true, message: '请输入描述', trigger: 'blur'}],
  prompt: [{required: true, message: '请输入提示语', trigger: 'blur'}],
  workHours: [{required: true, message: '请输入工时', trigger: 'blur'}],
  score: [{required: true, message: '请输入分值', trigger: 'blur'}],
  required: [{required: true, message: '请选择是否必填', trigger: 'blur'}],
  photoRequired: [{required: true, message: '请选择是否需要拍照', trigger: 'blur'}],
}

const {runAsync: insertAsync, loading: insertLoading} = useRequest(pmsPropertySopStepInsert)
const {runAsync: updateAsync, loading: updateLoading} = useRequest(pmsPropertySopStepUpdate)

const isEdit = computed(() => {
  return form.id !== undefined
})

const handleClose = () => {
  visible.value = false
  resetForm()
}

const handleOpen = (row: Partial<PmsSopStepVO>) => {
  visible.value = true
  Object.assign(form, row)
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  if (isEdit.value) {
    await updateAsync(form)
  } else {
    await insertAsync(form)
  }
  handleClose()
  emit('finish')
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" width="560px">
    <template #title>
      <h2 class="font-bold text-xl">增加步骤</h2>
    </template>
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="84px"
      label-position="left"
      class="mt-4"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="提示语" prop="prompt">
        <el-input v-model="form.prompt"></el-input>
      </el-form-item>
      <el-form-item label="工时" prop="workHours">
        <el-input-number v-model="form.workHours"></el-input-number>
      </el-form-item>
      <el-form-item label="分值" prop="score">
        <el-input-number v-model="form.score"></el-input-number>
      </el-form-item>
      <el-form-item label="必填" prop="required">
        <el-radio-group v-model="form.required">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="拍照" prop="photoRequired">
        <el-radio-group v-model="form.photoRequired">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="insertLoading || updateLoading">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
