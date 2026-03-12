<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules, UploadUserFile} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import dayjs from 'dayjs'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {findValueByCustomId} from '@/utils/array-util'
import {
  amsAssetFixedInsert,
  amsAssetFixedUpdate,
  amsAssetFixedGet,
  amsAssetProjectList,
  amsAssetBuildingSelectBuildingEnclosure,
  amsAssetFloorList,
  amsAssetFixedGenerateFixedId,
  amsAssetResourceSelectLocationId,
} from '@/service/api/amsAsset'
import {UploadFile} from '@/components'
import {validateFileList} from '@/components/upload/utils'
import {FORMAT_DATE} from '@/common/date'

const props = defineProps<{mode: 'create' | 'edit'; fixedId?: string}>()

type DetailFileModel = {
  id?: string
  name?: string
  path?: string
  url?: string
  size?: number
  type?: number
  md5?: string
}

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

const {runAsync: insertFixed, loading: insertLoading} = useRequest(amsAssetFixedInsert)
const {runAsync: updateFixed, loading: updateLoading} = useRequest(amsAssetFixedUpdate)
const {runAsync: getFixedDetail, loading: detailLoading} = useRequest(amsAssetFixedGet)
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const {runAsync: assetList} = useRequest(amsAssetBuildingSelectBuildingEnclosure)
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const {runAsync: generateFixedIdApi} = useRequest(amsAssetFixedGenerateFixedId)
const {runAsync: locationList} = useRequest(amsAssetResourceSelectLocationId)

const projectOptions = reactive<AssetProjectVO[]>([])
const assetOptions = reactive<
  {id: string; name: string; assetType: string; totalFloor?: string | number}[]
>([])
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
const locationOptions = reactive<string[]>([])
const locationTypeOptions = useDicListTree({dicType: 1004})
const businessModelOptions = useDicListTree({dicType: 1020})
const deviceTypeOptions = useDicListTree({dicType: 1008})
const labelOptions = useDicListTree({dicType: 1027})
const attachmentFileList = ref<UploadUserFile[]>([])
const drawingFileList = ref<UploadUserFile[]>([])
const deviceContractFileList = ref<UploadUserFile[]>([])
const deviceInformationFileList = ref<UploadUserFile[]>([])
const contractFileList = ref<UploadUserFile[]>([])
const initializing = ref(false)
const projectsLoaded = ref(false)

const locationDisplay = reactive({
  area: '',
  address: '',
  totalFloor: '',
})

type AssetFixedFormData = AssetFixedUpsertDTO & {
  enable?: number
  businessModelCode?: string
  fixedId: string
  locationTypeCode?: string
}

const formData = reactive<AssetFixedFormData>({
  fixedId: '',
  projectId: '',
  assetId: '',
  assetType: '',
  floorId: '',
  locationCode: '',
  locationName: '',
  locationId: '',
  fixedName: '',
  serialNumber: '',
  fixedTypeCode: '',
  fixedTypeName: '',
  deviceTypeCode: '',
  deviceTypeName: '',
  fixedBrand: '',
  fixedSpecs: '',
  fixedModel: '',
  fixedSource: '',
  purchaseDate: '',
  assetAmount: undefined as any,
  elevatorSpeed: undefined as any,
  parkingSpaceNo: '',
  ownershipUnitCode: '',
  ownershipUnitName: '',
  deviceWorkState: undefined as any,
  deviceManageUser: '',
  deviceMajordomoUser: '',
  deviceCheckDate: '',
  deviceInstallDate: '',
  acceptanceDate: '',
  registerDate: '',
  warrantyExpireDate: '',
  warrantyCompany: '',
  warrantyLinkman: '',
  warrantyPhone: '',
  maintenanceCompany: '',
  maintenanceLinkman: '',
  maintenancePhone: '',
  maintenanceExpireDate: '',
  nextPatrolDate: '',
  nextMaintenanceDate: '',
  labelList: [],
  drawingFidList: [] as string[],
  deviceContractFidList: [] as string[],
  deviceInformationFidList: [] as string[],
  contractFidList: [] as string[],
  attachmentFidList: [] as string[],
  enable: 1,
  businessModelCode: '',
  businessModelName: '',
})

