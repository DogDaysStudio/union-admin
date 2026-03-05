<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {amsAssetProjectList, amsAssetParkingUpsert} from '@/service/api/amsAsset'
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

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 [停车场位置1013 停车方式1026 车位类别1014 区域类别1025]
const parkingLocationOptions = useDicListTree({dicType: 1013})
const parkingMethodOptions = useDicListTree({dicType: 1026})
const parkingCategoryOptions = useDicListTree({dicType: 1014})
const regionCategoryOptions = useDicListTree({dicType: 1025})
// 新增停车场
const {runAsync: parkingUpsert, loading: insertLoading} = useRequest(amsAssetParkingUpsert)

const formRef = ref<FormInstance>()

const formData = reactive({
  parking: {},
  parkingSpaceRegions: [{regionCategoryCode: '', regionName: '', regionMapFid: ''}],
} as AssetParkingUpsertDTO)

const formRules = reactive({
  parking: {
    projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
    parkingName: {required: true, message: '请输入停车场名称', trigger: 'blur'},
    parkingLocationCode: {required: true, message: '请选择停车场位置', trigger: 'blur'},
    parkingMethodCode: {required: true, message: '请选择停车方式', trigger: 'blur'},
    parkingCategoryCode: {required: true, message: '请选择车位类别', trigger: 'blur'},
    parkingSpaceQuantity: {required: true, message: '请输入停车位数', trigger: 'blur'},
  },
} as FormRules)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
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

const handleDelete = async (index: number) => formData.parkingSpaceRegions.splice(index, 1)

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
          regionItem.regionMapFid = response?.data?.id
        }
      })
      const {msg} = await parkingUpsert({...formData})
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
              <el-form-item label="所属项目" prop="parking.projectId" required>
                <el-select v-model="formData.parking.projectId" placeholder="请选择所属项目">
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
              <el-form-item label="停车场名称" prop="parking.parkingName" required>
                <el-input v-model="formData.parking.parkingName" placeholder="请输入停车场名称" />
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
              <template #default="{$index}">
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
                  @click="handleDelete($index)"
                >
                  删除
                </el-button>
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
