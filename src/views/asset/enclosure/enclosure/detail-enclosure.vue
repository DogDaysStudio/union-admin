<script setup lang="ts">
import {reactive, onMounted, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {amsAssetEnclosureGet} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

const router = useRouter()
const route = useRoute()

const {runAsync: enclosureGet} = useRequest(amsAssetEnclosureGet)

const formData = reactive({} as AssetEnclosureVO)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data} = await enclosureGet({enclosureId: route.params.id})
  Object.assign(formData, data)
}

const back = () => router.push('/asset/management/enclosure-floor')

const formConfig = computed(() => [
  [
    {label: '围合名称', field: formData.enclosureName, required: true},
    {label: '围合编码', field: formData.enclosureId, required: true},
    {label: '所属项目', field: formData.projectName, required: true},
  ],
  [
    {label: '项目编码', field: formData.projectId, required: true},
    {label: '围合类型', field: formData.enclosureTypeName, required: true},
    {label: '产权单位', field: formData.ownershipUnitName, required: true},
  ],
])
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
