<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetBuildingList,
  amsAssetRoomGet,
  amsAssetRoomUpdate,
  amsAssetProjectList,
  amsAssetFloorList,
} from '@/service/api/amsAsset'

const route = useRoute()
const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋下拉列表
const {runAsync: buildingList} = useRequest(amsAssetBuildingList)
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 字典 [户型 产权单位 房间类型 经营模式]
const roomOptions = useDicListTree({dicType: 1024})
const companyOptions = useDicListTree({dicType: 1001})
const roomTypeOptions = useDicListTree({dicType: 1005})
const businessModelOptions = useDicListTree({dicType: 1020})
// 楼层列表
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 编辑楼层
const {runAsync: roomUpdate, loading: updateLoading} = useRequest(amsAssetRoomUpdate)
// 房间详情
const {runAsync: getRoom} = useRequest(amsAssetRoomGet)

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetRoomUpsertDTO)

const formRules = reactive<FormRules>({
  roomNumber: {required: true, message: '请填写房间号', trigger: 'blur'},
  roomLayoutCode: {required: true, message: '请选择户型', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'blur'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
  roomTypeCode: {required: true, message: '请选择房间类型', trigger: 'blur'},
  businessModelCode: {required: true, message: '请选择经营模式', trigger: 'blur'},
  roomHeight: {required: true, message: '请填写房间层高', trigger: 'blur'},
  buildingArea: {required: true, message: '请填写建筑面积', trigger: 'blur'},
  rentalArea: {required: true, message: '请填写计租面积', trigger: 'blur'},
  propertyFeeArea: {required: true, message: '请填写物业收费面积', trigger: 'blur'},
  waterServiceNo: {required: true, message: '请填写水务户号', trigger: 'blur'},
  powerGridNo: {required: true, message: '请填写电网户号', trigger: 'blur'},
  gasNo: {required: true, message: '请填写燃气户号', trigger: 'blur'},
  decorationLevel: {required: true, message: '请填写房源装修等级', trigger: 'blur'},
  leaseType: {required: true, message: '请选择租赁方式', trigger: 'blur'},
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
  const {data: floorDetail} = await getRoom({roomId: route.params.roomId})
  Object.assign(formData, floorDetail)
  const {data: building} = await buildingList({
    projectId: floorDetail.projectId,
    pageable: false,
  } as AssetBuildingListDTO)
  buildingOptions.push(...building)
  const {data: floor} = await floorList({
    pageable: false,
    assetType: '1',
    assetId: floorDetail.assetId,
  } as AssetFloorListDTO)
  floorOptions.push(...floor)
}

const changeProjectId = async (projectId: string) => {
  buildingOptions.length = 0
  formData.assetId = ''
  formData.floorId = ''
  floorOptions.length = 0
  const {data: asset} = await buildingList({
    pageable: false,
    projectId,
  } as AssetBuildingListDTO)
  buildingOptions.push(...asset)
}

const changeAssetId = async (assetId: string) => {
  floorOptions.length = 0
  formData.floorId = ''
  formData.assetType = ''
  const {data: floor} = await floorList({
    pageable: false,
    assetType: '1',
    assetId,
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
      const {msg} = await roomUpdate({...paramsData, assetType: '1'})
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
              <el-form-item label="房间号" prop="roomNumber" required>
                <el-input v-model="formData.roomNumber" placeholder="请填写房间号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房间编码" required>
                <el-input v-model="formData.roomId" placeholder="请填写房间编码" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="户型" prop="roomLayoutCode" required>
                <el-select v-model="formData.roomLayoutCode" placeholder="请选择户型">
                  <el-option
                    v-for="item in roomOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
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
              <el-form-item label="所属楼栋" prop="assetId" required>
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属楼栋"
                  @change="changeAssetId"
                >
                  <el-option
                    v-for="item in buildingOptions"
                    :key="item.buildingId"
                    :label="item.buildingName"
                    :value="item.buildingId"
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
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
        <section-group title="其他信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="房间类型" prop="roomTypeCode" required>
                <el-select v-model="formData.roomTypeCode" placeholder="请选择房间类型">
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
              <el-form-item label="房间层高（m）" prop="roomHeight" required>
                <el-input-number
                  v-model="formData.roomHeight"
                  placeholder="请填写房间层高"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑面积（㎡）" prop="buildingArea" required>
                <el-input-number
                  v-model="formData.buildingArea"
                  placeholder="请填写建筑面积"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计租面积（㎡）" prop="rentalArea" required>
                <el-input-number
                  v-model="formData.rentalArea"
                  placeholder="请填写计租面积"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物业收费面积（㎡）" prop="propertyFeeArea" required>
                <el-input-number
                  v-model="formData.propertyFeeArea"
                  placeholder="请填写物业收费面积"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水务户号" prop="waterServiceNo" required>
                <el-input v-model="formData.waterServiceNo" placeholder="请填写水务户号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电网户号" prop="powerGridNo" required>
                <el-input v-model="formData.powerGridNo" placeholder="请填写电网户号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="燃气户号" prop="gasNo" required>
                <el-input v-model="formData.gasNo" placeholder="请填写燃气户号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房源装修等级" prop="decorationLevel" required>
                <el-input v-model="formData.decorationLevel" placeholder="请填写房源装修等级" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="租赁方式" prop="leaseType" required>
                <el-select
                  v-model="formData.leaseType"
                  :options="[
                    {
                      value: '0',
                      label: '整租',
                    },
                    {
                      value: '1',
                      label: '合租',
                    },
                  ]"
                  placeholder="请选择租赁方式"
                />
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
