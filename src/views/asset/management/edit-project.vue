<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {CascaderProps, FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {amsAssetProjectGet, amsAssetProjectUpdate} from '@/service/api/amsAsset'
import {iamCommonAreaList, iamCommonDicListTree} from '@/service/api/iamCommon'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()
const route = useRoute()

// 所属省市区
const areaList = useRequest(iamCommonAreaList, {
  throttleInterval: 500,
})
const provinceOptions = reactive<PairModel[]>([])
const cityOptions = reactive<PairModel[]>([])
const districtOptions = reactive<PairModel[]>([])
// 字典 [筹集方式 产权单位 产权性质 经营模式 筹集主体 项目类型]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const collectWayOptions = reactive<SysDicVO[]>([])
const companyOptions = reactive<SysDicVO[]>([])
const ownershipPropertyOptions = reactive<SysDicVO[]>([])
const businessModelOptions = reactive<SysDicVO[]>([])
const projectTypeOption = reactive<SysDicVO[]>([])
// 项目详情
const projectGet = useRequest(amsAssetProjectGet, {
  throttleInterval: 500,
})
// 编辑项目
const projectUpdate = useRequest(amsAssetProjectUpdate, {
  throttleInterval: 500,
})

const formRef = ref<FormInstance>()

const formData = reactive(
  {} as AssetProjectUpsertDTO & {warrantyContract: string[]; provinceCityDistrictCode: string[]}
)

const formRules = reactive<
  FormRules<
    AssetProjectUpsertDTO & {warrantyContract: string[]; provinceCityDistrictCode: string[]}
  >
>({
  projectName: [{required: true, message: '请填写项目名称', trigger: 'blur'}],
  provinceCityDistrictCode: [{required: true, message: '请选择省市区', trigger: 'change'}],
  address: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
  landNumber: [{required: true, message: '请填写宗地号', trigger: 'blur'}],
  ownershipPropertyCode: [{required: true, message: '请选择产权性质', trigger: 'change'}],
  ownershipUnitCode: [{required: true, message: '请选择产权单位', trigger: 'change'}],
  collectWayCode: [{required: true, message: '请选择筹集方式', trigger: 'change'}],
  collectSubjectCode: [{required: true, message: '请选择筹集主体', trigger: 'change'}],
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

  propertyCompany: [{required: true, message: '请填写物业公司名称', trigger: 'blur'}],
  projectManager: [{required: true, message: '请填写项目负责人', trigger: 'blur'}],
  warrantyContract: [{required: true, message: '请选择质保期', trigger: 'change'}],
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
  getDetail()
})

const getOptions = async (): Promise<void> => {
  const {data: cityOption} = await areaList.runAsync({pid: ''})
  provinceOptions.push(...cityOption)
  const {data: collectWay} = await dicListTree.runAsync({dicType: 1021})
  collectWayOptions.push(...Object.values(collectWay))
  const {data: companyList} = await dicListTree.runAsync({dicType: 1001})
  companyOptions.push(...Object.values(companyList))
  const {data: ownershipProperty} = await dicListTree.runAsync({dicType: 1022})
  ownershipPropertyOptions.push(...Object.values(ownershipProperty))
  const {data: businessModel} = await dicListTree.runAsync({dicType: 1020})
  businessModelOptions.push(...Object.values(businessModel))
  const {data: projectType} = await dicListTree.runAsync({dicType: 1003})
  projectTypeOption.push(...Object.values(projectType))
}

const getDetail = async (): Promise<void> => {
  const {data} = await projectGet.runAsync({projectId: route.params.id})
  const cloneData = JSON.parse(JSON.stringify(data))
  cloneData.provinceCityDistrictCode = [data.provinceCode, data.cityCode, data.districtCode]
  cloneData.warrantyContract = [data.warrantyContractBegin, data.warrantyContractEnd]
  Object.assign(formData, cloneData)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const cloneForm = JSON.parse(JSON.stringify(formData))
      cloneForm.provinceCode = cloneForm?.provinceCityDistrictCode?.[0]
      cloneForm.cityCode = cloneForm?.provinceCityDistrictCode?.[1]
      cloneForm.districtCode = cloneForm?.provinceCityDistrictCode?.[2]
      cloneForm.provinceName = findValueByCustomId(
        cloneForm.provinceCode,
        'k',
        'v',
        provinceOptions
      )
      cloneForm.cityName = findValueByCustomId(cloneForm.cityCode, 'k', 'v', cityOptions)
      cloneForm.districtName = findValueByCustomId(
        cloneForm.districtCode,
        'k',
        'v',
        districtOptions
      )

      if (Array.isArray(cloneForm.ownershipUnitCode)) {
        cloneForm.ownershipUnitCode =
          cloneForm.ownershipUnitCode[cloneForm.ownershipUnitCode.length - 1]
        cloneForm.ownershipUnitName = findValueByCustomId(
          cloneForm.ownershipUnitCode,
          'dicId',
          'dicName',
          companyOptions
        )
      }
      if (Array.isArray(cloneForm.ownershipUnitCode)) {
        cloneForm.collectSubjectCode =
          cloneForm.collectSubjectCode[cloneForm.collectSubjectCode.length - 1]
        cloneForm.collectSubjectName = findValueByCustomId(
          cloneForm.collectSubjectCode,
          'dicId',
          'dicName',
          companyOptions
        )
      }
      cloneForm.ownershipPropertyName = findValueByCustomId(
        cloneForm.ownershipPropertyCode,
        'dicId',
        'dicName',
        ownershipPropertyOptions
      )
      cloneForm.collectWayName = findValueByCustomId(
        cloneForm.collectWayCode,
        'dicId',
        'dicName',
        collectWayOptions
      )
      cloneForm.businessModelName = findValueByCustomId(
        cloneForm.businessModelCode,
        'dicId',
        'dicName',
        businessModelOptions
      )
      cloneForm.projectTypeName = findValueByCustomId(
        cloneForm.projectTypeCode,
        'dicId',
        'dicName',
        projectTypeOption
      )
      cloneForm.warrantyContractBegin = cloneForm.warrantyContract[0]
      cloneForm.warrantyContractEnd = cloneForm.warrantyContract[1]

      await projectUpdate.runAsync({...cloneForm})
      router.push('/asset/management/project')

      ElMessage.success('表单提交成功！')
    } else {
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
          nodes = provinceOptions
          break
        case 1:
          const {data: city} = await areaList.runAsync({pid: value})
          cityOptions.push(...city)
          nodes = city
          break
        case 2:
          const {data: district} = await areaList.runAsync({pid: value})
          districtOptions.push(...district)
          nodes = district
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
        <section-group title="楼层信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="formData.projectName" placeholder="请填写项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编码">
                <el-input v-model="formData.projectId" placeholder="系统自动生成" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目简称" prop="projectShortName">
                <el-input v-model="formData.projectShortName" placeholder="请填写项目简称" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="省市区" prop="provinceCityDistrictCode">
                <el-cascader
                  v-model="formData.provinceCityDistrictCode"
                  placeholder="请选择省/市/区"
                  :props="props"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="formData.address" placeholder="请填写详细地址" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经纬度">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-input v-model="formData.lng" placeholder="经度" />
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="formData.lat" placeholder="纬度" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="宗地号" prop="landNumber">
                <el-input v-model="formData.landNumber" placeholder="请填写宗地号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权性质" prop="ownershipPropertyCode">
                <el-select v-model="formData.ownershipPropertyCode" placeholder="请选择产权性质">
                  <el-option
                    v-for="item in ownershipPropertyOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="ownershipUnitCode">
                <el-cascader
                  v-model="formData.ownershipUnitCode"
                  placeholder="请选择产权单位"
                  :options="companyOptions"
                  :props="{
                    checkStrictly: true,
                    value: 'dicId',
                    label: 'dicName',
                  }"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="筹集方式" prop="collectWayCode">
                <el-select v-model="formData.collectWayCode" placeholder="请选择筹集方式">
                  <el-option
                    v-for="item in collectWayOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="筹集主体" prop="collectSubjectCode">
                <el-cascader
                  v-model="formData.collectSubjectCode"
                  placeholder="请选择筹集主体"
                  :options="companyOptions"
                  :props="{
                    checkStrictly: true,
                    value: 'dicId',
                    label: 'dicName',
                  }"
                  clearable
                />
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

            <el-col :span="8">
              <el-form-item label="经营模式" prop="businessModelCode">
                <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                  <el-option
                    v-for="item in businessModelOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目类型" prop="projectTypeCode">
                <el-select v-model="formData.projectTypeCode" placeholder="请选择项目类型">
                  <el-option
                    v-for="item in projectTypeOption"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目电话" prop="projectPhone">
                <el-input v-model="formData.projectPhone" placeholder="请填写项目联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="建筑信息" inline>
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
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="竣备时间" prop="prepareDate">
                <el-date-picker
                  v-model="formData.prepareDate"
                  type="date"
                  placeholder="请选择竣备时间"
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="项目配套" inline>
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

          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="物业公司名称" prop="propertyCompany">
                <el-input
                  v-model="formData.propertyCompany"
                  placeholder="请填写物业公司名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目负责人" prop="projectManager">
                <el-input
                  v-model="formData.projectManager"
                  placeholder="请填写项目负责人"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质保期" prop="warrantyContract">
                <el-date-picker
                  v-model="formData.warrantyContract"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入伙时间" prop="checkInDate">
                <el-date-picker
                  v-model="formData.checkInDate"
                  type="date"
                  placeholder="请选择入伙时间"
                  value-format="YYYY-MM-DD"
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
                  value-format="YYYY-MM-DD"
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
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物业费收费模式" prop="propertyFeeModel">
                <el-select
                  v-model="formData.propertyFeeModel"
                  placeholder="请选择收费模式"
                  clearable
                >
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
        </section-group>

        <!-- 表单操作按钮：居中、间距 -->
        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
