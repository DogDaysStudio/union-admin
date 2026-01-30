<script lang="ts" setup>
import {ref, reactive} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({
  projectName: '', // 项目名称
  projectId: '', // 项目编码
  projectShortName: '', // 项目简称
  provinceCode: '', // 所在区域-省 code
  provinceName: '', // 所在区域-省名称
  cityCode: '', // 所在区域-城市 code
  cityName: '', // 所在区域-城市名称
  districtCode: '', // 地址-区域 code
  districtName: '', // 地址-区域名称
  address: '', // 地址-详细地址
  lng: null, // 经度
  lat: null, // 纬度
  landNumber: '', // 宗地号
  ownershipPropertyCode: '', // 产权性质编码
  ownershipPropertyName: '', // 产权性质名称
  ownershipUnitCode: '', // 产权单位编码
  ownershipUnitName: '', // 产权单位名称
  collectWayCode: '', // 筹集方式编码
  collectWayName: '', // 筹集方式名称
  collectSubject: '', // 筹集主体
  collectDate: '', // 筹集日期
  businessModelCode: '', // 经营模式编码
  businessModelName: '', // 经营模式名称
  projectTypeCode: '', // 项目类型编码
  projectTypeName: '', // 项目类型名称
  projectPhone: '', // 项目电话

  buildingCount: null, // 楼栋数
  floorCount: null, // 楼层数
  roomCount: null, // 房间（住宅）数
  enclosureCount: null, // 围合数
  shopCount: null, // 房间（商业）数
  parkingCount: null, // 停车场数
  parkingSpaceCount: null, // 停车位数
  resourceCount: null, // 空间点位数

  totalArea: null, // 总建筑面积
  groundArea: null, // 地上建筑面积
  undergroundArea: null, // 地下建筑面积
  roomArea: null, // 住宅建筑面积
  roomUtilityArea: null, // 住宅实用面积
  shopArea: null, // 商业建筑面积
  shopUtilityArea: null, // 商业实用面积
  manageRoomArea: null, // 管理用房面积
  deviceRoomArea: null, // 设备用房面积
  greenArea: null, // 绿化面积
  propertyFeeArea: null, // 物业费收费面积
  roadArea: null, // 道路面积
  plotRatio: '', // 容积率
  completeDate: '', // 竣工时间
  prepareDate: '', // 竣备时间

  totalHouseholds: null, // 总户数
  groundParkingSpace: null, // 地上车位数量
  undergroundParkingSpace: null, // 地下车位数量
  machineryParkingSpace: null, // 机械车位数量
  parkingSpaceRatio: '', // 车位配比
  staffEntrance: null, // 人行出入口数量
  carEntrance: null, // 车辆出入口数量
  customElevator: null, // 客梯数量
  goodsElevator: null, // 货梯数量
  firefightElevator: null, // 消防梯数量
  checkInDate: '', // 入伙时间
  contractBegin: '', // 物业合同生效日期
  contractEnd: '', // 物业合同终止日期
  propertyFeeModel: '', // 物业费收费模式
  roomStandard: '', // 住宅物业收费标准
  shopStandard: '', // 底商物业收费标准
  independentShopStandard: '', // 独立商业物业收费标准
  groundParkingStandard: '', // 地上车位收费标准
  undergroundParkingStandard: '', // 地下车位收费标准
} as AssetProjectVO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules<AssetProjectVO>>({
  projectName: [{required: true, message: '请填写项目名称', trigger: 'blur'}],
  projectId: [{required: true, message: '请填写项目编码', trigger: 'blur'}],
  provinceCode: [{required: true, message: '请选择省市区', trigger: 'change'}],
  address: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
  landNumber: [{required: true, message: '请填写宗地号', trigger: 'blur'}],
  ownershipPropertyCode: [{required: true, message: '请选择产权性质', trigger: 'change'}],
  ownershipUnitCode: [{required: true, message: '请选择产权单位', trigger: 'change'}],
  collectWayCode: [{required: true, message: '请选择筹集方式', trigger: 'change'}],
  collectSubject: [{required: true, message: '请选择筹集主体', trigger: 'change'}],
  collectDate: [{required: true, message: '请选择筹集日期', trigger: 'change'}],
  businessModelCode: [{required: true, message: '请选择经营模式', trigger: 'change'}],
  projectTypeCode: [{required: true, message: '请选择项目类型', trigger: 'change'}],
  projectPhone: [
    {required: true, message: '请填写项目联系电话', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请填写正确的11位手机号', trigger: 'blur'},
  ],
  totalLandArea: [{required: true, message: '请填写总占地面积', trigger: 'blur'}],
  totalArea: [{required: true, message: '请填写总建筑面积', trigger: 'blur'}],
  groundArea: [{required: true, message: '请填写地上建筑面积', trigger: 'blur'}],
  undergroundArea: [{required: true, message: '请填写地下建筑面积', trigger: 'blur'}],
  roomArea: [{required: true, message: '请填写住宅建筑面积', trigger: 'blur'}],
  roomUtilityArea: [{required: true, message: '请填写住宅实用面积', trigger: 'blur'}],
  shopArea: [{required: true, message: '请填写商业建筑面积', trigger: 'blur'}],
  shopUtilityArea: [{required: true, message: '请填写商业实用面积', trigger: 'blur'}],
  manageRoomArea: [{required: true, message: '请填写管理用房面积', trigger: 'blur'}],
  deviceRoomArea: [{required: true, message: '请填写设备用房面积', trigger: 'blur'}],
  greenArea: [{required: true, message: '请填写绿化面积', trigger: 'blur'}],
  propertyFeeArea: [{required: true, message: '请填写物业费收费面积', trigger: 'blur'}],
  roadArea: [{required: true, message: '请填写道路面积', trigger: 'blur'}],
  plotRatio: [{required: true, message: '请填写容积率', trigger: 'blur'}],
  completeDate: [{required: true, message: '请选择竣工时间', trigger: 'change'}],
  prepareDate: [{required: true, message: '请选择竣备时间', trigger: 'change'}],
  totalHouseholds: [{required: true, message: '请填写总户数', trigger: 'blur'}],
  groundParkingSpace: [{required: true, message: '请填写地上车位数量', trigger: 'blur'}],
  undergroundParkingSpace: [{required: true, message: '请填写地下车位数量', trigger: 'blur'}],
  machineryParkingSpace: [{required: true, message: '请填写机械车位数量', trigger: 'blur'}],
  parkingSpaceRatio: [{required: true, message: '请填写车位配比', trigger: 'blur'}],
  staffEntrance: [{required: true, message: '请填写人行出入口数量', trigger: 'blur'}],
  carEntrance: [{required: true, message: '请填写车辆出入口数量', trigger: 'blur'}],
  customElevator: [{required: true, message: '请填写客梯数量', trigger: 'blur'}],
  goodsElevator: [{required: true, message: '请填写货梯数量', trigger: 'blur'}],
  firefightElevator: [{required: true, message: '请填写消防梯数量', trigger: 'blur'}],
  checkInDate: [{required: true, message: '请选择入伙时间', trigger: 'change'}],
  contractBegin: [{required: true, message: '请选择物业合同生效日期', trigger: 'change'}],
  contractEnd: [{required: true, message: '请选择物业合同终止日期', trigger: 'change'}],
  propertyFeeModel: [{required: true, message: '请选择物业费收费模式', trigger: 'change'}],
  roomStandard: [{required: true, message: '请填写住宅物业收费标准', trigger: 'blur'}],
  shopStandard: [{required: true, message: '请填写底商物业收费标准', trigger: 'blur'}],
  independentShopStandard: [
    {required: true, message: '请填写独立商业物业收费标准', trigger: 'blur'},
  ],
  groundParkingStandard: [{required: true, message: '请填写地上车位收费标准', trigger: 'blur'}],
  undergroundParkingStandard: [
    {required: true, message: '请填写地下车位收费标准', trigger: 'blur'},
  ],
})
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="基本信息">
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
      >
        <!-- 项目名称、编码、简称 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <span class="ml-4">{{ formData?.projectName || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" prop="projectId">
              <span class="ml-4">{{ formData?.projectId || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称" prop="projectShortName">
              <span class="ml-4">{{ formData?.projectShortName || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 省市区、详细地址、经纬度 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="省市区" prop="provinceCode">
              <span class="ml-4">{{ formData?.provinceCode || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="address">
              <span class="ml-4">{{ formData?.address || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经纬度">
              <el-row :gutter="12">
                <el-col :span="12">
                  <span class="ml-4">{{ formData?.lng || '-' }}</span>
                </el-col>
                <el-col :span="12">
                  <span>{{ formData?.lat || '-' }}</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 宗地号、产权性质、产权单位 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="宗地号" prop="landNumber">
              <span class="ml-4">{{ formData?.landNumber || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权性质" prop="ownershipPropertyCode">
              <span class="ml-4">{{ formData?.ownershipPropertyCode || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitCode">
              <span class="ml-4">{{ formData?.ownershipUnitCode || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 筹集方式、筹集主体、筹集日期 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="筹集方式" prop="collectWayCode">
              <span class="ml-4">{{ formData?.collectWayCode || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集主体" prop="collectSubject">
              <span class="ml-4">{{ formData?.collectSubject || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集日期" prop="collectDate">
              <span class="ml-4">{{ formData?.collectDate || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 经营模式、项目类型、项目电话 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="经营模式" prop="businessModelCode">
              <span class="ml-4">{{ formData?.businessModelCode || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目类型" prop="projectTypeCode">
              <span class="ml-4">{{ formData?.projectTypeCode || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目电话" prop="projectPhone">
              <span class="ml-4">{{ formData?.projectPhone || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-tag class="mb-6">项目数据</el-tag>

        <!-- 楼栋数、楼层数、房间（住宅）数 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="楼栋数">
              <span class="ml-4">{{ formData?.buildingCount || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层数">
              <span class="ml-4">{{ formData?.floorCount || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房间（住宅）数">
              <span class="ml-4">{{ formData?.roomCount || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 围合数、房间（商业）数、停车场数 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="围合数">
              <span class="ml-4">{{ formData?.enclosureCount || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房间（商业）数">
              <span class="ml-4">{{ formData?.shopCount || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停车场数">
              <span class="ml-4">{{ formData?.parkingCount || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 停车位数、空间点位数 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="停车位数">
              <span class="ml-4">{{ formData?.parkingSpaceCount || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空间点位数">
              <span class="ml-4">{{ formData?.resourceCount || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-tag class="mb-6">建筑信息</el-tag>
        <!-- 总占地面积、总建筑面积、地上建筑面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="总占地面积(㎡)" prop="totalLandArea">
              <span class="ml-4">{{ formData?.totalLandArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总建筑面积(㎡)" prop="totalArea">
              <span class="ml-4">{{ formData?.totalArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上建筑面积(㎡)" prop="groundArea">
              <span class="ml-4">{{ formData?.groundArea || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地下建筑面积、住宅建筑面积、住宅实用面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="地下建筑面积(㎡)" prop="undergroundArea">
              <span class="ml-4">{{ formData?.undergroundArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅建筑面积(㎡)" prop="roomArea">
              <span class="ml-4">{{ formData?.roomArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅实用面积(㎡)" prop="roomUtilityArea">
              <span class="ml-4">{{ formData?.roomUtilityArea || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 商业建筑面积、商业实用面积、管理用房面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="商业建筑面积(㎡)" prop="shopArea">
              <span class="ml-4">{{ formData?.shopArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商业实用面积(㎡)" prop="shopUtilityArea">
              <span class="ml-4">{{ formData?.shopUtilityArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理用房面积(㎡)" prop="manageRoomArea">
              <span class="ml-4">{{ formData?.manageRoomArea || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 设备用房面积、绿化面积、物业费收费面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="设备用房面积(㎡)" prop="deviceRoomArea">
              <span class="ml-4">{{ formData?.deviceRoomArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绿化面积(㎡)" prop="greenArea">
              <span class="ml-4">{{ formData?.greenArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业费收费面积(㎡)" prop="propertyFeeArea">
              <span class="ml-4">{{ formData?.propertyFeeArea || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 道路面积、容积率、竣工时间 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="道路面积(㎡)" prop="roadArea">
              <span class="ml-4">{{ formData?.roadArea || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容积率" prop="plotRatio">
              <span class="ml-4">{{ formData?.plotRatio || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="竣工时间" prop="completeDate">
              <span class="ml-4">{{ formData?.completeDate || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 竣备时间行 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="竣备时间" prop="prepareDate">
              <span class="ml-4">{{ formData?.prepareDate || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-tag class="mb-6">项目配套</el-tag>
        <!-- 第1行：总户数、地上车位数量、地下车位数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="总户数" prop="totalHouseholds">
              <span class="ml-4">{{ formData?.totalHouseholds || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上车位数量" prop="groundParkingSpace">
              <span class="ml-4">{{ formData?.groundParkingSpace || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地下车位数量" prop="undergroundParkingSpace">
              <span class="ml-4">{{ formData?.undergroundParkingSpace || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第2行：机械车位数量、车位配比、人行出入口数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="机械车位数量" prop="machineryParkingSpace">
              <span class="ml-4">{{ formData?.machineryParkingSpace || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车位配比" prop="parkingSpaceRatio">
              <span class="ml-4">{{ formData?.parkingSpaceRatio || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人行出入口数量" prop="staffEntrance">
              <span class="ml-4">{{ formData?.staffEntrance || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第3行：车辆出入口数量、客梯数量、货梯数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="车辆出入口数量" prop="carEntrance">
              <span class="ml-4">{{ formData?.carEntrance || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客梯数量" prop="customElevator">
              <span class="ml-4">{{ formData?.customElevator || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货梯数量" prop="goodsElevator">
              <span class="ml-4">{{ formData?.goodsElevator || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第4行：消防梯数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="消防梯数量" prop="firefightElevator">
              <span class="ml-4">{{ formData?.firefightElevator || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第5行：入伙时间、物业合同生效日期、物业合同终止日期（日期类统一布局） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="入伙时间" prop="checkInDate">
              <span class="ml-4">{{ formData?.checkInDate || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业合同生效日期" prop="contractBegin">
              <span class="ml-4">{{ formData?.contractBegin || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业合同终止日期" prop="contractEnd">
              <span class="ml-4">{{ formData?.contractEnd || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第6行：物业费收费模式、住宅物业收费标准、底商物业收费标准（模式+基础收费） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="物业费收费模式" prop="propertyFeeModel">
              <span class="ml-4">{{ formData?.propertyFeeModel || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅物业收费标准" prop="roomStandard">
              <span class="ml-4">{{ formData?.roomStandard || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="底商物业收费标准" prop="shopStandard">
              <span class="ml-4">{{ formData?.shopStandard || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第7行：独立商业物业收费标准、地上车位收费标准、地下车位收费标准（剩余收费项） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="独立商业物业收费标准" prop="independentShopStandard">
              <span class="ml-4">{{ formData?.independentShopStandard || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上车位收费标准" prop="groundParkingStandard">
              <span class="ml-4">{{ formData?.groundParkingStandard || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地下车位收费标准" prop="undergroundParkingStandard">
              <span class="ml-4">{{ formData?.undergroundParkingStandard || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="项目接收">Config</el-tab-pane>
    <el-tab-pane label="察验移交">Role</el-tab-pane>
  </el-tabs>
</template>
