<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetEnclosureList,
  amsAssetFloorList,
  amsAssetShopInsert,
  amsAssetShopList,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 围合列表
const {runAsync: enclosureList} = useRequest(amsAssetEnclosureList)
const enclosureOptions = reactive<{enclosureId: string; enclosureName: string}[]>([])
// 楼层列表
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 字典 [产权单位]
const companyOptions = useDicListTree({dicType: 1001})
// 商铺列表
const {runAsync: shopList} = useRequest(amsAssetShopList)
// 新增楼层
const {runAsync: shopInsert, loading: insertLoading} = useRequest(amsAssetShopInsert)

const formRef = ref<FormInstance>()

// 1. 商铺信息
interface ShopInfo {
  assetType: string
  shopNumber: string
  roomLayoutName: string
  projectId: string
  buildingArea: number
  usableArea: number
  ownershipUnitCode: string
  ownershipUnitName: string
}

// 2. 楼层信息
interface FloorInfo {
  projectId: string
  assetId: string
  floorId: string
  floorName: string
  shopNumber: number
  count: number
  children: ShopInfo[]
}

// 3. 基本信息
interface BaseInfo {
  projectId: string
  assetId: string
  floorId: string
  floorList: FloorInfo[]
}

const formData = reactive({floorList: []} as AssetShopInsertDTO & BaseInfo)

const formRules = reactive<FormRules>({
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'blur'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'blur'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

// 监听projectId变化，获取楼栋列表
watch(
  () => formData.projectId,
  async projectId => {
    enclosureOptions.length = 0
    formData.assetId = ''
    floorOptions.length = 0
    formData.floorId = ''
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

// 监听assetId变化，获取楼层列表
watch(
  () => formData.assetId,
  async assetId => {
    floorOptions.length = 0
    formData.floorId = ''
    if (assetId) {
      const {data: floor} = await floorList({
        pageable: false,
        assetType: '2',
        assetId,
      } as AssetFloorListDTO)
      floorOptions.push(...floor)
    }
  },
  {immediate: false}
)

// 生成楼层
const handleAddFloor = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const Flag = formData.floorList.find(e => e.floorId === formData.floorId)
      if (Flag) {
        ElMessage.warning('该楼层已生成！')
        return
      }
      const {data: shop} = await shopList({
        floorId: formData.floorId,
        pageable: false,
      } as AssetShopListDTO)
      formData.floorList.push({
        projectId: formData.projectId,
        assetId: formData.assetId,
        floorId: formData.floorId,
        floorName: shop[0].floorName,
        shopNumber: shop.length,
        count: null,
        children: [],
      })
    }
  })
}

// 生成商铺
const handleAddRoom = (data: FloorInfo) => {
  if (!data.count) {
    ElMessage.warning('请填写新商铺数量！')
    return
  }
  data.children = Array.from({length: data.count}, () => ({
    projectId: data.projectId,
    assetId: data.assetId,
    assetType: '2',
    floorId: data.floorId,
    shopNumber: '',
    buildingArea: null,
    usableArea: null,
    ownershipUnitCode: '',
    ownershipUnitName: '',
    roomLayoutName: '',
  }))
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData)) as AssetShopInsertDTO & BaseInfo
      if (!paramsData?.floorList) {
        ElMessage.warning('请生成楼层')
        return
      }
      let flag = true
      paramsData.shopList = []
      paramsData?.floorList.map(e => {
        e.children.map(k => {
          if (!k?.shopNumber || !k?.buildingArea || !k?.usableArea || !k?.ownershipUnitCode)
            flag = false
          paramsData.shopList.push(k as unknown as AssetShopUpsertDTO)
          if (Array.isArray(k.ownershipUnitCode)) {
            const targetCode = k.ownershipUnitCode[k.ownershipUnitCode.length - 1] ?? ''
            if (!targetCode) flag = false
            k.ownershipUnitName =
              findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
            k.ownershipUnitCode = targetCode
          }
        })
      })
      if (flag) {
        const {msg} = await shopInsert({shopList: paramsData.shopList})
        ElMessage.success(msg)
        router.push('/asset/management/shop')
      } else {
        ElMessage.warning('请填写商铺号、产权、建筑面积、实用面积！')
      }
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
              <el-form-item label="所属楼层" prop="floorId" required>
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
          </el-row>
        </section-group>

        <section-group title="商铺信息" inline>
          <template #extra>
            <el-button type="primary" @click="handleAddFloor">生成楼层</el-button>
          </template>
          <el-tree
            ref="treeRef"
            :data="formData.floorList"
            node-key="shopId"
            default-expand-all
            :props="{
              children: 'children',
            }"
            :expand-on-click-node="false"
          >
            <template #default="{data}">
              <div :gutter="24" v-if="data.children">
                <span class="ml-2">
                  楼层：
                  <el-input class="w-40!" v-model="data.floorName" disabled />
                </span>
                <span class="ml-2">
                  已有商铺数：
                  <el-input class="w-40!" v-model="data.shopNumber" disabled />
                </span>
                <span class="ml-2">
                  新增商铺数：
                  <el-input-number class="w-40!" v-model="data.count" :min="1" />
                  <el-button class="ml-2" type="primary" @click="handleAddRoom(data)">
                    生成商铺
                  </el-button>
                </span>
              </div>
              <div :gutter="24" v-else>
                <span class="ml-2">
                  商铺号：
                  <el-input class="w-40!" v-model="data.shopNumber" />
                </span>
                <span class="ml-2">
                  产权单位：
                  <el-cascader
                    class="w-40!"
                    v-model="data.ownershipUnitCode"
                    placeholder="请选择产权单位"
                    :options="companyOptions"
                    :props="{
                      checkStrictly: true,
                      value: 'dicCode',
                      label: 'dicName',
                    }"
                    clearable
                  />
                </span>
                <span class="ml-2">
                  建筑面积(㎡)：
                  <el-input-number class="w-40!" v-model="data.buildingArea" :min="0" />
                </span>
                <span class="ml-2">
                  实用面积(㎡)：
                  <el-input-number class="w-40!" v-model="data.usableArea" :min="0" />
                </span>
              </div>
            </template>
          </el-tree>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/shop')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
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
