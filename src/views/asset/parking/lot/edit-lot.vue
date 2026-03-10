<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetParkingGet,
  amsAssetParkingUpdate,
  amsAssetParkingCheckParkingSpaceRegionIsUse,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import UniUpload from '@/components/upload/UploadFile.vue'
declare module 'element-plus' {
  interface UploadFile {
    bizData?: {
      id: string
    }
  }
}

const router = useRouter()
const route = useRoute()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<
  {
    projectId: string
    projectName: string
    areaName: string
    address: string
    lng: number
    lat: number
  }[]
>([])
// 字典 [停车场位置1013 停车方式1026 车位类别1014 区域类别1025 产权单位1001]
const parkingLocationOptions = useDicListTree({dicType: 1013})
const parkingMethodOptions = useDicListTree({dicType: 1026})
const parkingCategoryOptions = useDicListTree({dicType: 1014})
const regionCategoryOptions = useDicListTree({dicType: 1025})
const companyOptions = useDicListTree({dicType: 1001})
// 编辑停车场
const {runAsync: parkingUpdate, loading: updateLoding} = useRequest(amsAssetParkingUpdate)
// 停车场详情
const {runAsync: parkingGet} = useRequest(amsAssetParkingGet)
// 停车场是否能删除
const {runAsync: spaceRegionIsUse, loading: deleteLoding} = useRequest(
  amsAssetParkingCheckParkingSpaceRegionIsUse
)

const formRef = ref<FormInstance>()

const formData = reactive({
  parking: {},
  parkingSpaceRegions: [{regionCategoryCode: '', regionName: '', regionMapFid: ''}],
} as AssetParkingUpsertDTO & {
  parking: AssetParkingDTO & {address: string; lng: number; lat: number}
})

