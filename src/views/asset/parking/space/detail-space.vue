<template>
  <div>1</div>
</template>
<!-- <script lang="ts" setup>
import {reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetRoomGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const {runAsync: roomGet} = useRequest(amsAssetRoomGet)

const formData = reactive({} as AssetRoomVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await roomGet({roomId: route.params.id})
  const cloneData = JSON.parse(JSON.stringify(data))
  cloneData.leaseType =
    cloneData.leaseType == '0' ? '整租' : cloneData.leaseType == '1' ? '合租' : '-'
  Object.assign(formData, cloneData)
}

const formConfig = computed(() => [
  {
    title: '基本信息',
    fields: [
      [
        {label: '车位名称', field: formData.roomNumber, required: true},
        {label: '面积', field: formData.roomId, required: true},
        {label: '车位编码', field: formData.roomLayoutName, required: true},
      ],
      [
        {label: '项目名称', field: formData.projectName, required: true},
        {label: '停车场', field: formData.buildingName, required: true},
        {label: '车位区域', field: formData.floorName, required: true},
      ],
      [
        {label: '车位属性', field: formData.ownershipUnitName, required: true},
        {label: '是否充电位', field: formData.ownershipUnitName, required: true},
        {label: '车位状态', field: formData.ownershipUnitName, required: true},
      ],
    ],
  },
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
        <el-button type="primary" @click="router.push('/asset/management/parking')">返回</el-button>
      </div>
    </el-form>
  </el-card>
</template> -->
