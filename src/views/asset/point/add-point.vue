<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetBuildingSelectBuildingEnclosure,
  amsAssetResourceSelectLocationId,
  amsAssetFloorList,
  amsAssetResourceInsert,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋/围合列表
const {runAsync: assetList} = useRequest(amsAssetBuildingSelectBuildingEnclosure)
const assetOptions = reactive<{id: string; name: string; assetType: string}[]>([])
// 楼层列表
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 商铺号/房间号
const {runAsync: locationList} = useRequest(amsAssetResourceSelectLocationId)
const locationOptions = reactive<string[]>([])
// 字典 [业务类型1009 点位类型1011 广告类型1010 媒体类型1012 位置1004 经营模式1020 资源业务标签1028]
const resourceBusinessTypeOptions = useDicListTree({dicType: 1009})
const resourceTypeOptions = useDicListTree({dicType: 1011})
const resourceAdTypeOptions = useDicListTree({dicType: 1010})
const resourceMediaTypeOptions = useDicListTree({dicType: 1012})
const locationTypeOptions = useDicListTree({dicType: 1004})
const businessModelCodeOptions = useDicListTree({dicType: 1020})
const resourceBusinessTagOptions = useDicListTree({dicType: 1028})
// 新增点位
const {runAsync: resourceInsert, loading: insertLoading} = useRequest(amsAssetResourceInsert)

const formRef = ref<FormInstance>()

interface AddResource {
  code: string
  start: string
  end: string
  resourceList: AssetResourceUpsertDTO[]
}

const formData = reactive({resourceList: []} as AssetResourceUpsertDTO & AddResource)

