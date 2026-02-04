<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {amsAsset} from '@/service/api/amsAsset'
import {iamCommon} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const route = useRoute()
const router = useRouter()

// 获取项目名称
const projectSelectAll = useRequest(amsAsset.amsAssetProjectSelectAll, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋下拉列表
const buildingList = useRequest(amsAsset.amsAssetBuildingList, {
  throttleInterval: 500,
})
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 新增楼层
const updateFloor = useRequest(amsAsset.amsAssetFloorUpdate, {
  throttleInterval: 500,
})
// 楼层详情
const getFloor = useRequest(amsAsset.amsAssetFloorGet, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetFloorBaseDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => getOptions())

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectSelectAll.runAsync()
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await companyListTree.runAsync({dicType: 1001, pageable: false})
  companyOptions.push(...Object.values(companyList))
  const {data: building} = await buildingList.runAsync({pageable: false} as AssetBuildingListDTO)
  buildingOptions.push(...Object.values(building))
  const {data: floorDetail} = await getFloor.runAsync({floorId: route.params.id})
  Object.assign(formData, floorDetail)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      if (Array.isArray(paramsData?.ownershipUnitCode)) {
        const targetCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1] ?? ''
        paramsData.ownershipUnitName =
          findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
        paramsData.ownershipUnitCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1]
      }
      const {msg} = await updateFloor.runAsync({...paramsData, assetType: '1'})
      ElMessage.success(msg)
      router.push('/asset/management/building-floor')
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}

const handleReset = () => router.push('/asset/management/building-floor')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑楼层
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <!-- 外层容器：水平居中 -->
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
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="楼层名称" prop="floorName" required>
              <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层编码" prop="floorId" required>
              <el-input v-model="formData.floorId" placeholder="请填写楼层编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层高（m）" prop="floorHeight" required>
              <el-input-number v-model="formData.floorHeight" placeholder="请填写层高" />
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
            <el-form-item label="项目编码" prop="projectId" required>
              <el-input v-model="formData.projectId" placeholder="请填写层高" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属楼栋" prop="assetId" required>
              <el-select v-model="formData.assetId" placeholder="请选择所属楼栋">
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
            <el-form-item label="楼栋编码" prop="assetId" required>
              <el-input v-model="formData.assetId" placeholder="请填写楼栋编码" disabled />
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
                  value: 'dicId',
                  label: 'dicName',
                }"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单操作按钮：居中、间距 -->
        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
