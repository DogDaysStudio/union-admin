<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetParkingList,
  amsAssetParkingSelectParkingRegion,
  amsAssetParkingSpaceUpdate,
  amsAssetParkingSpaceGet,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()
const route = useRoute()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 停车场列表
const {runAsync: parkingList} = useRequest(amsAssetParkingList)
const parkingOptions = reactive<{parkingId: string; parkingName: string}[]>([])
// 车位区域列表
const {runAsync: parkingRegionList} = useRequest(amsAssetParkingSelectParkingRegion)
const parkingSpaceRegionOptions = reactive<AssetParkingRegionVO[]>([])
// 字典 [车位属性1016 是否充电车位1015 产权单位1001]
const parkingSpaceAttributeOptions = useDicListTree({dicType: 1016})
const chargingPortOptions = useDicListTree({dicType: 1015})
const companyOptions = useDicListTree({dicType: 1001})
// 新增停车位
const {runAsync: parkingSpaceUpdate, loading: updateLoading} = useRequest(
  amsAssetParkingSpaceUpdate
)
// 车位详情
const {runAsync: parkingSpaceGet} = useRequest(amsAssetParkingSpaceGet)

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetParkingSpaceDTO)

const formRules = reactive({
  parkingSpaceName: {required: true, message: '请选填写车位名称', trigger: 'blur'},
  parkingSpaceArea: {required: true, message: '请选填写车位面积', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  parkingId: {required: true, message: '请选择停车场', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
  parkingSpaceRegionId: {required: true, message: '请选择车位区域', trigger: 'blur'},
  parkingSpaceAttributeCode: {required: true, message: '请选择车位属性', trigger: 'blur'},
  chargingPortCode: {required: true, message: '请选择是否充电车位', trigger: 'blur'},
  parkingSpaceState: {required: true, message: '请选择车位状态', trigger: 'blur'},
} as FormRules)

onMounted(() => {
  getOptions()
  getDetail()
})

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

const getDetail = async (): Promise<void> => {
  const {data: parkingDetail} = await parkingSpaceGet({parkingSpaceId: route.params.parkingSpaceId})
  const cloneData = JSON.parse(JSON.stringify(parkingDetail))
  Object.assign(formData, cloneData)
  const {data: parking} = await parkingList({
    pageable: false,
    projectId: cloneData.projectId,
  } as AssetParkingListDTO)
  parkingOptions.push(...parking)
  const {data: parkingSpaceRegion} = await parkingRegionList({
    parkingId: cloneData.parkingId,
  })
  parkingSpaceRegionOptions.push(...parkingSpaceRegion)
}

const changeProjectId = async (projectId: string) => {
  formData.parkingId = ''
  parkingOptions.length = 0
  formData.parkingSpaceRegionId = ''
  parkingSpaceRegionOptions.length = 0
  const {data: parking} = await parkingList({
    pageable: false,
    projectId,
  } as AssetParkingListDTO)
  parkingOptions.push(...parking)
}

const changeParkingId = async (parkingId: string) => {
  formData.parkingSpaceRegionId = ''
  parkingSpaceRegionOptions.length = 0
  const {data: parkingSpaceRegion} = await parkingRegionList({
    parkingId,
  })
  parkingSpaceRegionOptions.push(...parkingSpaceRegion)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      formData.parkingSpaceRegionName = findValueByCustomId(
        formData.parkingSpaceRegionId,
        'regionId',
        'regionCategoryName',
        parkingSpaceRegionOptions
      )
      formData.parkingSpaceAttributeName = findValueByCustomId(
        formData.parkingSpaceAttributeCode,
        'dicCode',
        'dicName',
        parkingSpaceAttributeOptions
      )
      formData.chargingPortName = findValueByCustomId(
        formData.chargingPortCode,
        'dicCode',
        'dicName',
        chargingPortOptions
      )
      let ownershipUnitCode = ''
      if (Array.isArray(formData.ownershipUnitCode)) {
        ownershipUnitCode = formData.ownershipUnitCode[formData.ownershipUnitCode.length - 1] ?? ''
        formData.ownershipUnitName = findValueByCustomId(
          ownershipUnitCode,
          'dicCode',
          'dicName',
          companyOptions
        )
      } else {
        ownershipUnitCode = formData.ownershipUnitCode
      }
      const {msg} = await parkingSpaceUpdate({...formData, ownershipUnitCode})
      ElMessage.success(msg)
      router.push('/asset/management/parking')
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
              <el-form-item label="车位名称" prop="parkingSpaceName" required>
                <el-input v-model="formData.parkingSpaceName" placeholder="请选填写车位名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位面积" prop="parkingSpaceArea" required>
                <el-input-number
                  v-model="formData.parkingSpaceArea"
                  placeholder="请选填写车位面积"
                  :min="0"
                />
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
              <el-form-item label="停车场" prop="parkingId" required>
                <el-select
                  v-model="formData.parkingId"
                  placeholder="请选择停车场"
                  @change="changeParkingId"
                >
                  <el-option
                    v-for="item in parkingOptions"
                    :key="item.parkingId"
                    :label="item.parkingName"
                    :value="item.parkingId"
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
            <el-col :span="8">
              <el-form-item label="车位区域" prop="parkingSpaceRegionId" required>
                <el-select v-model="formData.parkingSpaceRegionId" placeholder="请选择车位区域">
                  <el-option
                    v-for="item in parkingSpaceRegionOptions"
                    :key="item.regionId"
                    :label="item.regionCategoryName"
                    :value="item.regionId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位属性" prop="parkingSpaceAttributeCode" required>
                <el-select
                  v-model="formData.parkingSpaceAttributeCode"
                  placeholder="请选择车位属性"
                >
                  <el-option
                    v-for="item in parkingSpaceAttributeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否充电车位" prop="chargingPortCode" required>
                <el-select v-model="formData.chargingPortCode" placeholder="请选择是否充电车位">
                  <el-option
                    v-for="item in chargingPortOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位状态" prop="parkingSpaceState" required>
                <el-select
                  v-model="formData.parkingSpaceState"
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
                  placeholder="请选择车位状态"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/parking')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="updateLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
