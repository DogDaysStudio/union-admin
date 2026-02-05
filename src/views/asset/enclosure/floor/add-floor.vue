<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {
  amsAssetProjectSelectAll,
  amsAssetEnclosureList,
  amsAssetFloorInsert,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 获取项目名称
const projectSelectAll = useRequest(amsAssetProjectSelectAll, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 围合下拉列表
const enclosureList = useRequest(amsAssetEnclosureList, {
  throttleInterval: 500,
})
const enclosureOptions = reactive<AssetEnclosureVO[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 新增楼层
const addFloor = useRequest(amsAssetFloorInsert, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

interface floorDTO {
  shopNumber: number | null // 每层商铺数
}

// 核心：定义围合完整类型 = 原有AssetBuildingDTO + 楼层扩展字段floorDTO
type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetFloorBaseDTO & AssetBuildingCompleteDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  assetId: {required: true, message: '请选择所属围合', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => getOptions())

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectSelectAll.runAsync()
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await companyListTree.runAsync({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
  const {data: enclosure} = await enclosureList.runAsync({pageable: false} as AssetEnclosureListDTO)
  enclosureOptions.push(...Object.values(enclosure))
}

// 定义商铺项的类型（规范TS类型，可选但推荐）
interface ShopItem {
  shopNumber: string // 商铺号（与商铺名一致）
  shopHeight: number // 商铺层高（与表单填写的层高一致）
  assetType: string
  ownershipUnitCode: string[] | undefined // 新增：产权单位（与楼层的级联选择值类型一致）
}

// 生成商铺数据：点击生成按钮触发
const handleGenerateShops = () => {
  // 1. 校验层高和商铺数是否有效
  const floorHeight = Number(formData.floorHeight) // 转数字（兼容输入框字符串）
  const shopCount = formData.shopNumber // 每层商铺数（el-input-number绑定的数字）

  // 校验规则：层高必须是有效数字、商铺数必须是正整数、两者都不能为空
  if (!shopCount || shopCount < 1) {
    ElMessage.warning('请填写有效的每层商铺数（正整数）')
    return
  }
  if (isNaN(floorHeight) || floorHeight <= 0) {
    ElMessage.warning('请填写有效的层高（大于0的数字）')
    return
  }

  // 2. 生成商铺数据数组
  const shopList: ShopItem[] = []
  for (let i = 1; i <= shopCount; i++) {
    // 补零生成商铺名/商铺号（001、002、003...格式）
    const shopNo = String(i).padStart(3, '0')
    shopList.push({
      shopNumber: shopNo,
      shopHeight: floorHeight, // 商铺层高与表单填写的层高一致
      assetType: '2',
      ownershipUnitCode:
        typeof formData.ownershipUnitCode === 'string'
          ? [formData.ownershipUnitCode]
          : formData.ownershipUnitCode,
    })
  }
  formData.shopList = shopList as unknown as AssetShopUpsertDTO[]
}

interface Shop {
  projectId: string
  shopNumber: string
  shopHeight: number
  ownershipUnitCode: []
  ownershipUnitName: string
}

const processOwnershipUnit = (
  obj: {ownershipUnitCode?: string | string[]; ownershipUnitName?: string},
  companyOptions: {dicId: string; dicName: string}[]
) => {
  if (!Array.isArray(obj?.ownershipUnitCode)) return
  const targetCode = obj.ownershipUnitCode[obj.ownershipUnitCode.length - 1] ?? ''
  obj.ownershipUnitName = findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
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
        if (!shop?.shopHeight) Flag = false
        processOwnershipUnit(shop, companyOptions)
      })
      if (Flag) {
        const {msg} = await addFloor.runAsync({...paramsData})
        ElMessage.success(msg)
        router.push('/asset/management/enclosure-floor')
      } else {
        ElMessage.warning('请填写层高')
      }
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}

const handleReset = () => router.push('/asset/management/enclosure-floor')
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
        <section-group title="楼层信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="楼层名称" prop="floorName" required>
                <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
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
              <el-form-item label="所属围合" prop="assetId" required>
                <el-select v-model="formData.assetId" placeholder="请选择所属围合">
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
                    value: 'dicId',
                    label: 'dicName',
                  }"
                  clearable
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
                  <el-input-number v-model="formData.shopNumber" placeholder="请填写每层商铺数" />
                  <el-button type="primary" class="ml-4" @click="handleGenerateShops">
                    生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-tree
            ref="treeRef"
            :data="formData.shopList"
            node-key="shopId"
            default-expand-all
            :props="{
              children: 'shopList',
            }"
            :expand-on-click-node="false"
          >
            <template #default="{data}">
              <el-row :gutter="24">
                <el-col :span="8">
                  商铺：
                  <el-input class="w-50!" v-model="data.shopNumber" />
                </el-col>
                <el-col :span="8">
                  层高：
                  <el-input-number
                    class="w-50!"
                    v-model="data.shopHeight"
                    placeholder="请输入层高"
                  />
                </el-col>
                <el-col :span="8">
                  产权单位：
                  <el-cascader
                    v-model="data.ownershipUnitCode"
                    placeholder="请选择产权单位"
                    :options="companyOptions"
                    :props="{
                      checkStrictly: true,
                      value: 'dicId',
                      label: 'dicName',
                    }"
                    clearable
                  />
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </section-group>

        <!-- 表单操作按钮：居中、间距 -->
        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
:deep() {
  .el-tree-node__content {
    height: 44px;
    line-height: 30px;
  }
}
</style>
