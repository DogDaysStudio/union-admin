<script lang="ts" setup>
import {reactive, onMounted, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetProjectGet} from '@/service/api/amsAsset'

const route = useRoute()

const projectGet = useRequest(amsAssetProjectGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetProjectVO)

const formConfig = computed(() => [
  {
    title: '楼层信息',
    fields: [
      [
        {label: '项目名称', field: formData.projectName, required: true},
        {label: '项目编码', field: formData.projectId, required: true},
        {label: '项目简称', field: formData.projectShortName, required: true},
      ],
      [
        {label: '省市区', field: formData.areaName, required: true},
        {label: '详细地址', field: formData.address, required: true},
        {
          label: '经纬度',
          field: [formData.lng, formData.lat],
          required: true,
          formatter: (vals: (string | number | undefined)[]) =>
            `${vals[0] || '-'} / ${vals[1] || '-'}`,
        },
      ],
      [
        {label: '宗地号', field: formData.landNumber, required: true},
        {label: '产权性质', field: formData.ownershipPropertyName, required: true},
        {label: '产权单位', field: formData.ownershipUnitName, required: true},
      ],
      [
        {label: '筹集方式', field: formData.collectWayName, required: true},
        {label: '筹集主体', field: formData.collectSubjectName, required: true},
        {label: '筹集日期', field: formData.collectDate, required: true},
      ],
      [
        {label: '经营模式', field: formData.businessModelName, required: true},
        {label: '项目类型', field: formData.projectTypeName, required: true},
        {label: '项目电话', field: formData.projectPhone, required: true},
      ],
    ],
  },
  {
    title: '项目数据',
    fields: [
      [
        {label: '楼栋数', field: formData.buildingCount, required: false},
        {label: '楼层数', field: formData.floorCount, required: false},
        {label: '房间（住宅）数', field: formData.roomCount, required: false},
      ],
      [
        {label: '围合数', field: formData.enclosureCount, required: false},
        {label: '房间（商业）数', field: formData.shopCount, required: false},
        {label: '房停车场数', field: formData.parkingCount, required: false},
      ],
      [
        {label: '停车位数', field: formData.parkingSpaceCount, required: false},
        {label: '空间点位数', field: formData.resourceCount, required: false},
      ],
    ],
  },
  {
    title: '建筑信息',
    fields: [
      [
        {label: '总占地面积(㎡)', field: formData.totalLandArea, required: true},
        {label: '总建筑面积(㎡)', field: formData.totalArea, required: true},
        {label: '地上建筑面积(㎡)', field: formData.groundArea, required: true},
      ],
      [
        {label: '地下建筑面积(㎡)', field: formData.undergroundArea, required: true},
        {label: '住宅建筑面积(㎡)', field: formData.roomArea, required: true},
        {label: '住宅实用面积(㎡)', field: formData.roomUtilityArea, required: true},
      ],
      [
        {label: '商业建筑面积(㎡)', field: formData.shopArea, required: true},
        {label: '商业实用面积(㎡)', field: formData.shopUtilityArea, required: true},
        {label: '管理用房面积(㎡)', field: formData.manageRoomArea, required: true},
      ],
      [
        {label: '设备用房面积(㎡)', field: formData.deviceRoomArea, required: true},
        {label: '绿化面积(㎡)', field: formData.greenArea, required: true},
        {label: '物业费收费面积(㎡)', field: formData.propertyFeeArea, required: true},
      ],
      [
        {label: '道路面积(㎡)', field: formData.roadArea, required: true},
        {label: '容积率', field: formData.plotRatio, required: true},
        {label: '竣工时间', field: formData.completeDate, required: true},
      ],
      [{label: '竣备时间', field: formData.prepareDate, required: true}],
    ],
  },
  {
    title: '项目配套',
    fields: [
      [
        {label: '总户数', field: formData.totalHouseholds, required: true},
        {label: '地上车位数量', field: formData.groundParkingSpace, required: true},
        {label: '地下车位数量', field: formData.undergroundParkingSpace, required: true},
      ],
      [
        {label: '机械车位数量', field: formData.machineryParkingSpace, required: true},
        {label: '车位配比', field: formData.parkingSpaceRatio, required: true},
        {label: '人行出入口数量', field: formData.staffEntrance, required: true},
      ],
      [
        {label: '车辆出入口数量', field: formData.carEntrance, required: true},
        {label: '客梯数量', field: formData.customElevator, required: true},
        {label: '货梯数量', field: formData.goodsElevator, required: true},
      ],
      [
        {label: '消防梯数量', field: formData.firefightElevator, required: true},
        {label: '', field: '', required: false},
        {label: '', field: '', required: false},
      ],
      [
        {label: '物业公司名称', field: formData.propertyCompany, required: true},
        {label: '项目负责人', field: formData.projectManager, required: true},
        {
          label: '质保期',
          field: [formData.warrantyContractBegin, formData.warrantyContractEnd],
          required: true,
          formatter: (vals: (string | number | undefined)[]) =>
            `${vals[0] || '-'} / ${vals[1] || '-'}`,
        },
      ],
      [
        {label: '入伙时间', field: formData.checkInDate, required: true},
        {label: '物业合同生效日期', field: formData.contractBegin, required: true},
        {label: '物业合同终止日期', field: formData.contractEnd, required: true},
      ],
      [
        {label: '物业费收费模式', field: formData.propertyFeeModel, required: true},
        {label: '住宅物业收费标准', field: formData.roomStandard, required: true},
        {label: '底商物业收费标准', field: formData.shopStandard, required: true},
      ],
      [
        {label: '独立商业物业收费标准', field: formData.independentShopStandard, required: true},
        {label: '地上车位收费标准', field: formData.groundParkingStandard, required: true},
        {label: '地下车位收费标准', field: formData.undergroundParkingStandard, required: true},
      ],
    ],
  },
])

const getFieldValue = (fieldConfig: FormField): string => {
  if (!fieldConfig.label) return ''
  if (Array.isArray(fieldConfig.field)) {
    const vals = fieldConfig.field.map(val => val ?? '-')
    return fieldConfig.formatter ? fieldConfig.formatter(vals) : vals.join(' / ')
  }
  return fieldConfig.field?.toString() || '-'
}

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  try {
    const {data} = await projectGet.runAsync({projectId: route.params.id})
    const cloneData = JSON.parse(JSON.stringify(data))
    Object.assign(formData, cloneData)
    console.log(formData, 'formData')
    console.log(formConfig.value, 'formConfig')
  } catch (error) {
    console.error('获取项目详情失败：', error)
  }
}

type FormField = {
  label: string
  field: string | number | (string | number)[] | undefined
  required: boolean
  formatter?: (vals: (string | number | undefined)[]) => string
}
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="基本信息">
      <el-form :model="formData" label-width="80px" label-position="top">
        <section-group
          v-for="(group, groupIdx) in formConfig"
          :key="groupIdx"
          :title="group.title"
          inline
        >
          <el-row :gutter="24" v-for="(row, rowIdx) in group.fields" :key="rowIdx">
            <el-col :span="8" v-for="(field, colIdx) in row" :key="colIdx">
              <el-form-item :label="field.label" :required="field.required">
                <span class="ml-4">{{ getFieldValue(field) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="项目接收">Config</el-tab-pane>
    <el-tab-pane label="察验移交">Role</el-tab-pane>
  </el-tabs>
</template>
