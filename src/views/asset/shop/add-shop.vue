<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetBuildingSelectBuildingEnclosure,
  amsAssetFloorList,
  amsAssetShopInsert,
  amsAssetShopList,
  amsAssetRoomList,
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
// 字典 [产权单位]
const companyOptions = useDicListTree({dicType: 1001})
// 商铺列表
const {runAsync: shopList} = useRequest(amsAssetShopList)
// 房间列表
const {runAsync: roomList} = useRequest(amsAssetRoomList)
// 新增楼层
const {runAsync: shopInsert, loading: insertLoading} = useRequest(amsAssetShopInsert)

const formRef = ref<FormInstance>()

// 1. 商铺信息
interface ShopInfo {
  assetType: string
  shopNumber: string
  projectId: string
  buildingArea: number
  usableArea: number
  splitNumber: number
  shopName: string
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
  assetId: {required: true, message: '请选择楼栋/围合', trigger: 'blur'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'blur'},
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
      const {data: asset} = await assetList({
        pageable: false,
        projectId,
      } as AssetBuildingListDTO)
      assetOptions.push(...Object.values(asset))
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
      let floorName = ''
      let total = 0
      if (assetType.value == '1') {
        const {data: room} = await roomList({
          floorId: formData.floorId,
          pageable: false,
        } as AssetRoomListDTO)
        total = room.length
        floorName = room[0].floorName
      } else {
        const {data: shop} = await shopList({
          floorId: formData.floorId,
          pageable: false,
        } as AssetShopListDTO)
        total = shop.length
        floorName = shop[0].floorName
      }

      formData.floorList.push({
        projectId: formData.projectId,
        assetId: formData.assetId,
        floorId: formData.floorId,
        floorName,
        shopNumber: total,
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
    splitNumber: null,
    shopName: '',
    ownershipUnitCode: '',
    ownershipUnitName: '',
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
          if (
            !k?.shopName ||
            !k?.shopNumber ||
            !k?.buildingArea ||
            !k?.usableArea ||
            !k?.ownershipUnitCode
          )
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
        ElMessage.warning('请填写商铺名称、商铺号、产权单位、建筑面积、实用面积、拆分数量！')
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
              <el-form-item label="所属楼栋/围合" prop="assetId" required>
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属楼栋/围合"
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

          <!-- table -->
          <el-table
            :data="formData.floorList"
            border
            default-expand-all
            :preserve-expanded-content="true"
            :row-key="row => row.floorId"
          >
            <el-table-column type="expand">
              <template #default="{row}">
                <div class="py-2 px-4 pl-12">
                  <el-table :data="row.children" border>
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
                    <el-table-column label="建筑面积(㎡)">
                      <template #default="{row}">
                        <el-input-number v-model="row.buildingArea" :min="0" />
                      </template>
                    </el-table-column>
                    <el-table-column label="实用面积(㎡)">
                      <template #default="{row}">
                        <el-input-number v-model="row.usableArea" :min="0" />
                      </template>
                    </el-table-column>
                    <el-table-column label="拆分数量">
                      <template #default="{row}">
                        <el-input-number v-model="row.splitNumber" :min="0" :precision="0" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="楼层" prop="floorName" />
            <el-table-column label="已有商铺数" prop="shopNumber" />
            <el-table-column label="新增商铺数">
              <template #default="{row}">
                <el-input-number v-model="row.count" :min="1" :precision="0" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="90">
              <template #default="{row}">
                <el-button link type="primary" @click="handleAddRoom(row)">生成商铺</el-button>
              </template>
            </el-table-column>
          </el-table>
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
    min-height: 40px;
    line-height: 30px;
  }
}
</style>
