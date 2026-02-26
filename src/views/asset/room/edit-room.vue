<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {
  amsAssetBuildingList,
  amsAssetRoomGet,
  amsAssetRoomUpdate,
  amsAssetProjectList,
  amsAssetFloorList,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'

const route = useRoute()
const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋下拉列表
const {runAsync: buildingList} = useRequest(amsAssetBuildingList)
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 字典 [户型 产权单位（公司） 房间类型 经营模式]
const {runAsync: dicListTree} = useRequest(iamCommonDicListTree)
const roomOptions = reactive<SysDicVO[]>([])
const companyOptions = reactive<SysDicVO[]>([])
const roomTypeOptions = reactive<SysDicVO[]>([])
const businessModelOptions = reactive<SysDicVO[]>([])
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
  const {data: roomList} = await dicListTree({
    dicType: 1024,
    pageable: false,
  } as SysDicListDTO)
  roomOptions.push(...Object.values(roomList))
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await dicListTree({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
  const {data: roomType} = await dicListTree({dicType: 1005})
  roomTypeOptions.push(...Object.values(roomType))
  const {data: businessModel} = await dicListTree({dicType: 1020})
  businessModelOptions.push(...Object.values(businessModel))
}

const getDetail = async () => {
  const {data: floorDetail} = await getRoom({roomId: route.params.id})
  Object.assign(formData, floorDetail)
  const {data: building} = await buildingList({
    projectId: floorDetail.projectId,
    pageable: false,
  } as AssetBuildingListDTO)
  buildingOptions.push(...Object.values(building))
  const {data: floor} = await floorList({
    pageable: false,
    assetType: '1',
    assetId: floorDetail.assetId,
  } as AssetFloorListDTO)
  floorOptions.push(...Object.values(floor))
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
              <el-form-item label="户型" required>
                <el-select v-model="formData.roomLayoutCode" placeholder="请选择户型" disabled>
                  <el-option
                    v-for="item in roomOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
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
              <el-form-item label="所属楼栋" required>
                <el-select v-model="formData.assetId" placeholder="请选择所属楼栋" disabled>
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
              <el-form-item label="所属楼层" required>
                <el-select v-model="formData.floorId" placeholder="请选择所属楼层" disabled>
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
              <el-form-item label="产权单位" required>
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
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>
        <section-group title="其他信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="房间类型" required>
                <el-select v-model="formData.roomTypeCode" placeholder="请选择房间类型" disabled>
                  <el-option
                    v-for="item in roomTypeOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经营模式" required>
                <el-select
                  v-model="formData.businessModelCode"
                  placeholder="请选择经营模式"
                  disabled
                >
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
              <el-form-item label="房间层高（m）" required>
                <el-input-number
                  v-model="formData.roomHeight"
                  placeholder="请填写房间层高"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑面积（m）" required>
                <el-input-number
                  v-model="formData.buildingArea"
                  placeholder="请填写建筑面积"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计租面积（m）" required>
                <el-input-number
                  v-model="formData.rentalArea"
                  placeholder="请填写计租面积"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物业收费面积（m）" required>
                <el-input-number
                  v-model="formData.propertyFeeArea"
                  placeholder="请填写物业收费面积"
                  disabled
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
              <el-form-item label="租赁方式" required>
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
                  disabled
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
