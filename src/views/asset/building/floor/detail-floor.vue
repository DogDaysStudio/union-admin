<script setup lang="ts">
import {reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetFloorGet} from '@/service/api/amsAsset'

const route = useRoute()
const router = useRouter()

const {runAsync: getFloor} = useRequest(amsAssetFloorGet)

const formData = reactive({} as AssetFloorVO)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data} = await getFloor({floorId: route.params.floorId})
  Object.assign(formData, data)
}

const back = () => router.push('/asset/management/building-floor')

const formConfig = computed(() => [
  [
    {label: '楼层名称', field: formData.floorName, required: true},
    {label: '楼层编码', field: formData.floorId, required: true},
    {label: '层高（m）', field: formData.floorHeight, required: true},
  ],
  [
    {label: '所属项目', field: formData.projectName, required: true},
    {label: '项目编码', field: formData.projectId, required: true},
    {label: '所属楼栋', field: formData.assetName, required: true},
  ],
  [
    {label: '楼栋编码', field: formData.assetId, required: true},
    {label: '产权单位', field: formData.ownershipUnitName, required: true},
  ],
])
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">楼层详情</div>
    </template>
    <div class="mx-auto">
      <el-form
        :model="formData"
        ref="formRef"
        label-width="80px"
        label-position="top"
        :validate-on-rule-change="false"
        :validate-on-init="false"
      >
        <el-row :gutter="24" v-for="(row, rowIdx) in formConfig" :key="rowIdx">
          <el-col :span="8" v-for="(item, colIdx) in row" :key="colIdx">
            <el-form-item :label="item.label" :required="item.required">
              <span>{{ item.field || '-' }}</span>
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
