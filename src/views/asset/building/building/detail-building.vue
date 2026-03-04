<script setup lang="ts">
import {reactive, onMounted, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetBuildingGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const {runAsync: buildingGet} = useRequest(amsAssetBuildingGet)

const formData = reactive({} as AssetBuildingVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await buildingGet({buildingId: route.params.buildingId})
  Object.assign(formData, data)
}

const back = () => router.push('/asset/management/building-floor')

const formConfig = computed(() => [
  [
    {label: '楼栋名称', field: formData.buildingName, required: true},
    {label: '楼栋编码', field: formData.buildingId, required: true},
    {label: '项目名称', field: formData.projectName, required: true},
  ],
  [
    {label: '项目编码', field: formData.projectId, required: true},
    {label: '产权单位', field: formData.ownershipUnitName, required: true},
  ],
])
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
        <el-row :gutter="24" v-for="(row, rowIdx) in formConfig" :key="rowIdx">
          <el-col :span="8" v-for="(item, colIdx) in row" :key="colIdx">
            <el-form-item :label="item.label" :required="item.required">
              {{ item.field || '-' }}
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="back">返回</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
