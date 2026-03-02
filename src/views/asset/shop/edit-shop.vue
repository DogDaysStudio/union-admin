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
// 字典 [ 产权单位 产权性质 房间类型 经营模式]
const companyOptions = useDicListTree({dicType: 1001})
const ownershipPropertyOptions = useDicListTree({dicType: 1022})
const roomTypeOptions = useDicListTree({dicType: 1005})
const businessModelOptions = useDicListTree({dicType: 1020})
// 编辑楼层
const {runAsync: shopUpdate, loading: updateLoading} = useRequest(amsAssetShopUpdate)
// 房间详情
const {runAsync: shopGet} = useRequest(amsAssetShopGet)

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetShopUpsertDTO)

const formRules = reactive<FormRules>({
  roomNumber: {required: true, message: '请填写房间号', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  waterServiceNo: {required: true, message: '请填写水务户号', trigger: 'blur'},
  powerGridNo: {required: true, message: '请填写电网户号', trigger: 'blur'},
  gasNo: {required: true, message: '请填写燃气户号', trigger: 'blur'},
  decorationLevel: {required: true, message: '请填写房源装修等级', trigger: 'blur'},
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
  console.log(shopDetail, 'shopDetail')

  Object.assign(formData, shopDetail)
  const {data: asset} = await assetList({
    projectId: shopDetail.projectId,
    pageable: false,
  } as AssetBuildingListDTO)
  assetOptions.push(...Object.values(asset))
  const {data: floor} = await floorList({
    pageable: false,
    assetType: '2',
    assetId: shopDetail.assetId,
  } as AssetFloorListDTO)
  floorOptions.push(...floor)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      paramsData.projectName = findValueByCustomId(
        paramsData.projectId,
        'projectId',
        'projectName',
        projectOptions
      )
      const {msg} = await shopUpdate({...paramsData, assetType: '1'})
      ElMessage.success(msg)
      router.push('/asset/management/room')
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
                <el-select v-model="formData.projectId" placeholder="请选择所属项目">
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
              <el-form-item label="所属楼栋/围合" required>
                <el-select v-model="formData.assetId" placeholder="请选择所属楼栋/围合">
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
              <el-form-item label="所属楼层" required>
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
              <el-form-item label="产权单位">
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
              <el-form-item label="产权类型" required>
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
              <el-form-item label="产权年限" required>
                <el-input-number v-model="formData.ownershipYear" placeholder="请填写产权年限" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权比例" required>
                <el-input-number v-model="formData.ownershipRatio" placeholder="请填写产权比例" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不动产编号" required>
                <el-input v-model="formData.realEstateNumber" placeholder="请填写不动产编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
        <section-group title="其他信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="房间类型" required>
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
              <el-form-item label="经营模式" required>
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
              <el-form-item label="商铺层高（m）" required>
                <el-input-number v-model="formData.shopHeight" placeholder="请填写商铺层高（m）" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑面积（m）" required>
                <el-input-number v-model="formData.buildingArea" placeholder="请填写建筑面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实用面积（m）" required>
                <el-input-number v-model="formData.usableArea" placeholder="请填写实用面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计租面积（m）" required>
                <el-input-number v-model="formData.rentalArea" placeholder="请填写计租面积" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物业收费面积（m）" required>
                <el-input-number
                  v-model="formData.propertyFeeArea"
                  placeholder="请填写物业收费面积"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装修情况" required>
                <el-input v-model="formData.decorationLevel" placeholder="请填写装修情况" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺状态" required>
                <el-select
                  v-model="formData.shopState"
                  :options="[
                    {
                      value: '0',
                      label: '空闲',
                    },
                    {
                      value: '1',
                      label: '出租中',
                    },
                  ]"
                  placeholder="请选择商铺状态"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源类别" required>
                <el-input
                  v-model="formData.resourceCategory"
                  placeholder="请填写资源类别"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源类型" required>
                <el-input v-model="formData.resourceType" placeholder="请填写资源类型" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资源等级" required>
                <el-input v-model="formData.resourceLevel" placeholder="请填写资源等级" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效时间" prop="collectDate">
                <el-date-picker
                  v-model="formData.effectiveTime"
                  type="date"
                  placeholder="请选择生效时间"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="失效时间" prop="collectDate">
                <el-date-picker
                  v-model="formData.expireTime"
                  type="date"
                  placeholder="请选择失效时间"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="餐饮条件" required>
                <el-select
                  v-model="formData.cateringCondition"
                  :options="[
                    {
                      value: '0',
                      label: '否',
                    },
                    {
                      value: '1',
                      label: '是',
                    },
                  ]"
                  placeholder="请选择餐饮条件"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="燃气" required>
                <el-select
                  v-model="formData.gasCondition"
                  :options="[
                    {
                      value: '0',
                      label: '否',
                    },
                    {
                      value: '1',
                      label: '是',
                    },
                  ]"
                  placeholder="请选择燃气"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="弱电条件" required>
                <el-select
                  v-model="formData.weakCurrentCondition"
                  :options="[
                    {
                      value: '0',
                      label: '否',
                    },
                    {
                      value: '1',
                      label: '是',
                    },
                  ]"
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
