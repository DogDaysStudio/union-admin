<script setup lang="ts">
import {ref, reactive, useTemplateRef} from 'vue'
import {useRouter} from 'vue-router'
import {Upload} from '@element-plus/icons-vue'
import {defineField, defineSchema} from '@/components'
import {rules} from '@/common/rules'
import type {UploadUserFile} from 'element-plus'

const router = useRouter()

// 表单数据
const form = reactive({
  name: '',
  account: '',
  phone: '',
  idCard: '',
  gender: '男',
  email: '',
  department: '',
  role: '',
  type: 'internal',
  wechat: '',
  company: '',
  employeeId: '',
  photo: '',
  permissionScope: 'department',
})

// 表单引用
const formRef = useTemplateRef('formRef')

// 处理提交
const handleSubmit = async () => {
  await formRef.value?.validate()
  console.log('提交表单', form)
  // 这里可以添加表单验证和提交的逻辑
  // 提交成功后跳转到人员管理页面
  // router.push('/management/personnel')
}

// 处理重置
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()

  // Object.assign(form, {
  //   name: '',
  //   account: '',
  //   phone: '',
  //   idCard: '',
  //   gender: '男',
  //   email: '',
  //   department: '',
  //   role: '',
  //   type: 'internal',
  //   wechat: '',
  //   company: '',
  //   employeeId: '',
  //   photo: '',
  //   permissionScope: 'department',
  // })
}

const basicSchema = defineSchema({
  span: 24,
  fields: [
    defineField.Input({
      label: '人员姓名',
      prop: 'name',
      placeholder: '请填写员工姓名',
      // required: true,
      rules: [rules.required()],
    }),
    defineField.Input({label: '登录账号', prop: 'account', placeholder: '请填写登录账号'}),
    defineField.Input({label: '手机号码', prop: 'phone', placeholder: '请填写手机号码'}),
    defineField.Input({label: '身份证号码', prop: 'idCard', placeholder: '请填写身份证号码'}),
    defineField.RadioGroup({
      label: '人员性别',
      prop: 'gender',
      options: [
        {value: '男', label: '男'},
        {value: '女', label: '女'},
      ],
    }),
    defineField.Input({label: '邮箱地址', prop: 'email', placeholder: '请填写邮箱地址'}),
    defineField.Input({label: '所属部门', prop: 'department', placeholder: '请选择所属部门'}),
    defineField.Select({
      label: '当前角色',
      prop: 'role',
      placeholder: '请选择当前角色',
      options: [
        {value: 'admin', label: '管理员'},
        {value: 'user', label: '普通用户'},
      ],
    }),
    defineField.Select({
      label: '特性',
      prop: 'type',
      placeholder: '请选择特性',
      options: [
        {value: 'internal', label: '内部员工'},
        {value: 'external', label: '外部员工'},
      ],
    }),
  ],
})

const fileList = ref<UploadUserFile[]>([])
const uploadRef = useTemplateRef('uploadRef')
const handleValidate = async () => {
  const ids = await uploadRef.value?.validate()
  console.log('ids', ids)
}

// 辅助信息 schema
const auxiliarySchema = defineSchema({
  span: 24,
  fields: [
    //
    defineField.Input({label: '企业微信号', prop: 'wechat', placeholder: '请填写微信号'}),
    defineField.Input({label: '企业名称', prop: 'company', placeholder: '请填写所属公司'}),
    defineField.Input({label: '工号', prop: 'employeeId', placeholder: '请填写员工编号'}),
    // defineField.Upload({
    //   label: '人员照片',
    //   prop: 'photo',
    //   placeholder: '点击上传人员照片',
    //   accept: 'image/*',
    //   list-type: 'picture-card',
    //   :auto-upload="false",
    //   :on-success="handlePhotoChange",
    // }),
    // defineField.UploadFile({
    //   label: '人员照片',
    //   prop: 'photo',
    //   // ref: 'uploadRef',
    //   ref: uploadRef,
    // }),
    defineField.RadioGroup({
      label: '',
      prop: 'permissionScope',
      options: [
        {
          value: 'department',
          label:
            '所属部门及以下部门（所属部门及下属部门能操作自己、下属和自己所属部门及其子部门的数据）',
        },
        {value: 'company', label: '全公司（能操作全公司的数据）'},
      ],
    }),
  ],
})
</script>

<template>
  <el-form ref="formRef" :model="form" label-width="120px">
    <section-group title="基础信息" @click="handleValidate">
      <template #extra>
        <span class="text-red-500">*</span>
        为必填项
      </template>
      <dynamic-field render-row :schema="basicSchema" :model="form" />
    </section-group>

    <section-group title="辅助信息">
      <template #extra>
        <span class="text-red-500">*</span>
        为必填项
      </template>

      <el-row :gutter="24">
        <dynamic-field :schema="auxiliarySchema" :model="form" />

        <el-col :span="24">
          <el-form-item label="人员照片" prop="photo">
            <upload-file ref="uploadRef" v-model:file-list="fileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="企业微信号" prop="wechat">
        <el-input v-model="form.wechat" placeholder="请输入企业微信号" />
      </el-form-item>

      <el-form-item label="企业名称" prop="company">
        <el-input v-model="form.company" placeholder="请填写企业名称" />
      </el-form-item>

      <el-form-item label="工号" prop="employeeId">
        <el-input v-model="form.employeeId" placeholder="请填写工号" />
      </el-form-item>

      <el-form-item label="照片" prop="photo">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handlePhotoChange"
          :show-file-list="false"
        >
          <div
            class="border-2 border-dashed border-gray-300 w-32 h-32 flex flex-col items-center justify-center cursor-pointer"
          >
            <el-icon class="text-gray-400"><Upload /></el-icon>
            <span class="text-gray-400">上传图片</span>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="">
        <el-radio-group v-model="form.permissionScope">
          <el-radio label="department">
            所属部门及以下部门（所属部门及下属部门能操作自己、下属和自己所属部门及其子部门的数据）
          </el-radio>
          <el-radio label="company">全公司（能操作全公司的数据）</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- 提交按钮 -->
      <el-form-item class="mt-6">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </section-group>
  </el-form>
</template>

<style scoped>
/* .upload-demo {
  width: 128px;
  height: 128px;
} */
</style>