const formRules = reactive<FormRules>({
  fixedName: [{required: true, message: '请输入固定资产名称', trigger: 'blur'}],
  projectId: [{required: true, message: '请选择所属项目', trigger: 'change'}],
  assetId: [{required: true, message: '请选择围合/楼栋', trigger: 'change'}],
  floorId: [{required: true, message: '请选择楼层', trigger: 'change'}],
  deviceTypeCode: [{required: true, message: '请选择设备类型', trigger: 'change'}],
  fixedTypeCode: [{required: true, message: '请输入资产类型', trigger: 'blur'}],
  enable: [{required: true, message: '请选择启停状态', trigger: 'change'}],
  deviceWorkState: [{required: true, message: '请选择设备工作状态', trigger: 'change'}],
  locationCode: [{required: true, message: '请选择位置类型', trigger: 'change'}],
  locationName: [{required: true, message: '请选择位置类型', trigger: 'change'}],
  ownershipUnitName: [{required: true, message: '请输入产权单位', trigger: 'blur'}],
  deviceManageUser: [{required: true, message: '请输入设备管理员', trigger: 'blur'}],
  deviceMajordomoUser: [{required: true, message: '请输入设备总监', trigger: 'blur'}],
  deviceCheckDate: [{required: true, message: '请选择设备年检日期', trigger: 'change'}],
  deviceInstallDate: [{required: true, message: '请选择设备安装日期', trigger: 'change'}],
  acceptanceDate: [{required: true, message: '请选择验收日期', trigger: 'change'}],
  registerDate: [{required: true, message: '请选择注册登记日期', trigger: 'change'}],
  warrantyExpireDate: [{required: true, message: '请选择设备质保到期日', trigger: 'change'}],
  warrantyCompany: [{required: true, message: '请输入设备质保方名称', trigger: 'blur'}],
  warrantyLinkman: [{required: true, message: '请输入设备质保方联系人', trigger: 'blur'}],
  warrantyPhone: [{required: true, message: '请输入设备质保方联系方式', trigger: 'blur'}],
  maintenanceExpireDate: [{required: true, message: '请选择设备维保到期日', trigger: 'change'}],
  maintenanceCompany: [{required: true, message: '请输入设备维保方名称', trigger: 'blur'}],
  maintenanceLinkman: [{required: true, message: '请输入设备维保方联系人', trigger: 'blur'}],
  maintenancePhone: [{required: true, message: '请输入设备维保方联系方式', trigger: 'blur'}],
  nextPatrolDate: [{required: true, message: '请选择下次巡检日期', trigger: 'change'}],
  nextMaintenanceDate: [{required: true, message: '请选择下次保养日期', trigger: 'change'}],
})

const deviceWorkStateOptions = [
  {value: 1, label: '正常'},
  {value: 0, label: '故障'},
]

const dateFields: Array<
  keyof Pick<
    AssetFixedUpsertDTO,
    | 'purchaseDate'
    | 'deviceCheckDate'
    | 'deviceInstallDate'
    | 'acceptanceDate'
    | 'registerDate'
    | 'warrantyExpireDate'
    | 'maintenanceExpireDate'
    | 'nextPatrolDate'
    | 'nextMaintenanceDate'
  >
> = [
  'purchaseDate',
  'deviceCheckDate',
  'deviceInstallDate',
  'acceptanceDate',
  'registerDate',
  'warrantyExpireDate',
  'maintenanceExpireDate',
  'nextPatrolDate',
  'nextMaintenanceDate',
]

const normalizeDateFields = (payload: AssetFixedFormData) => {
  dateFields.forEach(field => {
    const value = payload[field]
    if (value) {
      payload[field] = dayjs(value).format(FORMAT_DATE) as (typeof payload)[typeof field]
    }
  })
}

