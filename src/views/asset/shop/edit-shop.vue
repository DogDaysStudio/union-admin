<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetBuildingSelectBuildingEnclosure,
  amsAssetShopGet,
  amsAssetShopUpdate,
  amsAssetProjectList,
  amsAssetFloorList,
} from '@/service/api/amsAsset'

const route = useRoute()
const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 围合列表
const {runAsync: assetList} = useRequest(amsAssetBuildingSelectBuildingEnclosure)
const assetOptions = reactive<{id: string; name: string; assetType: string}[]>([])
// 楼层列表
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 字典 [ 产权单位 产权性质 房间类型 经营模式 ]
const companyOptions = useDicListTree({dicType: 1001})
const ownershipPropertyOptions = useDicListTree({dicType: 1022})
const roomTypeOptions = useDicListTree({dicType: 1005})
const businessModelOptions = useDicListTree({dicType: 1020})
// 编辑楼层
const {runAsync: shopUpdate, loading: updateLoading} = useRequest(amsAssetShopUpdate)
// 商铺详情
const {runAsync: shopGet} = useRequest(amsAssetShopGet)
// 默认下拉
const defaultoptions = [
  {
    value: 0,
    label: '否',
  },
  {
    value: 1,
    label: '是',
  },
]

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetShopUpsertDTO)

