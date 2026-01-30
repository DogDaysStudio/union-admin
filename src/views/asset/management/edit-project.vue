<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {CascaderProps, FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {iamCommon} from '@/service/api/iamCommon'
// import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

// 所属省市区
const areaList = useRequest(iamCommon.iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 新增项目
// const addAmsAssetProject = useRequest(amsAsset.amsAssetProjectInsert, {
//   throttleInterval: 500,
// })

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
} as AssetProjectUpsertDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules<AssetProjectUpsertDTO>>({
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

onMounted(() => {
  getOptions()
})

const getOptions = async (): Promise<void> => {
  const {data: cityOption} = await areaList.runAsync({pid: ''})
  cityOptions.push(...cityOption)
}

const dialogVisible = ref(false)
const openMap = (): void => {
  dialogVisible.value = true
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      // 验证通过：处理表单提交逻辑（如接口请求）
      console.log('表单提交数据：', {...formData})
      ElMessage.success('表单提交成功！')
    } else {
      // 验证失败：提示错误
      ElMessage.error('表单填写有误，请检查必填项和格式！')
    }
  })
}

// 重置表单：重置数据+清除验证状态
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}

const props: CascaderProps = {
  checkStrictly: true,
  value: 'k',
  label: 'v',
  lazy: true,
  lazyLoad(node, resolve) {
    const {level, value} = node
    setTimeout(async () => {
      let nodes: {k: string; v: string; leaf?: boolean}[] = []
      switch (level) {
        case 0:
          nodes = cityOptions
          break
        case 1:
        case 2:
          const {data} = await areaList.runAsync({pid: value})
          nodes = data
          break
      }
      nodes.forEach(item => (level >= 2 ? (item.leaf = true) : ''))
      resolve(nodes)
    }, 800)
  },
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑项目
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <!-- 外层容器：水平居中 -->
    <div class="mx-auto">
      <!-- 表单核心：绑定数据/验证、标签宽度、间距 -->
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
      >
        <el-tag class="mb-4">基本信息</el-tag>
        <!-- 项目名称、编码、简称 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="请填写项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" prop="projectId">
              <el-input v-model="formData.projectId" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称" prop="projectShortName">
              <el-input v-model="formData.projectShortName" placeholder="请填写项目简称" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 省市区、详细地址、经纬度 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="省市区" prop="provinceCode">
              <el-cascader
                v-model="formData.provinceCode"
                placeholder="请选择省/市/区"
                :props="props"
                ,
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="formData.address" placeholder="请填写详细地址">
                <template #append>
                  <el-button :icon="Search" @click="openMap" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经纬度">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-input v-model="formData.lng" placeholder="经度" disabled />
                </el-col>
                <el-col :span="12">
                  <el-input v-model="formData.lat" placeholder="纬度" disabled />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 宗地号、产权性质、产权单位 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="宗地号" prop="landNumber">
              <el-input v-model="formData.landNumber" placeholder="请填写宗地号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权性质" prop="ownershipPropertyCode">
              <el-select v-model="formData.ownershipPropertyCode" placeholder="请选择产权性质">
                <el-option label="国有" value="state-owned" />
                <el-option label="集体" value="collective" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitCode">
              <el-select v-model="formData.ownershipUnitCode" placeholder="请选择产权单位">
                <el-option label="市国资委" value="city-sasac" />
                <el-option label="区国资委" value="district-sasac" />
                <el-option label="国有企业" value="state-enterprise" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 筹集方式、筹集主体、筹集日期 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="筹集方式" prop="collectWayCode">
              <el-select v-model="formData.collectWayCode" placeholder="请选择筹集方式">
                <el-option label="自建" value="self-built" />
                <el-option label="购置" value="purchase" />
                <el-option label="配建" value="allocated" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集主体" prop="collectSubject">
              <el-select v-model="formData.collectSubject" placeholder="请选择筹集主体">
                <el-option label="政府" value="government" />
                <el-option label="国有企业" value="state-enterprise" />
                <el-option label="民营企业" value="private-enterprise" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集日期" prop="collectDate">
              <el-date-picker
                v-model="formData.collectDate"
                type="date"
                placeholder="请选择筹集日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 经营模式、项目类型、项目电话 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="经营模式" prop="businessModelCode">
              <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                <el-option label="自营" value="self-operated" />
                <el-option label="托管" value="hosting" />
                <el-option label="合作运营" value="cooperation" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目类型" prop="projectTypeCode">
              <el-select v-model="formData.projectTypeCode" placeholder="请选择项目类型">
                <el-option label="保障性租赁住房" value="affordable-rental" />
                <el-option label="公租房" value="public-rental" />
                <el-option label="人才公寓" value="talent-apartment" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目电话" prop="projectPhone">
              <el-input v-model="formData.projectPhone" placeholder="请填写项目联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-tag class="mb-4">建筑信息</el-tag>
        <!-- 总占地面积、总建筑面积、地上建筑面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="总占地面积(㎡)" prop="totalLandArea">
              <el-input-number
                v-model="formData.totalLandArea"
                placeholder="请填写总占地面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总建筑面积(㎡)" prop="totalArea">
              <el-input-number
                v-model="formData.totalArea"
                placeholder="请填写总建筑面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上建筑面积(㎡)" prop="groundArea">
              <el-input-number
                v-model="formData.groundArea"
                placeholder="请填写地上建筑面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地下建筑面积、住宅建筑面积、住宅实用面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="地下建筑面积(㎡)" prop="undergroundArea">
              <el-input-number
                v-model="formData.undergroundArea"
                placeholder="请填写地下建筑面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅建筑面积(㎡)" prop="roomArea">
              <el-input-number
                v-model="formData.roomArea"
                placeholder="请填写住宅建筑面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅实用面积(㎡)" prop="roomUtilityArea">
              <el-input-number
                v-model="formData.roomUtilityArea"
                placeholder="请填写住宅实用面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 商业建筑面积、商业实用面积、管理用房面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="商业建筑面积(㎡)" prop="shopArea">
              <el-input-number
                v-model="formData.shopArea"
                placeholder="请填写商业建筑面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商业实用面积(㎡)" prop="shopUtilityArea">
              <el-input-number
                v-model="formData.shopUtilityArea"
                placeholder="请填写商业实用面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理用房面积(㎡)" prop="manageRoomArea">
              <el-input-number
                v-model="formData.manageRoomArea"
                placeholder="请填写管理用房面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 设备用房面积、绿化面积、物业费收费面积 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="设备用房面积(㎡)" prop="deviceRoomArea">
              <el-input-number
                v-model="formData.deviceRoomArea"
                placeholder="请填写设备用房面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绿化面积(㎡)" prop="greenArea">
              <el-input-number
                v-model="formData.greenArea"
                placeholder="请填写绿化面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业费收费面积(㎡)" prop="propertyFeeArea">
              <el-input-number
                v-model="formData.propertyFeeArea"
                placeholder="请填写物业费收费面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 道路面积、容积率、竣工时间 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="道路面积(㎡)" prop="roadArea">
              <el-input-number
                v-model="formData.roadArea"
                placeholder="请填写道路面积"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容积率" prop="plotRatio">
              <el-input v-model="formData.plotRatio" placeholder="请填写容积率" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="竣工时间" prop="completeDate">
              <el-date-picker
                v-model="formData.completeDate"
                type="date"
                placeholder="请选择竣工时间"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 竣备时间行 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="竣备时间" prop="prepareDate">
              <el-date-picker
                v-model="formData.prepareDate"
                type="date"
                placeholder="请选择竣备时间"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-tag class="mb-4">项目配套</el-tag>
        <!-- 第1行：总户数、地上车位数量、地下车位数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="总户数" prop="totalHouseholds">
              <el-input-number
                v-model="formData.totalHouseholds"
                placeholder="请填写总户数"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上车位数量" prop="groundParkingSpace">
              <el-input-number
                v-model="formData.groundParkingSpace"
                placeholder="请填写地上车位数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地下车位数量" prop="undergroundParkingSpace">
              <el-input-number
                v-model="formData.undergroundParkingSpace"
                placeholder="请填写地下车位数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第2行：机械车位数量、车位配比、人行出入口数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="机械车位数量" prop="machineryParkingSpace">
              <el-input-number
                v-model="formData.machineryParkingSpace"
                placeholder="请填写机械车位数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车位配比" prop="parkingSpaceRatio">
              <el-input
                v-model="formData.parkingSpaceRatio"
                placeholder="请填写车位配比"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人行出入口数量" prop="staffEntrance">
              <el-input-number
                v-model="formData.staffEntrance"
                placeholder="请填写人行出入口数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第3行：车辆出入口数量、客梯数量、货梯数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="车辆出入口数量" prop="carEntrance">
              <el-input-number
                v-model="formData.carEntrance"
                placeholder="请填写车辆出入口数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客梯数量" prop="customElevator">
              <el-input-number
                v-model="formData.customElevator"
                placeholder="请填写客梯数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货梯数量" prop="goodsElevator">
              <el-input-number
                v-model="formData.goodsElevator"
                placeholder="请填写货梯数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第4行：消防梯数量 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="消防梯数量" prop="firefightElevator">
              <el-input-number
                v-model="formData.firefightElevator"
                placeholder="请填写消防梯数量"
                :min="0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第5行：入伙时间、物业合同生效日期、物业合同终止日期（日期类统一布局） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="入伙时间" prop="checkInDate">
              <el-date-picker
                v-model="formData.checkInDate"
                type="date"
                placeholder="请选择入伙时间"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业合同生效日期" prop="contractBegin">
              <el-date-picker
                v-model="formData.contractBegin"
                type="date"
                placeholder="请选择生效日期"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物业合同终止日期" prop="contractEnd">
              <el-date-picker
                v-model="formData.contractEnd"
                type="date"
                placeholder="请选择终止日期"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第6行：物业费收费模式、住宅物业收费标准、底商物业收费标准（模式+基础收费） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="物业费收费模式" prop="propertyFeeModel">
              <el-select v-model="formData.propertyFeeModel" placeholder="请选择收费模式" clearable>
                <el-option label="包干制" value="baogan" />
                <el-option label="酬金制" value="choujin" />
                <el-option label="按面积收费" value="byArea" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住宅物业收费标准" prop="roomStandard">
              <el-input
                v-model="formData.roomStandard"
                placeholder="请填写住宅收费标准"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="底商物业收费标准" prop="shopStandard">
              <el-input
                v-model="formData.shopStandard"
                placeholder="请填写底商收费标准"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第7行：独立商业物业收费标准、地上车位收费标准、地下车位收费标准（剩余收费项） -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="独立商业物业收费标准" prop="independentShopStandard">
              <el-input
                v-model="formData.independentShopStandard"
                placeholder="请填写独立商业收费标准"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地上车位收费标准" prop="groundParkingStandard">
              <el-input
                v-model="formData.groundParkingStandard"
                placeholder="请填写地上车位收费标准"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地下车位收费标准" prop="undergroundParkingStandard">
              <el-input
                v-model="formData.undergroundParkingStandard"
                placeholder="请填写地下车位收费标准"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单操作按钮：居中、间距 -->
        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>

  <el-dialog v-model="dialogVisible" title="详细地址" width="800">
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
