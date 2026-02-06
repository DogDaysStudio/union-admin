<script setup lang="ts">
import {reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {amsAssetEnclosureGet} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

const router = useRouter()
const route = useRoute()

const enclosureGet = useRequest(amsAssetEnclosureGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetEnclosureVO)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: detail} = await enclosureGet.runAsync({enclosureId: route.params.id})
  Object.assign(formData, detail)
}

const handleSubmit = () => () => router.push('/asset/management/enclosure-floor')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        围合详情
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <div class="mx-auto">
      <el-form :model="formData" ref="formRef" label-position="top">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="围合名称" required>
              {{ formData.enclosureName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合编码" required>
              {{ formData.enclosureId }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" required>
              {{ formData.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" required>
              {{ formData.projectId }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合类型" required>
              {{ formData.enclosureTypeName }}
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