const formRules = reactive<FormRules>({
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  locationCode: {required: true, message: '请选择位置', trigger: 'blur'},
  resourceBusinessTypeCode: {required: true, message: '请选择业务类型', trigger: 'blur'},
  resourceTypeCode: {required: true, message: '请选择点位类型', trigger: 'blur'},
  resourceAdTypeCode: {required: true, message: '请选择广告类型', trigger: 'blur'},
  resourceMediaTypeCode: {required: true, message: '请选择媒体类型', trigger: 'blur'},
  resourceBusinessTagCode: {required: true, message: '请选择业务标签', trigger: 'blur'},
  code: {required: true, message: '请填写空间点位资源编号前缀', trigger: 'blur'},
  start: {required: true, message: '请填写点位编号起始序号', trigger: 'blur'},
  end: {required: true, message: '请填写点位编号终止序号', trigger: 'blur'},
  resourceName: {required: true, message: '请填写空间点位资源名称', trigger: 'blur'},
  resourceSpecs: {required: true, message: '请填写规格', trigger: 'blur'},
  resourceArea: {required: true, message: '请填写面积（㎡）', trigger: 'blur'},
  resourceState: {required: true, message: '请选择点位资源状态', trigger: 'blur'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

const assetType = ref('')

// 监听projectId变化，获取楼栋列表
watch(
  () => formData.projectId,
  async projectId => {
    assetOptions.length = 0
    formData.assetId = ''
    floorOptions.length = 0
    formData.floorId = ''
    if (projectId) {
      const {data: build} = await assetList({
        pageable: false,
        projectId,
      } as AssetBuildingListDTO)
      assetOptions.push(...Object.values(build))
    }
  },
  {immediate: false}
)

// 监听assetId变化，获取楼层列表
watch(
  () => formData.assetId,
  async assetId => {
    floorOptions.length = 0
    formData.floorId = ''
    assetType.value = ''
    if (assetId) {
      assetType.value = assetOptions.find(item => formData.assetId == item.id).assetType
      const {data: floor} = await floorList({
        pageable: false,
        assetType: assetType.value,
        assetId,
      } as AssetFloorListDTO)
      floorOptions.push(...Object.values(floor))
    }
  },
  {immediate: false}
)

// 监听floorId获取房间/商铺号
watch(
  () => formData.floorId,
  async floorId => {
    locationOptions.length = 0
    formData.locationId = ''
    if (floorId && formData.businessModelCode) {
      const {data: floor} = await locationList({
        floorId,
        businessModelCode: formData.businessModelCode,
      } as AssetLocationIdListDTO)
      locationOptions.push(...Object.values(floor))
    }
  },
  {immediate: false}
)
// 监听businessModelCode获取房间/商铺号
watch(
  () => formData.businessModelCode,
  async businessModelCode => {
    locationOptions.length = 0
    formData.locationId = ''
    if (businessModelCode && formData.floorId) {
      const {data: floor} = await locationList({
        businessModelCode,
        floorId: formData.floorId,
      } as AssetLocationIdListDTO)
      locationOptions.push(...Object.values(floor))
    }
  },
  {immediate: false}
)

const handleAddPoint = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const {
        code,
        start,
        end,
        resourceName,
        resourceSpecs,
        resourceArea,
        resourceState,
        projectId,
        assetId,
        floorId,
        locationId,
        locationCode,
        businessModelCode,
        resourceBusinessTypeCode,
        resourceTypeCode,
        resourceAdTypeCode,
        resourceMediaTypeCode,
        resourceBusinessTagCode,
      } = formData

      // 1. 验证序号有效性
      const startNum = parseInt(start, 10)
      const endNum = parseInt(end, 10)
      if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
        ElMessage.warning('请输入有效的起始/终止序号（起始≤终止，且为数字）')
        return
      }

      // 2. 预匹配所有需要的中文名称（避免循环内重复调用）
      const businessModelName = findValueByCustomId(
        businessModelCode,
        'dicCode',
        'dicName',
        businessModelCodeOptions
      )
      const locationName = findValueByCustomId(
        locationCode,
        'dicCode',
        'dicName',
        locationTypeOptions
      )
      const resourceBusinessType = findValueByCustomId(
        resourceBusinessTypeCode,
        'dicCode',
        'dicName',
        resourceBusinessTypeOptions
      )
      const resourceType = findValueByCustomId(
        resourceTypeCode,
        'dicCode',
        'dicName',
        resourceTypeOptions
      )
      const resourceAdType = findValueByCustomId(
        resourceAdTypeCode,
        'dicCode',
        'dicName',
        resourceAdTypeOptions
      )
      const resourceMediaType = findValueByCustomId(
        resourceMediaTypeCode,
        'dicCode',
        'dicName',
        resourceMediaTypeOptions
      )
      const resourceBusinessTag = findValueByCustomId(
        resourceBusinessTagCode,
        'dicCode',
        'dicName',
        resourceBusinessTagOptions
      )

      const newPoints = []
      for (let num = startNum; num <= endNum; num++) {
        const serialNumber = String(num).padStart(4, '0')
        const resourceCode = `${code}${serialNumber}`
        // 检查编号是否重复
        const isDuplicate = formData.resourceList.some(p => p.resourceNumber === resourceCode)
        if (isDuplicate) {
          ElMessage.warning(`点位编号 ${resourceCode} 已存在，跳过生成`)
          continue
        }
        newPoints.push({
          resourceName,
          resourceNumber: resourceCode,
          resourceSpecs,
          resourceArea,
          resourceState,
          projectId,
          assetId,
          floorId,
          locationId,
          locationCode,
          businessModelCode,
          resourceBusinessTypeCode,
          resourceTypeCode,
          resourceAdTypeCode,
          resourceMediaTypeCode,
          resourceBusinessTagCode,
          locationName,
          businessModelName,
          resourceBusinessType,
          resourceType,
          resourceAdType,
          resourceMediaType,
          resourceBusinessTag,
          assetType: assetType.value,
        })
      }
      if (newPoints.length > 0) {
        formData.resourceList.push(...newPoints)
        ElMessage.success(`成功生成 ${newPoints.length} 个点位`)
      } else {
        ElMessage.warning('未生成新点位（无有效序号或全部重复）')
      }
    }
  })
}

