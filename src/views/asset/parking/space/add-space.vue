<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetParkingList,
  amsAssetParkingSelectParkingRegion,
  amsAssetParkingSpaceInsert,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

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
const {runAsync: parkingSpaceInsert, loading: insertLoading} = useRequest(
  amsAssetParkingSpaceInsert
)

const formRef = ref<FormInstance>()

interface AddSpace {
  projectId: string
  parkingId: string
  ownershipUnitCode: string[]
  parkingSpaceRegionId: string
  parkingSpaceAttributeCode: string
  chargingPortCode: string
  parkingSpaceState: string
  lotNum: number
  start: string
  area: number
}

const formData = reactive({parkingSpaceList: []} as AssetParkingSpaceInsertDTO & AddSpace)

const formRules = reactive({
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  parkingId: {required: true, message: '请选择停车场', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
  parkingSpaceRegionId: {required: true, message: '请选择车位区域', trigger: 'blur'},
  parkingSpaceAttributeCode: {required: true, message: '请选择车位属性', trigger: 'blur'},
  chargingPortCode: {required: true, message: '请选择是否充电车位', trigger: 'blur'},
  parkingSpaceState: {required: true, message: '请选择车位状态', trigger: 'blur'},
  lotNum: {required: true, message: '请选填写区域车位数', trigger: 'blur'},
  start: {required: true, message: '请选填写车位名称前缀前缀', trigger: 'blur'},
  area: {required: true, message: '请选填写面积', trigger: 'blur'},
} as FormRules)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
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

const handleAddSpace = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const {lotNum, start, area} = formData
      formData.parkingSpaceList.length = 0
      const spaces = []
      for (let num = 1; num <= lotNum; num++) {
        const serialNumber = String(num).padStart(4, '0')
        const name = `${start}${serialNumber}`
        // 检查编号是否重复
        const isDuplicate = formData.parkingSpaceList.some(p => p.parkingSpaceName === name)
        if (isDuplicate) {
          ElMessage.warning(`车位名称 ${name} 已存在，跳过生成`)
          continue
        }
        spaces.push({
          projectId: formData.projectId,
          parkingId: formData.parkingId,
          parkingSpaceRegionId: formData.parkingSpaceRegionId,
          parkingSpaceRegionName: findValueByCustomId(
            formData.parkingSpaceRegionId,
            'regionId',
            'regionCategoryName',
            parkingSpaceRegionOptions
          ),
          ownershipUnitCode: formData.ownershipUnitCode[formData.ownershipUnitCode.length - 1],
          ownershipUnitName: findValueByCustomId(
            formData.ownershipUnitCode[formData.ownershipUnitCode.length - 1],
            'dicCode',
            'dicName',
            companyOptions
          ),
          parkingSpaceAttributeCode: formData.parkingSpaceAttributeCode,
          parkingSpaceAttributeName: findValueByCustomId(
            formData.parkingSpaceAttributeCode,
            'dicCode',
            'dicName',
            parkingSpaceAttributeOptions
          ),
          chargingPortCode: formData.chargingPortCode,
          chargingPortName: findValueByCustomId(
            formData.chargingPortCode,
            'dicCode',
            'dicName',
            chargingPortOptions
          ),
          parkingSpaceState: formData.parkingSpaceState,
          parkingSpaceId: '',
          parkingSpaceName: name,
          parkingSpaceArea: area,
        })
      }
      formData.parkingSpaceList = spaces
    }
  })
}

const handleDeleteSpace = async (index: number) => {
  formData.parkingSpaceList.splice(index, 1)
  ElMessage.success('删除成功!')
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const {msg} = await parkingSpaceInsert({parkingSpaceList: formData.parkingSpaceList})
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
        新增
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

        <section-group title="停车位信息" inline>
          <template #extra>
            <el-button type="primary" @click="handleAddSpace">生成</el-button>
          </template>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="区域车位数" prop="lotNum" required>
                <el-input-number
                  v-model="formData.lotNum"
                  placeholder="请选填写区域车位数"
                  :precision="0"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位名称前缀" prop="start" required>
                <el-input v-model="formData.start" placeholder="请选填写车位名称前缀" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积(㎡)" prop="area" required>
                <el-input-number v-model="formData.area" placeholder="请选填写面积" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="formData.parkingSpaceList" border>
            <el-table-column label="序号" type="index" width="60" />
            <el-table-column label="车位名称" prop="parkingSpaceName">
              <template #default="{row}">
                <el-input v-model="row.parkingSpaceName" />
              </template>
            </el-table-column>
            <el-table-column label="面积（㎡）" prop="parkingSpaceArea">
              <template #default="{row}">
                <el-input-number v-model="row.parkingSpaceArea" :min="0" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template #default="{$index}">
                <el-button link type="danger" @click="handleDeleteSpace($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/parking')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