const toNumberOrZero = (value: unknown) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const ensureValue = (value: string | undefined, fallback = '') => (value ? value : fallback)

const createUploadUid = (id?: string) => {
  if (!id) return Date.now()
  const numericId = Number(id)
  if (Number.isFinite(numericId)) return numericId
  return Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0)
}

const createUploadFileList = (
  fileModels?: DetailFileModel[] | DetailFileModel | null
): UploadUserFile[] => {
  if (!fileModels) return []
  const list = Array.isArray(fileModels) ? fileModels : [fileModels]
  return list
    .filter(item => item?.id)
    .map(item => ({
      uid: createUploadUid(item.id),
      name: item.name || item.id!,
      url: item.path || item.url || '',
      status: 'success',
      size: item.size,
      response: {
        code: 200,
        data: {id: item.id},
      } as Res,
    }))
}

const buildGenerateFixedIdPayload = (): AssetFixedIdGenerateDTO | null => {
  const {projectId, floorId, locationCode, locationId, fixedTypeCode, deviceTypeCode} = formData
  if (!projectId || !floorId || !locationCode || !locationId || !fixedTypeCode || !deviceTypeCode) {
    return null
  }
  return {
    projectId,
    floorId,
    locationCode,
    locationId,
    fixedTypeCode,
    deviceTypeCode,
  }
}

const generateFixedId = async () => {
  const payload = buildGenerateFixedIdPayload()
  if (!payload) return
  try {
    const {data} = await generateFixedIdApi(payload)
    if (data) {
      formData.fixedId = data
    }
  } catch (error) {
    console.error('自动生成编码失败:', error)
    formData.fixedId = ''
  }
}

// 监听关键字段变化自动生成编码
watch(
  [
    () => formData.projectId,
    () => formData.floorId,
    () => formData.fixedTypeCode,
    () => formData.deviceTypeCode,
    () => formData.locationTypeCode,
    () => formData.locationId,
  ],
  () => {
    if (!isEdit.value && buildGenerateFixedIdPayload()) {
      generateFixedId()
    }
  }
)

const loadProjects = async () => {
  const {data} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.length = 0
  projectOptions.push(...(data || []))
}

const loadAssets = async (projectId: string, options?: {keepSelection?: boolean}) => {
  const keepSelection = options?.keepSelection
  assetOptions.length = 0
  if (!keepSelection) {
    formData.assetId = ''
    formData.assetType = ''
    floorOptions.length = 0
    formData.floorId = ''
    locationOptions.length = 0
    formData.locationId = ''
  }
  if (!projectId) return
  const {data} = await assetList({pageable: false, projectId} as AssetBuildingListDTO)
  const list = Object.values(data || {}) as any[]
  assetOptions.push(
    ...list.map(item => ({
      id: item.id ?? item.assetId ?? item.buildingId,
      name: item.name ?? item.assetName ?? item.enclosureName,
      assetType: item.assetType,
      totalFloor: item.totalFloor ?? item.floorCount ?? item.totalFloors ?? '',
    }))
  )
}

const loadFloors = async (assetId: string, options?: {keepSelection?: boolean}) => {
  const keepSelection = options?.keepSelection
  floorOptions.length = 0
  if (!keepSelection) {
    formData.floorId = ''
    locationOptions.length = 0
    formData.locationId = ''
  }
  if (!assetId) return
  const assetType = assetOptions.find(item => item.id === assetId)?.assetType || ''
  formData.assetType = assetType
  const {data} = await floorList({pageable: false, assetType, assetId} as AssetFloorListDTO)
  floorOptions.push(...Object.values(data))
}

const loadLocations = async (floorId: string, options?: {keepSelection?: boolean}) => {
  const keepSelection = options?.keepSelection
  locationOptions.length = 0
  if (!keepSelection) {
    formData.locationId = ''
  }
  if (!floorId || !formData.businessModelCode) return
  try {
    const {data} = await locationList({
      floorId,
      businessModelCode: formData.businessModelCode,
    } as AssetLocationIdListDTO)
    if (data) {
      const list = Object.values(data) as string[]
      locationOptions.push(...list)
      if (keepSelection && formData.locationId && !locationOptions.includes(formData.locationId)) {
        locationOptions.push(formData.locationId)
      }
    }
  } catch (error) {
    console.error('获取位置列表失败:', error)
  }
}

