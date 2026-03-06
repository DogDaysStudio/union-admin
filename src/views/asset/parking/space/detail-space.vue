<script lang="ts" setup>
import {reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetParkingSpaceGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const {runAsync: parkingSpaceGet} = useRequest(amsAssetParkingSpaceGet)

const formData = reactive({} as AssetParkingSpaceVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await parkingSpaceGet({parkingSpaceId: route.params.parkingSpaceId})
  const cloneData = JSON.parse(JSON.stringify(data))
  cloneData.parkingSpaceState =
    cloneData.parkingSpaceState == '0'
      ? '空闲'
      : cloneData.parkingSpaceState == '1'
        ? '出租中'
        : '-'
  Object.assign(formData, cloneData)
}

const formConfig = computed(() => [
  [
    {label: '车位名称', field: formData.parkingSpaceName, required: true},
    {label: '车位面积（㎡）', field: formData.parkingSpaceArea, required: true},
    {label: '车位编码', field: formData.parkingSpaceId, required: true},
  ],
  [
    {label: '项目名称', field: formData.projectName, required: true},
    {label: '停车场', field: formData.parkingName, required: true},
    {label: '车位区域', field: formData.parkingSpaceRegionName, required: true},
  ],
  [
    {label: '车位属性', field: formData.parkingSpaceAttributeName, required: true},
    {label: '是否充电位', field: formData.chargingPortName, required: true},
    {label: '车位状态', field: formData.parkingSpaceState, required: true},
  ],
])
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        详情
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <el-form :model="formData" ref="formRef" label-width="80px" label-position="top">
      <el-row :gutter="24" v-for="(row, rowIdx) in formConfig" :key="rowIdx">
        <el-col :span="8" v-for="(item, colIdx) in row" :key="colIdx">
          <el-form-item :label="item.label" :required="item.required">
            <span class="ml-4">{{ item.field || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="flex justify-center mt-6">
        <el-button type="primary" @click="router.push('/asset/management/parking')">返回</el-button>
      </div>
    </el-form>
  </el-card>
</template>
