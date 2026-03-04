<script lang="ts" setup>
import {reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetShopGet} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

const {runAsync: shopGet} = useRequest(amsAssetShopGet)

const formData = reactive({} as AssetShopVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await shopGet({shopId: route.params.shopId})
  data.shopState = (data.shopState == 0
    ? '空闲'
    : data.shopState == 1
      ? '出租中'
      : '-') as unknown as number
  data.cateringCondition = (data.cateringCondition == 0
    ? '否'
    : data.cateringCondition == 1
      ? '是'
      : '-') as unknown as number
  data.gasCondition = (data.gasCondition == 0
    ? '否'
    : data.gasCondition == 1
      ? '是'
      : '-') as unknown as number
  data.weakCurrentCondition = (data.weakCurrentCondition == 0
    ? '否'
    : data.weakCurrentCondition == 1
      ? '是'
      : '-') as unknown as number
  Object.assign(formData, data)
}

const formConfig = computed(() => [
  {
    title: '基本信息',
    fields: [
      [
        {label: '商铺名称', field: formData.shopName, required: true},
        {label: '商铺号', field: formData.shopNumber, required: true},
        {label: '商铺编码', field: formData.shopId, required: true},
      ],
      [
        {label: '所属项目', field: formData.projectName, required: true},
        {label: '所属楼栋/围合', field: formData.assetName, required: true},
        {label: '所属楼层', field: formData.floorName, required: true},
      ],
      [
        {label: '产权单位', field: formData.ownershipUnitName, required: true},
        {label: '产权类型', field: formData.ownershipTypeName, required: true},
        {label: '产权年限', field: formData.ownershipYear, required: true},
      ],
      [
        {label: '产权比例（%）', field: formData.ownershipRatio, required: true},
        {label: '不动产编号', field: formData.realEstateNumber, required: false},
      ],
    ],
  },
  {
    title: '其他信息',
    fields: [
      [
        {label: '商铺类型', field: formData.shopTypeName, required: true},
        {label: '经营模式', field: formData.businessModelName, required: true},
        {label: '商铺层高（m）', field: formData.shopHeight, required: true},
      ],
      [
        {label: '建筑面积（m）', field: formData.buildingArea, required: true},
        {label: '计租面积（m）', field: formData.rentalArea, required: true},
        {label: '实用面积（㎡）', field: formData.usableArea, required: true},
      ],
      [
        {label: '物业费收费面积（㎡）', field: formData.propertyFeeArea, required: true},
        {label: '装修情况', field: formData.decorationLevel, required: true},
        {label: '商铺状态', field: formData.shopState, required: true},
      ],
      [
        {label: '资源类别', field: formData.resourceCategory, required: true},
        {label: '资源类型', field: formData.resourceType, required: true},
        {label: '资源等级', field: formData.resourceLevel, required: true},
      ],
      [
        {label: '生效时间', field: formData.effectiveTime, required: true},
        {label: '失效时间', field: formData.expireTime, required: true},
      ],
      [
        {label: '餐饮条件', field: formData.cateringCondition, required: false},
        {label: '燃气', field: formData.gasCondition, required: false},
        {label: '弱电条件', field: formData.weakCurrentCondition, required: false},
      ],
      [
        {label: '电表号', field: formData.powerGridNo, required: false},
        {label: '水表号', field: formData.waterServiceNo, required: false},
        {label: '燃气号', field: formData.gasNo, required: false},
      ],
      [{label: '电压', field: formData.voltage, required: false}],
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
        <el-button type="primary" @click="router.push('/asset/management/shop')">返回</el-button>
      </div>
    </el-form>
  </el-card>
</template>