const formRules = reactive<FormRules>({
  shopName: {required: true, message: '请填写商铺名称', trigger: 'blur'},
  shopNumber: {required: true, message: '请填写商铺号', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  assetId: {required: true, message: '请选择所属楼栋/围合', trigger: 'change'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
  ownershipTypeCode: {required: true, message: '请选择产权类型', trigger: 'change'},
  ownershipYear: {required: true, message: '请填写产权年限', trigger: 'blur'},
  ownershipRatio: {required: true, message: '请填写产权比例', trigger: 'blur'},
  realEstateNumber: {required: true, message: '请填写不动产编号', trigger: 'blur'},
  shopTypeCode: {required: true, message: '请选择房间类型', trigger: 'change'},
  businessModelCode: {required: true, message: '请选择经营模式', trigger: 'change'},
  shopHeight: {required: true, message: '请填写商铺层高（m）', trigger: 'blur'},
  buildingArea: {required: true, message: '请填写建筑面积', trigger: 'blur'},
  usableArea: {required: true, message: '请填写实用面积', trigger: 'blur'},
  rentalArea: {required: true, message: '请填写计租面积', trigger: 'blur'},
  propertyFeeArea: {required: true, message: '请填写物业收费面积', trigger: 'blur'},
  decorationLevel: {required: true, message: '请填写装修情况', trigger: 'blur'},
  shopState: {required: true, message: '请选择商铺状态', trigger: 'change'},
  effectiveTime: {required: true, message: '请选择生效时间', trigger: 'change'},
  expireTime: {required: true, message: '请选择失效时间', trigger: 'change'},
  cateringCondition: {required: true, message: '请选择餐饮条件', trigger: 'change'},
  gasCondition: {required: true, message: '请选择燃气', trigger: 'change'},
  weakCurrentCondition: {required: true, message: '请选择弱电条件', trigger: 'change'},
  powerGridNo: {required: true, message: '请填写电表号', trigger: 'blur'},
  waterServiceNo: {required: true, message: '请填写水表号', trigger: 'blur'},
  gasNo: {required: true, message: '请填写燃气号', trigger: 'blur'},
  voltage: {required: true, message: '请填写电压', trigger: 'blur'},
})

onMounted(() => {
  getOptions()
  getDetail()
})

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

const getDetail = async () => {
  const {data: shopDetail} = await shopGet({shopId: route.params.id})
  Object.assign(formData, shopDetail)
  const {data: asset} = await assetList({
    projectId: shopDetail.projectId,
    pageable: false,
  } as AssetBuildingListDTO)
  assetOptions.push(...Object.values(asset))
  const {data: floor} = await floorList({
    pageable: false,
    assetType: shopDetail.assetType,
    assetId: shopDetail.assetId,
  } as AssetFloorListDTO)
  floorOptions.push(...floor)
}

const changeProjectId = async (projectId: string) => {
  assetOptions.length = 0
  formData.assetId = ''
  formData.floorId = ''
  floorOptions.length = 0
  const {data: asset} = await assetList({
    pageable: false,
    projectId,
  } as AssetBuildingListDTO)
  assetOptions.push(...Object.values(asset))
}

const changeAssetId = async (assetId: string) => {
  floorOptions.length = 0
  formData.floorId = ''
  formData.assetType = ''
  formData.assetType = assetOptions.find(item => formData.assetId == item.id).assetType
  const {data: floor} = await floorList({
    pageable: false,
    assetType: formData.assetType,
    assetId,
  } as AssetFloorListDTO)
  floorOptions.push(...floor)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      if (Array.isArray(paramsData.ownershipUnitCode)) {
        const targetCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1] ?? ''
        paramsData.ownershipUnitName =
          findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
        paramsData.ownershipUnitCode = targetCode
      } else {
        paramsData.ownershipUnitName =
          findValueByCustomId(paramsData.ownershipUnitCode, 'dicCode', 'dicName', companyOptions) ||
          ''
      }
      const {msg} = await shopUpdate({...paramsData})
      ElMessage.success(msg)
      router.push('/asset/management/shop')
    }
  })
}
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
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
        :validate-on-rule-change="false"
        :validate-on-init="false"
      >
        <section-group title="基本信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="商铺名称" prop="shopName" required>
                <el-input v-model="formData.shopName" placeholder="请填写商铺名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺编码" required>
                <el-input v-model="formData.shopId" placeholder="请填写商铺编码" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺号" prop="shopNumber" required>
                <el-input v-model="formData.shopNumber" placeholder="请填写商铺号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属项目" prop="projectId" required>
                <el-select
                  v-model="formData.projectId"
                  placeholder="请选择所属项目"
                  @change="changeProjectId"
                >
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属楼栋/围合" prop="assetId" required>
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属楼栋/围合"
                  @change="changeAssetId"
                >
                  <el-option
                    v-for="item in assetOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属楼层" prop="floorId" required>
                <el-select v-model="formData.floorId" placeholder="请选择所属楼层">
                  <el-option
                    v-for="item in floorOptions"
                    :key="item.floorId"
                    :label="item.floorName"
                    :value="item.floorId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="ownershipUnitCode" required>
                <el-cascader
                  v-model="formData.ownershipUnitCode"
                  placeholder="请选择产权单位"
                  :options="companyOptions"
                  :props="{
                    checkStrictly: true,
                    value: 'dicCode',
                    label: 'dicName',
                  }"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权类型" prop="ownershipTypeCode" required>
                <el-select v-model="formData.ownershipTypeCode" placeholder="请选择产权类型">
                  <el-option
                    v-for="item in ownershipPropertyOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权年限" prop="ownershipYear" required>
                <el-input-number v-model="formData.ownershipYear" placeholder="请填写产权年限" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权比例" prop="ownershipRatio" required>
                <el-input-number v-model="formData.ownershipRatio" placeholder="请填写产权比例" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不动产编号" prop="realEstateNumber" required>
                <el-input v-model="formData.realEstateNumber" placeholder="请填写不动产编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
        <section-group title="其他信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="房间类型" prop="shopTypeCode" required>
                <el-select v-model="formData.shopTypeCode" placeholder="请选择房间类型">
                  <el-option
                    v-for="item in roomTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经营模式" prop="businessModelCode" required>
                <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                  <el-option
                    v-for="item in businessModelOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺层高（m）" prop="shopHeight" required>
                <el-input-number v-model="formData.shopHeight" placeholder="请填写商铺层高（m）" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑面积（m）" prop="buildingArea" required>
                <el-input-number v-model="formData.buildingArea" placeholder="请填写建筑面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实用面积（m）" prop="usableArea" required>
                <el-input-number v-model="formData.usableArea" placeholder="请填写实用面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计租面积（m）" prop="rentalArea" required>
                <el-input-number v-model="formData.rentalArea" placeholder="请填写计租面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物业收费面积（m）" prop="propertyFeeArea" required>
                <el-input-number
                  v-model="formData.propertyFeeArea"
                  placeholder="请填写物业收费面积"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装修情况" prop="decorationLevel" required>
                <el-input v-model="formData.decorationLevel" placeholder="请填写装修情况" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺状态" prop="shopState" required>
                <el-select
                  v-model="formData.shopState"
                  :options="[
                    {
                      value: 0,
                      label: '空闲',
                    },
                    {
                      value: 1,
                      label: '出租中',
                    },
                  ]"
                  placeholder="请选择商铺状态"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源类别">
                <el-input
                  v-model="formData.resourceCategory"
                  placeholder="请填写资源类别"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源类型">
                <el-input v-model="formData.resourceType" placeholder="请填写资源类型" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源等级">
                <el-input v-model="formData.resourceLevel" placeholder="请填写资源等级" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效时间" prop="effectiveTime" required>
                <el-date-picker
                  v-model="formData.effectiveTime"
                  type="date"
                  placeholder="请选择生效时间"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="失效时间" prop="expireTime" required>
                <el-date-picker
                  v-model="formData.expireTime"
                  type="date"
                  placeholder="请选择失效时间"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="餐饮条件" prop="cateringCondition" required>
                <el-select
                  v-model="formData.cateringCondition"
                  :options="defaultoptions"
                  placeholder="请选择餐饮条件"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="燃气" prop="gasCondition" required>
                <el-select
                  v-model="formData.gasCondition"
                  :options="defaultoptions"
                  placeholder="请选择燃气"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="弱电条件" prop="weakCurrentCondition" required>
                <el-select
                  v-model="formData.weakCurrentCondition"
                  :options="defaultoptions"
                  placeholder="请选择弱电条件"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电表号" prop="powerGridNo" required>
                <el-input v-model="formData.powerGridNo" placeholder="请填写电表号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水表号" prop="waterServiceNo" required>
                <el-input v-model="formData.waterServiceNo" placeholder="请填写水表号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="燃气号" prop="gasNo" required>
                <el-input v-model="formData.gasNo" placeholder="请填写燃气号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电压" prop="voltage" required>
                <el-input v-model="formData.voltage" placeholder="请填写电压" />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/room')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="updateLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