watch(
  () => formData.floorId,
  floorId => {
    if (initializing.value) return
    loadLocations(floorId)
  }
)

watch(
  [() => formData.deviceTypeCode, () => deviceTypeOptions.length],
  ([code]) => {
    formData.deviceTypeName =
      findValueByCustomId(code, 'dicCode', 'dicName', deviceTypeOptions) || ''
  },
  {immediate: true}
)

watch(
  () => formData.businessModelCode,
  businessModelCode => {
    formData.businessModelName = findValueByCustomId(
      businessModelCode,
      'dicCode',
      'dicName',
      businessModelOptions
    )
    if (initializing.value) return
    if (formData.floorId && businessModelCode) {
      loadLocations(formData.floorId)
    } else {
      locationOptions.length = 0
      formData.locationId = ''
    }
  }
)

watch(
  () => formData.locationCode,
  locationCode => {
    formData.locationName =
      findValueByCustomId(locationCode, 'dicCode', 'dicName', locationTypeOptions) || ''
    const isNonPublic = locationTypeOptions.some(
      item => item.dicCode === locationCode && item.dicName?.includes('非公')
    )
    if (initializing.value) return
    if (!isNonPublic) {
      formData.locationId = ''
    }
  }
)

watch(
  () => formData.projectId,
  async projectId => {
    if (initializing.value) return
    locationDisplay.area = ''
    locationDisplay.address = ''
    if (projectId) {
      const project = projectOptions.find(item => item.projectId === projectId)
      locationDisplay.area = [project?.provinceName, project?.cityName, project?.districtName]
        .filter(Boolean)
        .join('/')
      locationDisplay.address = project?.address || ''
    }
    await loadAssets(projectId)
  }
)

watch(
  () => formData.assetId,
  assetId => {
    if (initializing.value) return
    const asset = assetOptions.find(item => item.id === assetId)
    locationDisplay.totalFloor = asset?.totalFloor ? String(asset.totalFloor) : ''
    loadFloors(assetId)
  }
)

const fetchDetail = async () => {
  if (!props.fixedId && !route.params.id) return
  initializing.value = true
  try {
    const fixedId = (props.fixedId as string) || (route.params.id as string)
    const {data} = await getFixedDetail({fixedId})
    Object.assign(formData, data)
    formData.labelList = Array.isArray(data.labelList)
      ? data.labelList
      : data.labelList
        ? String(data.labelList)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : []
    normalizeDateFields(formData)
    const fixedDetail = data as AssetFixedVO
    attachmentFileList.value = createUploadFileList(fixedDetail.attachmentFileModel)
    drawingFileList.value = createUploadFileList(fixedDetail.drawingFileModel)
    deviceContractFileList.value = createUploadFileList(fixedDetail.deviceContractFileModel)
    deviceInformationFileList.value = createUploadFileList(fixedDetail.deviceInformationFileModel)
    contractFileList.value = createUploadFileList(fixedDetail.contractFileModel)

    // 依次加载级联数据，并开启 keepSelection
    if (formData.projectId) {
      const project = projectOptions.find(item => item.projectId === formData.projectId)
      if (project) {
        locationDisplay.area = [project.provinceName, project.cityName, project.districtName]
          .filter(Boolean)
          .join('/')
        locationDisplay.address = project.address || ''
      }
      await loadAssets(formData.projectId, {keepSelection: true})

      if (formData.assetId) {
        const asset = assetOptions.find(item => item.id === formData.assetId)
        locationDisplay.totalFloor = asset?.totalFloor ? String(asset.totalFloor) : ''
        await loadFloors(formData.assetId, {keepSelection: true})

        if (formData.floorId) {
          await loadLocations(formData.floorId, {keepSelection: true})
        }
      }
    }
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    initializing.value = false
  }
}

