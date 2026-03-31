<script setup lang="ts">
import {ref} from 'vue'
import {useForm} from '@/common/hooks/useForm'
import type {FormInstance} from 'element-plus'
import {pmsPropertySopTemplateCopy} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const visible = ref(false)
const formRef = ref<FormInstance>()
const groupOptions = ref<{label: string; value: string}[]>([])

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const [form, resetForm] = useForm(
  {
    targetGroupId: undefined,
    sopId: undefined,
  },
  formRef
)

const rules = {
  targetGroupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
}

const {runAsync: copyAsync, loading: copyLoading} = useRequest(pmsPropertySopTemplateCopy)

const handleOpen = (data: {sopIds: string[]; groupOptions: {label: string; value: string}[]}) => {
  visible.value = true
  groupOptions.value = data.groupOptions
  form.sopId = data.sopIds[0]
  form.targetGroupId = data.groupOptions[0].value
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  await copyAsync(form)
  handleClose()
  emit('finish')
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" width="560px">
    <template #title>
      <h2 class="font-bold text-xl">复制到</h2>
      <p class="text-gray-500 text-sm mt-1">复制已选的SOP到其他分组</p>
    </template>
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="84px"
      label-position="left"
      class="mt-4"
    >
      <el-form-item label="分组" prop="targetGroupId">
        <el-checkbox-group v-model="form.targetGroupId" :options="groupOptions" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="copyLoading">保存</el-button>
    </template>
  </el-dialog>
</template>