const formRules = reactive({
  parking: {
    projectId: {required: true, message: '请选择项目名称', trigger: 'blur'},
    parkingName: {required: true, message: '请输入停车场名称', trigger: 'blur'},
    parkingLocationCode: {required: true, message: '请选择停车场位置', trigger: 'blur'},
    parkingMethodCode: {required: true, message: '请选择停车方式', trigger: 'blur'},
    parkingCategoryCode: {required: true, message: '请选择车位类别', trigger: 'blur'},
    parkingSpaceQuantity: {required: true, message: '请输入停车位数', trigger: 'blur'},
  },
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
  const {data: parkingDetail} = await parkingGet({parkingId: route.params.parkingId})
  const cloneData = JSON.parse(JSON.stringify(parkingDetail))
  if (cloneData?.parkingRegions) {
    cloneData.parkingRegions.forEach(item => {
      if (item?.regionMapFileModel?.id) {
        item.imgList = [
          {
            url: item?.regionMapFileModel.path, // 图片预览地址（必选）
            uid: Date.now() + Math.floor(Math.random() * 1000), // 唯一标识（用接口返回的id，必选）
            name: item?.regionMapFileModel.name, // 文件名
            status: 'success' as const, // 标记为已上传成功
            size: item?.regionMapFileModel.size, // 文件大小（可选，用于显示）
            bizData: {
              id: item?.regionMapFileModel.id,
            },
          },
        ]
      }
    })
  }
  formData.parkingSpaceRegions = [...cloneData.parkingRegions]
  formData.parking = {...cloneData}
  changeProjectId(formData.parking.projectId)
}

const changeProjectId = (projectId: string) => {
  const findItem = projectOptions.filter(item => item.projectId == projectId)
  formData.parking.address = `${findItem[0].areaName || ''}${findItem[0].address || ''}`
  formData.parking.lng = findItem[0].lng || null
  formData.parking.lat = findItem[0].lat || null
}

const handleAdd = () => {
  formData.parkingSpaceRegions.push({
    regionCategoryCode: '',
    regionCategoryName: '',
    regionId: '',
    regionName: '',
    regionMapFid: '',
  })
}

const handleDelete = async (parkingSpaceRegionId: string | undefined, index: number) => {
  if (parkingSpaceRegionId) {
    await spaceRegionIsUse({parkingSpaceRegionId})
    formData.parkingSpaceRegions.splice(index, 1)
  } else {
    formData.parkingSpaceRegions.splice(index, 1)
  }
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      formData.parking.parkingLocationName = findValueByCustomId(
        formData.parking.parkingLocationCode,
        'dicCode',
        'dicName',
        parkingLocationOptions
      )
      formData.parking.parkingMethodName = findValueByCustomId(
        formData.parking.parkingMethodCode,
        'dicCode',
        'dicName',
        parkingMethodOptions
      )
      formData.parking.parkingCategoryName = findValueByCustomId(
        formData.parking.parkingCategoryCode,
        'dicCode',
        'dicName',
        parkingCategoryOptions
      )
      formData.parkingSpaceRegions.forEach(item => {
        item.regionCategoryName = findValueByCustomId(
          item.regionCategoryCode,
          'dicCode',
          'dicName',
          regionCategoryOptions
        )
        const regionItem = item as typeof item & {
          imgList?: {
            value: Array<{
              response?: {data: {id: string}}
            }>
          }
        }
        if (regionItem?.imgList) {
          const response = regionItem.imgList[0]?.response as {data: {id: string}} | undefined
          regionItem.regionMapFid = response?.data?.id || regionItem.imgList[0]?.bizData?.id
        }
      })
      let ownershipUnitCode = ''
      if (Array.isArray(formData.parking.ownershipUnitCode)) {
        ownershipUnitCode =
          formData.parking.ownershipUnitCode[formData.parking.ownershipUnitCode.length - 1] ?? ''
        formData.parking.ownershipUnitName = findValueByCustomId(
          ownershipUnitCode,
          'dicCode',
          'dicName',
          companyOptions
        )
      } else {
        ownershipUnitCode = formData.parking.ownershipUnitCode
      }
      const {msg} = await parkingUpdate({
        parkingSpaceRegions: formData.parkingSpaceRegions,
        parking: {
          ...formData.parking,
          ownershipUnitCode,
        },
      })

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
              <el-form-item label="项目名称" prop="parking.projectId" required>
                <el-select
                  v-model="formData.parking.projectId"
                  placeholder="请选择项目名称"
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
              <el-form-item label="项目地址" required>
                <el-input
                  v-model="formData.parking.address"
                  placeholder="请填写项目地址"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经纬度" required>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-input-number v-model="formData.parking.lng" placeholder="经度" disabled />
                  </el-col>
                  <el-col :span="12">
                    <el-input-number v-model="formData.parking.lat" placeholder="纬度" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车场名称" prop="parking.parkingName" required>
                <el-input v-model="formData.parking.parkingName" placeholder="请输入停车场名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="parking.ownershipUnitCode" required>
                <el-cascader
                  v-model="formData.parking.ownershipUnitCode"
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
              <el-form-item label="停车场位置" prop="parking.parkingLocationCode" required>
                <el-select
                  v-model="formData.parking.parkingLocationCode"
                  placeholder="请选择停车场位置"
                >
                  <el-option
                    v-for="item in parkingLocationOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车方式" prop="parking.parkingMethodCode" required>
                <el-select
                  v-model="formData.parking.parkingMethodCode"
                  placeholder="请选择停车方式"
                >
                  <el-option
                    v-for="item in parkingMethodOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位类别" prop="parking.parkingCategoryCode" required>
                <el-select
                  v-model="formData.parking.parkingCategoryCode"
                  placeholder="请选择车位类别"
                >
                  <el-option
                    v-for="item in parkingCategoryOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车位数" prop="parking.parkingSpaceQuantity" required>
                <el-input-number
                  v-model="formData.parking.parkingSpaceQuantity"
                  placeholder="请输入停车位数"
                  :min="0"
                  :precision="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积">
                <el-input-number
                  v-model="formData.parking.parkingArea"
                  placeholder="请输入面积"
                  :min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="车位区域信息" inline>
          <el-table :data="formData.parkingSpaceRegions" border>
            <el-table-column label="序号" type="index" width="60" />
            <el-table-column label="区域类别" prop="regionCategoryCode">
              <template #default="{row}">
                <el-select v-model="row.regionCategoryCode" placeholder="请选择区域类别">
                  <el-option
                    v-for="item in regionCategoryOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="车位区域" prop="regionName">
              <template #default="{row}">
                <el-input
                  type="textarea"
                  autosize
                  v-model="row.regionName"
                  placeholder="请输入车位区域"
                />
              </template>
            </el-table-column>
            <el-table-column label="区域地图" prop="regionMapFileModel">
              <template #default="{row}">
                <uni-upload v-model:file-list="row.imgList" :limit="1" :accept="'.jpg,.png,.pdf'" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template #default="{row, $index}">
                <el-button
                  v-if="$index === formData.parkingSpaceRegions.length - 1"
                  link
                  type="primary"
                  @click="handleAdd"
                >
                  添加
                </el-button>
                <el-button
                  v-if="formData.parkingSpaceRegions.length !== 1"
                  link
                  type="danger"
                  :loading="deleteLoding"
                  @click="handleDelete(row?.regionMapFileModel.id, $index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/parking')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="updateLoding">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