const isEdit = computed(() => props.mode === 'edit')

const resetFormForCreate = () => {
  initializing.value = true
  Object.assign(formData, {
    fixedId: '',
    projectId: '',
    assetId: '',
    assetType: '',
    floorId: '',
    locationCode: '',
    locationName: '',
    locationId: '',
    fixedName: '',
    serialNumber: '',
    fixedTypeCode: '',
    fixedTypeName: '',
    deviceTypeCode: '',
    deviceTypeName: '',
    fixedBrand: '',
    fixedSpecs: '',
    fixedModel: '',
    fixedSource: '',
    purchaseDate: '',
    assetAmount: undefined,
    elevatorSpeed: undefined,
    parkingSpaceNo: '',
    ownershipUnitCode: '',
    ownershipUnitName: '',
    deviceWorkState: undefined,
    deviceManageUser: '',
    deviceMajordomoUser: '',
    deviceCheckDate: '',
    deviceInstallDate: '',
    acceptanceDate: '',
    registerDate: '',
    warrantyExpireDate: '',
    warrantyCompany: '',
    warrantyLinkman: '',
    warrantyPhone: '',
    maintenanceCompany: '',
    maintenanceLinkman: '',
    maintenancePhone: '',
    maintenanceExpireDate: '',
    nextPatrolDate: '',
    nextMaintenanceDate: '',
    label: '',
    drawingFidList: [],
    deviceContractFidList: [],
    deviceInformationFidList: [],
    contractFidList: [],
    attachmentFidList: [],
    enable: 1,
    businessModelCode: '',
    businessModelName: '',
  })
  attachmentFileList.value = []
  drawingFileList.value = []
  deviceContractFileList.value = []
  deviceInformationFileList.value = []
  contractFileList.value = []
  initializing.value = false
}

const ensureProjectsLoaded = async () => {
  if (!projectsLoaded.value) {
    await loadProjects()
    projectsLoaded.value = true
  }
}

const handleRouteChange = async () => {
  await ensureProjectsLoaded()
  const targetId = (props.fixedId as string) || (route.params.id as string)
  if (isEdit.value && targetId) {
    await fetchDetail()
    return
  }
  if (props.mode === 'create') {
    resetFormForCreate()
  }
}

onMounted(handleRouteChange)