const handleDeletePoint = async (resourceNumber: string) => {
  formData.resourceList = formData.resourceList.filter(
    item => item.resourceNumber !== resourceNumber
  )
  ElMessage.success('点位删除成功!')
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData)) as AssetResourceInsertDTO
      const {msg} = await resourceInsert({resourceList: paramsData.resourceList})
      ElMessage.success(msg)
      router.push('/asset/management/point')
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
              <el-form-item label="所属围合/楼栋" prop="assetId">
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属围合/楼栋"
                  :disabled="!formData.projectId"
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
              <el-form-item label="所属楼层" prop="floorId">
                <el-select
                  v-model="formData.floorId"
                  placeholder="请选择所属楼层"
                  :disabled="!formData.assetId"
                >
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
              <el-form-item label="位置" prop="locationCode" required>
                <el-select v-model="formData.locationCode" placeholder="请选择位置">
                  <el-option
                    v-for="item in locationTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经营模式">
                <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                  <el-option
                    v-for="item in businessModelCodeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房间号/商铺号">
                <el-select v-model="formData.locationId" placeholder="请选择房间号/商铺号">
                  <el-option
                    v-for="item in locationOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务类型" prop="resourceBusinessTypeCode" required>
                <el-select v-model="formData.resourceBusinessTypeCode" placeholder="请选择业务类型">
                  <el-option
                    v-for="item in resourceBusinessTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位类型" prop="resourceTypeCode" required>
                <el-select v-model="formData.resourceTypeCode" placeholder="请选择点位类型">
                  <el-option
                    v-for="item in resourceTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="广告类型" prop="resourceAdTypeCode" required>
                <el-select v-model="formData.resourceAdTypeCode" placeholder="请选择广告类型">
                  <el-option
                    v-for="item in resourceAdTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="媒体类型" prop="resourceMediaTypeCode" required>
                <el-select v-model="formData.resourceMediaTypeCode" placeholder="请选择媒体类型">
                  <el-option
                    v-for="item in resourceMediaTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务标签" prop="resourceBusinessTagCode" required>
                <el-select v-model="formData.resourceBusinessTagCode" placeholder="请选择业务标签">
                  <el-option
                    v-for="item in resourceBusinessTagOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="点位信息" inline>
          <template #extra>
            <el-button type="primary" @click="handleAddPoint">添加点位</el-button>
          </template>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="空间点位资源编号前缀" prop="code" required>
                <el-input v-model="formData.code" placeholder="请选填写空间点位资源编号前缀" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位编号起始序号" prop="start" required>
                <el-input v-model="formData.start" placeholder="请选填写点位编号起始序号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位编号终止序号" prop="end" required>
                <el-input v-model="formData.end" placeholder="请选填写点位编号终止序号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="空间点位资源名称" prop="resourceName" required>
                <el-input v-model="formData.resourceName" placeholder="请选填写空间点位资源名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格" prop="resourceSpecs" required>
                <el-input v-model="formData.resourceSpecs" placeholder="请选填写规格" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积（㎡）" prop="resourceArea" required>
                <el-input-number v-model="formData.resourceArea" placeholder="请选填写面积（㎡）" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位资源状态" prop="resourceState" required>
                <el-select
                  v-model="formData.resourceState"
                  :options="[
                    {value: 0, label: '待租'},
                    {value: 1, label: '已租'},
                  ]"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="formData.resourceList" border>
            <el-table-column label="序号" type="index" width="60" />

            <el-table-column label="点位资源名称" prop="resourceName">
              <template #default="{row}">
                <el-input v-model="row.resourceName" />
              </template>
            </el-table-column>
            <el-table-column label="点位资源编号" prop="resourceNumber">
              <template #default="{row}">
                <el-input v-model="row.resourceNumber" />
              </template>
            </el-table-column>
            <el-table-column label="规格" prop="resourceSpecs">
              <template #default="{row}">
                <el-input v-model="row.resourceSpecs" />
              </template>
            </el-table-column>

            <el-table-column label="面积" prop="resourceArea">
              <template #default="{row}">
                <el-input-number
                  v-model="row.resourceArea"
                  :precision="2"
                  :min="0"
                  style="width: 100%"
                />
              </template>
            </el-table-column>

            <el-table-column label="点位状态" prop="resourceState">
              <template #default="{row}">
                <el-select
                  v-model="row.resourceState"
                  :options="[
                    {value: 0, label: '待租'},
                    {value: 1, label: '已租'},
                  ]"
                ></el-select>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="100">
              <template #default="{row}">
                <el-button link type="danger" @click="handleDeletePoint(row.resourceNumber)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/point')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
