<script lang="ts" setup>
import {reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetRoomGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const roomGet = useRequest(amsAssetRoomGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetRoomVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await roomGet.runAsync({roomId: route.params.id})
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
        {label: '房间号', field: formData.roomNumber, required: true},
        {label: '房间编码', field: formData.roomId, required: true},
        {label: '户型', field: formData.roomLayoutName, required: true},
      ],
      [
        {label: '所属项目', field: formData.projectName, required: true},
        {label: '所属楼栋', field: formData.buildingName, required: true},
        {label: '所属楼层', field: formData.floorName, required: true},
      ],
      [{label: '产权单位', field: formData.ownershipUnitName, required: true}],
    ],
  },
  {
    title: '其他信息',
    fields: [
      [
        {label: '房间类型', field: formData.roomTypeName, required: true},
        {label: '经营模式', field: formData.businessModelName, required: true},
        {label: '房间层高（m）', field: formData.roomHeight, required: true},
      ],
      [
        {label: '建筑面积（m）', field: formData.buildingArea, required: true},
        {label: '计租面积（m）', field: formData.rentalArea, required: true},
        {label: '物业收费面积（m）', field: formData.propertyFeeArea, required: true},
      ],
      [
        {label: '水务户号', field: formData.waterServiceNo, required: true},
        {label: '电网户号', field: formData.powerGridNo, required: true},
        {label: '燃气户号', field: formData.gasNo, required: true},
      ],
      [
        {label: '房源装修等级', field: formData.decorationLevel, required: true},
        {label: '租赁方式', field: formData.leaseType, required: true},
      ],
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
        <el-button type="primary" @click="router.push('/asset/management/room')">返回</el-button>
      </div>
    </el-form>
  </el-card>
</template>