const submitting = computed(() => insertLoading.value || updateLoading.value)

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    if (!formData.fixedId) {
      generateFixedId()
    }
    const [attachmentIds, drawingIds, deviceContractIds, deviceInformationIds, contractIds] =
      await Promise.all([
        validateFileList(attachmentFileList.value),
        validateFileList(drawingFileList.value),
        validateFileList(deviceContractFileList.value),
        validateFileList(deviceInformationFileList.value),
        validateFileList(contractFileList.value),
      ])
    const payload: AssetFixedFormData = {...formData}
    payload.attachmentFidList = attachmentIds || []
    payload.drawingFidList = drawingIds || []
    payload.deviceContractFidList = deviceContractIds || []
    payload.deviceInformationFidList = deviceInformationIds || []
    payload.contractFidList = contractIds || []
    normalizeDateFields(payload)
    // 补齐接口要求的默认值
    payload.locationCode = payload.locationCode || 'Pz'
    payload.locationName = ensureValue(payload.locationName, '公区')
    payload.locationId = payload.locationId || ''
    payload.businessModelCode = payload.businessModelCode || '0'
    payload.businessModelName = ensureValue(payload.businessModelName, '')
    // 如果选择了楼层，确保这些核心字段同步
    if (payload.floorId) {
      payload.locationCode = formData.locationCode || 'Pz'
      payload.locationName = formData.locationName || '公区'
      payload.locationId = formData.locationId || ''
      payload.businessModelCode = formData.businessModelCode || '0'
      payload.businessModelName = formData.businessModelName || ''
    }
    payload.fixedTypeName = ensureValue(payload.fixedTypeName, payload.fixedTypeCode)
    payload.deviceTypeName = ensureValue(payload.deviceTypeName, payload.deviceTypeCode)
    payload.ownershipUnitCode = ensureValue(payload.ownershipUnitCode, payload.ownershipUnitName)
    payload.assetAmount = toNumberOrZero(payload.assetAmount)
    payload.elevatorSpeed = toNumberOrZero(payload.elevatorSpeed)

    if (isEdit.value) {
      await updateFixed({...payload})
      ElMessage.success('更新成功')
    } else {
      await insertFixed({...payload})
      ElMessage.success('新增成功')
    }
    router.push({
      path: '/asset/management/fixed',
      query: {refresh: Date.now()},
    })
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span>{{ isEdit ? '编辑' : '新增' }}</span>
        <p class="text-red-600 text-xs">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="top"
      label-width="100px"
      :validate-on-rule-change="false"
      :validate-on-init="false"
      :disabled="detailLoading"
    >
      <section-group title="基本信息" inline>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="固定资产名称" prop="fixedName" required>
              <el-input v-model="formData.fixedName" placeholder="请输入固定资产名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固定资产编码">
              <el-input v-model="formData.fixedId" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序列号">
              <el-input v-model="formData.serialNumber" placeholder="请输入序列号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产类型" prop="fixedTypeCode" required>
              <el-input v-model="formData.fixedTypeCode" placeholder="请输入资产类型" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类型" prop="deviceTypeCode" required>
              <el-select v-model="formData.deviceTypeCode" placeholder="请选择设备类型" clearable>
                <el-option
                  v-for="item in deviceTypeOptions"
                  :key="item.dicCode"
                  :label="item.dicName"
                  :value="item.dicCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-input v-model="formData.fixedBrand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">
              <el-input v-model="formData.fixedSpecs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号">
              <el-input v-model="formData.fixedModel" placeholder="请输入型号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产来源">
              <el-input v-model="formData.fixedSource" placeholder="请输入资产来源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买日期">
              <el-date-picker
                v-model="formData.purchaseDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产金额">
              <el-input v-model.number="formData.assetAmount" placeholder="请输入资产金额" />
            </el-form-item>
          </el-col>
        </el-row>
      </section-group>

      <section-group title="位置信息" inline>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId" required>
              <el-select v-model="formData.projectId" placeholder="请选择所属项目" clearable>
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
            <el-form-item label="省市区">
              <el-input
                :model-value="locationDisplay.area"
                placeholder="选择项目后自动带出"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址">
              <el-input
                :model-value="locationDisplay.address"
                placeholder="选择项目后自动带出"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合/楼栋" prop="assetId" required>
              <el-select
                v-model="formData.assetId"
                placeholder="请选择围合/楼栋"
                :disabled="!formData.projectId"
                clearable
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
            <el-form-item label="总楼层">
              <el-input
                :model-value="locationDisplay.totalFloor"
                placeholder="选择楼栋后自动带出"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层" prop="floorId" required>
              <el-select
                v-model="formData.floorId"
                placeholder="请选择楼层"
                :disabled="!formData.assetId"
                clearable
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
            <el-form-item label="位置类型" prop="locationCode" required>
              <el-select v-model="formData.locationCode" placeholder="请选择位置类型" clearable>
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
            <el-form-item label="经营模式" prop="businessModelCode">
              <el-select
                v-model="formData.businessModelCode"
                placeholder="请选择经营模式"
                clearable
              >
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
            <el-form-item label="房间号/商铺号">
              <el-select
                v-model="formData.locationId"
                placeholder="请选择房间号/商铺号"
                :disabled="!formData.floorId || !formData.businessModelCode"
                clearable
              >
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
            <el-form-item label="位置名称" prop="locationName" required>
              <el-input v-model="formData.locationName" placeholder="根据选择自动带出" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </section-group>

      <section-group title="设备质保信息" inline>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitName" required>
              <el-input v-model="formData.ownershipUnitName" placeholder="请输入产权单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备管理员" prop="deviceManageUser" required>
              <el-input v-model="formData.deviceManageUser" placeholder="请输入设备管理员" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备总监" prop="deviceMajordomoUser" required>
              <el-input v-model="formData.deviceMajordomoUser" placeholder="请输入设备总监" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备年检日期" prop="deviceCheckDate" required>
              <el-date-picker
                v-model="formData.deviceCheckDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="设备启停状态" prop="enable" required>
              <el-select v-model="formData.enable" placeholder="请选择启停状态">
                <el-option
                  v-for="item in enableOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="设备工作状态" prop="deviceWorkState" required>
              <el-select v-model="formData.deviceWorkState" placeholder="请选择设备工作状态">
                <el-option
                  v-for="item in deviceWorkStateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备安装日期" prop="deviceInstallDate" required>
              <el-date-picker
                v-model="formData.deviceInstallDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收日期" prop="acceptanceDate" required>
              <el-date-picker
                v-model="formData.acceptanceDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册登记日期" prop="registerDate" required>
              <el-date-picker
                v-model="formData.registerDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备质保到期日" prop="warrantyExpireDate" required>
              <el-date-picker
                v-model="formData.warrantyExpireDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备质保方名称" prop="warrantyCompany" required>
              <el-input v-model="formData.warrantyCompany" placeholder="请输入设备质保方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备质保方联系人" prop="warrantyLinkman" required>
              <el-input v-model="formData.warrantyLinkman" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备质保方联系方式" prop="warrantyPhone" required>
              <el-input v-model="formData.warrantyPhone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备维保到期日" prop="maintenanceExpireDate" required>
              <el-date-picker
                v-model="formData.maintenanceExpireDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备维保方名称" prop="maintenanceCompany" required>
              <el-input v-model="formData.maintenanceCompany" placeholder="请输入维保方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备维保方联系人" prop="maintenanceLinkman" required>
              <el-input v-model="formData.maintenanceLinkman" placeholder="请输入维保联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备维保方联系方式" prop="maintenancePhone" required>
              <el-input v-model="formData.maintenancePhone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下次巡检日期" prop="nextPatrolDate" required>
              <el-date-picker
                v-model="formData.nextPatrolDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下次保养日期" prop="nextMaintenanceDate" required>
              <el-date-picker
                v-model="formData.nextMaintenanceDate"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                :value-format="FORMAT_DATE"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签">
              <el-select
                v-model="formData.labelList"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择标签"
                clearable
              >
                <el-option
                  v-for="item in labelOptions"
                  :key="item.dicCode"
                  :label="item.dicName"
                  :value="item.dicCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图纸">
              <upload-file
                v-model:file-list="drawingFileList"
                :limit="10"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              >
                <template #tip>
                  <div class="text-xs text-gray-500">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg ... 单个文件不超过1MB
                  </div>
                </template>
              </upload-file>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备合同">
              <upload-file
                v-model:file-list="deviceContractFileList"
                :limit="10"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              >
                <template #tip>
                  <div class="text-xs text-gray-500">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg ... 单个文件不超过1MB
                  </div>
                </template>
              </upload-file>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备技术资料">
              <upload-file
                v-model:file-list="deviceInformationFileList"
                :limit="10"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              >
                <template #tip>
                  <div class="text-xs text-gray-500">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg ... 单个文件不超过1MB
                  </div>
                </template>
              </upload-file>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同">
              <upload-file
                v-model:file-list="contractFileList"
                :limit="10"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              >
                <template #tip>
                  <div class="text-xs text-gray-500">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg ... 单个文件不超过1MB
                  </div>
                </template>
              </upload-file>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他附件">
              <upload-file
                v-model:file-list="attachmentFileList"
                :limit="10"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              >
                <template #tip>
                  <div class="text-xs text-gray-500">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg ... 单个文件不超过1MB
                  </div>
                </template>
              </upload-file>
            </el-form-item>
          </el-col>
        </el-row>
      </section-group>

      <div class="flex justify-center mt-6">
        <el-button @click="router.push('/asset/management/fixed')">返回</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </div>
    </el-form>
  </el-card>
</template>
