<script lang="ts" setup>
import {reactive, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetProjectGet} from '@/service/api/amsAsset'

const route = useRoute()

// 项目详情请求
const projectGet = useRequest(amsAssetProjectGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetProjectVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data} = await projectGet.runAsync({projectId: route.params.id})
  const cloneData = JSON.parse(JSON.stringify(data))
  Object.assign(formData, cloneData)
}

// 简化的表单配置（移除复杂接口，保留类型安全）
type FormField = {
  label: string
  field: string | string[]
  required: boolean
  formatter?: (vals: (string | number | undefined)[]) => string
}

const formConfig = [
  {
    title: '楼层信息',
    fields: [
      [
        {label: '项目名称', field: 'projectName', required: true},
        {label: '项目编码', field: 'projectId', required: true},
        {label: '项目简称', field: 'projectShortName', required: true},
      ],
      [
        {label: '省市区', field: 'areaName', required: true},
        {label: '详细地址', field: 'address', required: true},
        {
          label: '经纬度',
          field: ['lng', 'lat'],
          required: true,
          formatter: (vals: (string | number | undefined)[]) =>
            `${vals[0] || '-'} / ${vals[1] || '-'}`,
        },
      ],
      [
        {label: '宗地号', field: 'landNumber', required: true},
        {label: '产权性质', field: 'ownershipPropertyName', required: true},
        {label: '产权单位', field: 'ownershipUnitName', required: true},
      ],
      [
        {label: '筹集方式', field: 'collectWayName', required: true},
        {label: '筹集主体', field: 'collectSubjectName', required: true},
        {label: '筹集日期', field: 'collectDate', required: true},
      ],
      [
        {label: '经营模式', field: 'businessModelName', required: true},
        {label: '项目类型', field: 'projectTypeName', required: true},
        {label: '项目电话', field: 'projectPhone', required: true},
      ],
    ],
  },
  {
    title: '项目数据',
    fields: [
      [
        {label: '楼栋数', field: 'buildingCount', required: false},
        {label: '楼层数', field: 'floorCount', required: false},
        {label: '房间（住宅）数', field: 'roomCount', required: false},
      ],
      [
        {label: '围合数', field: 'enclosureCount', required: false},
        {label: '房间（商业）数', field: 'shopCount', required: false},
        {label: '房停车场数', field: 'parkingCount', required: false},
      ],
      [
        {label: '停车位数', field: 'parkingSpaceCount', required: false},
        {label: '空间点位数', field: 'resourceCount', required: false},
        {label: '', field: '', required: false}, // 空占位
      ],
    ],
  },
  {
    title: '建筑信息',
    fields: [
      [
        {label: '总占地面积(㎡)', field: 'totalLandArea', required: true},
        {label: '总建筑面积(㎡)', field: 'totalArea', required: true},
        {label: '地上建筑面积(㎡)', field: 'groundArea', required: true},
      ],
      [
        {label: '地下建筑面积(㎡)', field: 'undergroundArea', required: true},
        {label: '住宅建筑面积(㎡)', field: 'roomArea', required: true},
        {label: '住宅实用面积(㎡)', field: 'roomUtilityArea', required: true},
      ],
      [
        {label: '商业建筑面积(㎡)', field: 'shopArea', required: true},
        {label: '商业实用面积(㎡)', field: 'shopUtilityArea', required: true},
        {label: '管理用房面积(㎡)', field: 'manageRoomArea', required: true},
      ],
      [
        {label: '设备用房面积(㎡)', field: 'deviceRoomArea', required: true},
        {label: '绿化面积(㎡)', field: 'greenArea', required: true},
        {label: '物业费收费面积(㎡)', field: 'propertyFeeArea', required: true},
      ],
      [
        {label: '道路面积(㎡)', field: 'roadArea', required: true},
        {label: '容积率', field: 'plotRatio', required: true},
        {label: '竣工时间', field: 'completeDate', required: true},
      ],
      [
        {label: '竣备时间', field: 'prepareDate', required: true},
        {label: '', field: '', required: false}, // 空占位
        {label: '', field: '', required: false}, // 空占位
      ],
    ],
  },
  {
    title: '项目配套',
    fields: [
      [
        {label: '总户数', field: 'totalHouseholds', required: true},
        {label: '地上车位数量', field: 'groundParkingSpace', required: true},
        {label: '地下车位数量', field: 'undergroundParkingSpace', required: true},
      ],
      [
        {label: '机械车位数量', field: 'machineryParkingSpace', required: true},
        {label: '车位配比', field: 'parkingSpaceRatio', required: true},
        {label: '人行出入口数量', field: 'staffEntrance', required: true},
      ],
      [
        {label: '车辆出入口数量', field: 'carEntrance', required: true},
        {label: '客梯数量', field: 'customElevator', required: true},
        {label: '货梯数量', field: 'goodsElevator', required: true},
      ],
      [
        {label: '消防梯数量', field: 'firefightElevator', required: true},
        {label: '', field: '', required: false}, // 空占位
        {label: '', field: '', required: false}, // 空占位
      ],
      [
        {label: '物业公司名称', field: 'propertyCompany', required: true},
        {label: '项目负责人', field: 'projectManager', required: true},
        {
          label: '质保期',
          field: ['warrantyContractBegin', 'warrantyContractEnd'],
          required: true,
          formatter: (vals: (string | number | undefined)[]) =>
            `${vals[0] || '-'} / ${vals[1] || '-'}`,
        },
      ],
      [
        {label: '入伙时间', field: 'checkInDate', required: true},
        {label: '物业合同生效日期', field: 'contractBegin', required: true},
        {label: '物业合同终止日期', field: 'contractEnd', required: true},
      ],
      [
        {label: '物业费收费模式', field: 'propertyFeeModel', required: true},
        {label: '住宅物业收费标准', field: 'roomStandard', required: true},
        {label: '底商物业收费标准', field: 'shopStandard', required: true},
      ],
      [
        {label: '独立商业物业收费标准', field: 'independentShopStandard', required: true},
        {label: '地上车位收费标准', field: 'groundParkingStandard', required: true},
        {label: '地下车位收费标准', field: 'undergroundParkingStandard', required: true},
      ],
    ],
  },
]

// 格式化值的方法（移除any，类型安全）
const getFieldValue = (fieldConfig: FormField): string => {
  if (!fieldConfig.field || !fieldConfig.label) return ''

  if (Array.isArray(fieldConfig.field)) {
    const values = fieldConfig.field.map(f => formData[f as keyof AssetProjectVO])
    return fieldConfig.formatter ? fieldConfig.formatter(values) : values.join(' / ')
  }

  const value = formData[fieldConfig.field as keyof AssetProjectVO]
  return value?.toString() || ''
}
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="基本信息">
      <el-form :model="formData" ref="formRef" label-width="80px" label-position="top">
        <!-- 循环渲染每个分组 -->
        <section-group
          v-for="(group, groupIdx) in formConfig"
          :key="groupIdx"
          :title="group.title"
          inline
        >
          <!-- 循环渲染每行 -->
          <el-row :gutter="24" v-for="(row, rowIdx) in group.fields" :key="rowIdx">
            <!-- 循环渲染每列 -->
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
