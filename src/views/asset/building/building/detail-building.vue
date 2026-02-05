<script setup lang="ts">
import {reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetBuildingGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const buildingGet = useRequest(amsAssetBuildingGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetBuildingVO)

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
      <el-form :model="formData" ref="formRef" label-width="80px" label-position="top">
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
