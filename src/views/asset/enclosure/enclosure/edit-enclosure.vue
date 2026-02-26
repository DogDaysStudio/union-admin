<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {
  amsAssetProjectList,
  amsAssetEnclosureUpdate,
  amsAssetEnclosureGet,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()
const route = useRoute()

// 获取项目列表
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 户型 产权单位（公司） 围合类型
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
const enclosureOptions = reactive<SysDicVO[]>([])
// 编辑围合
const enclosureUpdate = useRequest(amsAssetEnclosureUpdate, {
  throttleInterval: 500,
})
// 围合详情
const enclosureGet = useRequest(amsAssetEnclosureGet, {
  throttleInterval: 500,
})

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetEnclosureUpdateDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  enclosureName: {required: true, message: '请填写围合名称', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  enclosureTypeCode: {required: true, message: '请选择围合类型', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => getOptions())

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList.runAsync({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await dicListTree.runAsync({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
  const {data: enclosureList} = await dicListTree.runAsync({
    dicType: 1023,
    pageable: false,
  } as SysDicListDTO)
  enclosureOptions.push(...Object.values(enclosureList))
  const {data: detail} = await enclosureGet.runAsync({enclosureId: route.params.id})
  Object.assign(formData, detail)
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      const processOwnershipUnit = (target: {
        ownershipUnitCode: string | any[]
        ownershipUnitName: string
      }) => {
        if (Array.isArray(target.ownershipUnitCode)) {
          const targetCode = target.ownershipUnitCode[target.ownershipUnitCode.length - 1] ?? ''
          target.ownershipUnitName =
            findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
          target.ownershipUnitCode = targetCode
        }
      }
      processOwnershipUnit(paramsData)

      paramsData.enclosureTypeName =
        findValueByCustomId(paramsData.enclosureTypeCode, 'dicCode', 'dicName', enclosureOptions) ||
        ''
      const {msg} = await enclosureUpdate.runAsync({...paramsData})
      ElMessage.success(msg)
      router.push('/asset/management/enclosure-floor')
    } else {
      ElMessage.error('请填写完整楼栋基础信息')
    }
  })
}

const handleReset = () => router.push('/asset/management/enclosure-floor')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑围合
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
            <el-form-item label="围合名称" prop="enclosureName" required>
              <el-input v-model="formData.enclosureName" placeholder="请填写围合名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合编码" prop="enclosureId" required>
              <el-input v-model="formData.enclosureId" placeholder="请填写围合编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId" required>
              <el-select v-model="formData.projectId" placeholder="请选择所属项目" disabled>
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
              <el-input v-model="formData.projectId" placeholder="请填写项目编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合类型" prop="enclosureTypeCode" required>
              <el-select v-model="formData.enclosureTypeCode" placeholder="请选择围合类型">
                <el-option
                  v-for="item in enclosureOptions"
                  :key="item.dicCode"
                  :label="item.dicName"
                  :value="item.dicCode"
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
