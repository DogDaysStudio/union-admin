<script setup lang="ts">
import {reactive, onMounted, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {amsAssetResourceGet} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

const router = useRouter()
const route = useRoute()

const {runAsync: resourceGet} = useRequest(amsAssetResourceGet)

const formData = reactive({} as AssetResourceVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await resourceGet({
    resourceId: route.params.resourceId,
  } as AssetResourceVO)
  const cloneData = JSON.parse(JSON.stringify(data))
  cloneData.enable = cloneData.enable == '0' ? '禁用' : cloneData.enable == '1' ? '启用' : '-'
  cloneData.resourceState =
    cloneData.resourceState == '0' ? '待租' : cloneData.resourceState == '1' ? '已租' : '-'
  Object.assign(formData, cloneData)
}

const formConfig = computed(() => [
  {
    title: '基本信息',
    fields: [
      [
        {label: '所属项目', field: formData.projectName, required: true},
        {label: '所属围合/楼栋', field: formData.assetName, required: false},
        {label: '所属楼层', field: formData.floorName, required: false},
      ],
      [
        {label: '位置', field: formData.locationName, required: true},
        {label: '经营模式', field: formData.businessModelName, required: false},
        {label: '房间号/商铺号', field: formData.locationId, required: false},
      ],
      [
        {label: '业务类型', field: formData.resourceBusinessType, required: true},
        {label: '点位类型', field: formData.resourceType, required: true},
        {label: '广告类型', field: formData.resourceAdType, required: true},
      ],
      [
        {label: '媒体类型', field: formData.resourceMediaType, required: true},
        {label: '业务标签', field: formData.resourceBusinessTag, required: true},
      ],
    ],
  },
  {
    title: '点位信息',
    fields: [
      [
        {label: '空间点位资源名称', field: formData.resourceName, required: true},
        {label: '空间点位资源编号', field: formData.resourceNumber, required: true},
        {label: '空间点位资源编码', field: formData.resourceId, required: true},
      ],
      [
        {label: '规格', field: formData.resourceSpecs, required: true},
        {label: '面积（㎡）', field: formData.resourceArea, required: true},
        {label: '点位资源状态', field: formData.resourceState, required: true},
      ],
      [{label: '启停状态', field: formData.enable, required: true}],
    ],
  },
])
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <div class="mx-auto">
      <el-form :model="formData" ref="formRef" label-width="80px" label-position="top">
        <section-group
          v-for="(group, groupIdx) in formConfig"
          :key="groupIdx"
          :title="group.title"
          inline
        >
          <el-row :gutter="24" v-for="(row, rowIdx) in group.fields" :key="rowIdx">
            <el-col :span="8" v-for="(item, colIdx) in row" :key="colIdx">
              <el-form-item :label="item.label" :required="item.required">
                <span class="ml-4">{{ item.field || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="router.push('/asset/management/point')">返回</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
