<script setup lang="ts">
import {reactive, onMounted} from 'vue'
import type {FormRules} from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

const router = useRouter()
const route = useRoute()

// 楼栋详情
const buildingGet = useRequest(amsAsset.amsAssetBuildingGet, {
  throttleInterval: 500,
})

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetBuildingVO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  buildingName: {required: true, message: '请填写楼栋名称', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => getDetail())

// 获取详情
const getDetail = async (): Promise<void> => {
  const {data} = await buildingGet.runAsync({buildingId: route.params.id})
  Object.assign(formData, data)
}

const handleSubmit = () => router.push('/asset/management/building-floor')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑楼栋
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <div class="mx-auto">
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="楼栋名称" required>
              {{ formData.buildingName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼栋编码" required>
              {{ formData.buildingId }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" required>
              {{ formData.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" required>
              {{ formData.projectId }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" required>
              {{ formData.ownershipUnitName }}
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
