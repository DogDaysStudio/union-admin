<script setup lang="ts">
import {ref, defineEmits} from 'vue'
import {useForm} from '@/common/hooks/useForm'
import type {FormInstance} from 'element-plus'
import {pmsPropertySopTemplateInsert} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const visible = ref(false)
const formRef = ref<FormInstance>()
const groupOptions = ref<{label: string; value: string}[]>([])

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const [form, resetForm] = useForm(
  {
    sopName: undefined,
    groupId: undefined,
  },
  formRef
)

const rules = {
  sopName: [{required: true, message: '请输入SOP名称', trigger: 'blur'}],
  groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
}

const {runAsync: insertAsync, loading: insertLoading} = useRequest(pmsPropertySopTemplateInsert)

const handleOpen = (groups: {label: string; value: string}[]) => {
  visible.value = true
  groupOptions.value = groups
  form.groupId = groups[0].value
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  await insertAsync(form)
  ElMessage.success('新建SOP成功')
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
      <h2 class="font-bold text-xl">新建SOP</h2>
      <p class="text-gray-500 text-sm mt-1">选择创建到的文组，创建后也可以调整。</p>
    </template>
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="84px"
      label-position="left"
      class="mt-4"
    >
      <el-form-item label="分组" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择分组">
          <el-option
            v-for="group in groupOptions"
            :key="group.value"
            :label="group.label"
            :value="group.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SOP名称" prop="sopName">
        <el-input v-model="form.sopName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="insertLoading">下一步</el-button>
    </template>
  </el-dialog>
</template>
