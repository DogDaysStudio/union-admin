<script setup lang="ts">
import {computed, useTemplateRef} from 'vue'
import {defineField, defineSchema} from '@/components'
import {rules} from '@/common/rules'
import {useRequest} from 'vue-request'
import {iamAuthUserIsLoginAccountExist, iamAuthUserUpsert} from '@/service/api/imaAuthUser'
import {useForm} from '@/common/hooks'
import {iamAuthOrgList, iamAuthRoleList} from '@/service/api/iamAuth'
import {amsCommonFuncZhToPinyin} from '@/service/api/iamCommon'

// 表单引用
const formRef = useTemplateRef('formRef')
// const form = reactive({} as AuthUserUpsertDTO)
// 表单数据
const [form, resetForm] = useForm({} as AuthUserUpsertDTO, formRef)

const {runAsync: upsertAsync, loading: upsertLoading} = useRequest(iamAuthUserUpsert)
// 处理提交
const handleSubmit = async () => {
  await formRef.value?.validate()
  console.log('提交表单', form)
  // 这里可以添加表单验证和提交的逻辑
  // 提交成功后跳转到人员管理页面
  // router.push('/management/personnel')
  await upsertAsync(form)
  ElMessage.success('提交成功')
}

const {data: roleList} = useRequest(iamAuthRoleList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthRoleListDTO],
})
// 部门列表
const {data: orgList} = useRequest(iamAuthOrgList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthOrgListDTO],
})

const {runAsync: zhToPinyinAsync} = useRequest(amsCommonFuncZhToPinyin, {
  manual: true,
  debounceInterval: 1500,
})

// 检查登录账号是否已存在
const checkLoginAccount = async (value: string) => {
  if (!value) return
  const {data} = await iamAuthUserIsLoginAccountExist({loginAccount: value})
  if (data) {
    ElMessage.error('登录账号已存在')
  }
}

const basicSchema = computed(() =>
  defineSchema({
    span: 24,
    fields: [
      defineField.Input({
        label: '人员姓名',
        prop: 'certName',
        placeholder: '请填写员工姓名',
        rules: [rules.required()],
        onInput: value => {
          if (!value) return
          zhToPinyinAsync({key: value}, {showError: false}).then(({data}) => {
            if (data) {
              form.loginAccount = data
              checkLoginAccount(data)
            }
          })
        },
      }),
      defineField.Input({
        label: '登录账号',
        prop: 'loginAccount',
        placeholder: '请填写登录账号',
        rules: [rules.required()],
        onBlur: () => {
          if (form.loginAccount) {
            checkLoginAccount(form.loginAccount)
          }
        },
      }),
      defineField.Input({
        label: '手机号码',
        prop: 'mobile',
        placeholder: '请填写手机号码',
        rules: [rules.required(), rules.mobile()],
      }),
      defineField.Input({
        label: '身份证号码',
        prop: 'certNo',
        placeholder: '请填写身份证号码',
        rules: [rules.idCard()],
      }),
      defineField.RadioGroup({
        label: '人员性别',
        prop: 'gender',
        rules: [rules.required()],
        options: [
          {value: '男', label: '1'},
          {value: '女', label: '2'},
        ],
      }),
      defineField.Input({
        label: '邮箱地址',
        prop: 'email',
        placeholder: '请填写邮箱地址',
        rules: [rules.email()],
      }),
      defineField.Select({
        label: '所属部门',
        prop: 'orgIdList',
        placeholder: '请选择所属部门',
        rules: [rules.required()],
        options: orgList.value?.data,
        props: {label: 'orgName', value: 'orgId'},
        multiple: true,
      }),
      defineField.Select({
        label: '当前角色',
        prop: 'roleIdList',
        placeholder: '请选择当前角色',
        rules: [rules.required()],
        options: roleList.value?.data,
        props: {label: 'roleName', value: 'roleId'},
        multiple: true,
      }),
      // defineField.Select({
      //   label: '特性',
      //   prop: 'type',
      //   placeholder: '请选择特性',
      //   options: [
      //     {value: 'internal', label: '内部员工'},
      //     {value: 'external', label: '外部员工'},
      //   ],
      // }),
    ],
  })
)

// const uploadRef = useTemplateRef('uploadRef')
const handleValidate = async () => {
  // const ids = await uploadRef.value?.validate()
  // console.log('ids', ids)
}

// 辅助信息 schema
const auxiliarySchema = defineSchema({
  span: 24,
  fields: [
    //
    defineField.Input({label: '企业微信号', prop: 'weworkUid', placeholder: '请填写微信号'}),
    defineField.Select({label: '企业名称', prop: 'companyCode', placeholder: '请填写所属公司'}),
    defineField.Input({label: '工号', prop: 'employeeNumber', placeholder: '请填写员工编号'}),
    // defineField.Upload({
    //   label: '人员照片',
    //   prop: 'photo',
    //   placeholder: '点击上传人员照片',
    //   accept: 'image/*',
    //   list-type: 'picture-card',
    //   :auto-upload="false",
    //   :on-success="handlePhotoChange",
    // }),
    defineField.UploadFile({
      label: '照片',
      prop: 'avatarFid',
      valuePropName: 'fileList',
    }),
    // defineField.RadioGroup({
    //   label: '',
    //   prop: 'permissionScope',
    //   options: [
    //     {
    //       value: 'department',
    //       label:
    //         '所属部门及以下部门（所属部门及下属部门能操作自己、下属和自己所属部门及其子部门的数据）',
    //     },
    //     {value: 'company', label: '全公司（能操作全公司的数据）'},
    //   ],
    // }),
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

        <!-- <el-col :span="24">
          <el-form-item label="人员照片" prop="avatarFid" required>
            <upload-file ref="uploadRef" v-model:file-list="form.avatarFid as any"></upload-file>
          </el-form-item>
        </el-col> -->
      </el-row>

      <!-- 提交按钮 -->
      <el-form-item class="mt-6">
        <el-button type="primary" @click="handleSubmit" :loading="upsertLoading">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
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
