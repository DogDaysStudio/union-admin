<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetEnclosureList,
  amsAssetFloorInsert,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 获取项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 围合下拉列表
const {runAsync: enclosureList} = useRequest(amsAssetEnclosureList)
const enclosureOptions = reactive<AssetEnclosureVO[]>([])
// 字典 产权单位（公司）
const companyOptions = useDicListTree({dicType: 1001})
// 新增楼层
const {runAsync: addFloor, loading: insertLoading} = useRequest(amsAssetFloorInsert)

const formRef = ref<FormInstance>()

interface floorDTO {
  shopNumber: number | null // 每层商铺数
}

type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

const formData = reactive({} as AssetFloorDTO & AssetBuildingCompleteDTO)

const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属围合', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

// 监听projectId变化，获取围合
watch(
  () => formData.projectId,
  async projectId => {
    enclosureOptions.length = 0
    formData.assetId = ''
    if (projectId) {
      const {data: enclosure} = await enclosureList({
        pageable: false,
        projectId,
      } as AssetEnclosureListDTO)
      enclosureOptions.push(...enclosure)
    }
  },
  {immediate: false}
)

// 定义商铺项的类型（规范TS类型，可选但推荐）
interface ShopItem {
  shopName: string
  shopNumber: string // 商铺号（与商铺名一致）
  shopHeight: number // 商铺层高（与表单填写的层高一致）
  assetType: string
  ownershipUnitCode: string[] | undefined // 新增：产权单位（与楼层的级联选择值类型一致）
}

// 生成商铺数据：点击生成按钮触发
const handleGenerateShops = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const shopList: ShopItem[] = []
    for (let i = 1; i <= formData.shopNumber; i++) {
      // 补零生成商铺名/商铺号（001、002、003...格式）
      const shopNo = String(i).padStart(3, '0')
      shopList.push({
        shopName: '',
        shopNumber: shopNo,
        shopHeight: formData.floorHeight,
        assetType: '2',
        ownershipUnitCode:
          typeof formData.ownershipUnitCode === 'string'
            ? [formData.ownershipUnitCode]
            : formData.ownershipUnitCode,
      })
    }
    formData.shopList = shopList as unknown as AssetShopUpsertDTO[]
  })
}

interface Shop {
  projectId: string
  shopName: string
  shopNumber: string
  shopHeight: number
  ownershipUnitCode: []
  ownershipUnitName: string
}

const processOwnershipUnit = (
  obj: {ownershipUnitCode?: string | string[]; ownershipUnitName?: string},
  companyOptions: {dicCode: string; dicName: string}[]
) => {
  if (!Array.isArray(obj?.ownershipUnitCode)) return
  const targetCode = obj.ownershipUnitCode[obj.ownershipUnitCode.length - 1] ?? ''
  obj.ownershipUnitName =
    findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
  obj.ownershipUnitCode = targetCode
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      let Flag = true
      const paramsData = JSON.parse(JSON.stringify(formData))
      processOwnershipUnit(paramsData, companyOptions)
      paramsData.assetType = '2'
      paramsData.shopList?.forEach((shop: Shop) => {
        shop.projectId = paramsData.projectId
        if (!shop?.shopName || !shop?.shopNumber || !shop?.shopHeight) Flag = false
        processOwnershipUnit(shop, companyOptions)
      })
      if (Flag) {
        const {msg} = await addFloor({...paramsData})
        ElMessage.success(msg)
        router.push('/asset/management/enclosure-floor')
      } else {
        ElMessage.warning('请填写商铺名称、商铺号、层高')
      }
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        新增楼层
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
        <section-group title="楼层信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="楼层名称" prop="floorName" required>
                <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="层高（m）" prop="floorHeight" required>
                <el-input-number v-model="formData.floorHeight" placeholder="请填写层高" :min="0" />
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
              <el-form-item label="所属围合" prop="assetId" required>
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属围合"
                  :disabled="!formData.projectId"
                >
                  <el-option
                    v-for="item in enclosureOptions"
                    :key="item.enclosureId"
                    :label="item.enclosureName"
                    :value="item.enclosureId"
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

        <section-group title="商铺信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="每层商铺数">
                <div class="flex w-full">
                  <el-input-number
                    v-model="formData.shopNumber"
                    placeholder="请填写每层商铺数"
                    :precision="0"
                    :min="1"
                  />
                  <el-button type="primary" class="ml-4" @click="handleGenerateShops">
                    生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- table -->
          <el-table :data="formData.shopList" border>
            <el-table-column label="商铺名称">
              <template #default="{row}">
                <el-input v-model="row.shopName" />
              </template>
            </el-table-column>
            <el-table-column label="商铺号">
              <template #default="{row}">
                <el-input v-model="row.shopNumber" />
              </template>
            </el-table-column>
            <el-table-column label="层高">
              <template #default="{row}">
                <el-input-number v-model="row.shopHeight" :min="1" />
              </template>
            </el-table-column>
            <el-table-column label="产权单位">
              <template #default="{row}">
                <el-cascader
                  v-model="row.ownershipUnitCode"
                  :options="companyOptions"
                  :props="{
                    checkStrictly: true,
                    value: 'dicCode',
                    label: 'dicName',
                  }"
                />
              </template>
            </el-table-column>
          </el-table>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/enclosure-floor')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
