<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {amsAssetProjectList, amsAssetEnclosureInsert} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 获取项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 产权单位（公司） 围合类型
const companyOptions = useDicListTree({dicType: 1001})
const enclosureOptions = useDicListTree({dicType: 1023})
// 新增围合
const {runAsync: addEncloseure, loading: insertLoading} = useRequest(amsAssetEnclosureInsert)

const formRef = ref<FormInstance>()

interface floorDTO {
  aboveground: number | null // 地面层
  underground: number | null // 地下层
  shopNumber: number | null // 每层商铺数
}

type AssetEnclosureCompleteDTO = AssetEnclosureInsertDTO & floorDTO

const formData = reactive({} as AssetEnclosureInsertDTO & AssetEnclosureCompleteDTO)

const formRules = reactive<FormRules>({
  enclosureName: {required: true, message: '请填写围合名称', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  enclosureTypeCode: {required: true, message: '请选择围合类型', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

/**
 * 生成楼层商铺数据核心方法
 * @param index 当前楼栋在buildingList中的索引
 */
const generateFloorAndShop = () => {
  formRef.value.validate(async valid => {
    if (!valid) return

    const currentBuilding = formData
    const {aboveground, underground, shopNumber, ownershipUnitCode} = currentBuilding
    if (aboveground === undefined || underground === undefined || shopNumber === undefined) {
      ElMessage.warning('请填写有效的数值：地上层/地下层≥0，每层商铺数≥1')
      return
    }

    const floorData = []
    const defaultHeight = null // 商铺默认层高（保持原有逻辑）

    // 3. 生成地上楼层（倒序：如2层→1层，符合示例要求）
    for (let f = aboveground; f >= 1; f--) {
      const shopChildren = []
      // 生成当前楼层的商铺
      for (let r = 1; r <= shopNumber; r++) {
        shopChildren.push({
          assetType: '2',
          shopName: '',
          shopNumber: `${f}${r.toString().padStart(2, '0')}`,
          shopHeight: defaultHeight,
          shopList: undefined,
          ownershipUnitCode, // 赋值：商铺继承楼栋的产权单位编码
        })
      }
      // 推入地上楼层（新增ownershipUnitCode赋值）
      floorData.push({
        assetType: '2',
        floorName: `${f}层`,
        floorHeight: defaultHeight,
        shopList: shopChildren,
        ownershipUnitCode, // 赋值：楼层继承楼栋的产权单位编码
      })
    }

    // 4. 生成地下楼层（正序：B1层→B2层，符合示例要求）
    for (let f = 1; f <= underground; f++) {
      const shopChildren = []
      // 生成当前地下楼层的商铺
      for (let r = 1; r <= shopNumber; r++) {
        shopChildren.push({
          assetType: '2',
          shopName: '',
          shopNumber: `B${f}-${r.toString().padStart(3, '0')}`,
          shopHeight: defaultHeight,
          shopList: undefined,
          ownershipUnitCode, // 赋值：商铺继承楼栋的产权单位编码
        })
      }
      // 推入地下楼层（新增ownershipUnitCode赋值）
      floorData.push({
        assetType: '2',
        floorName: `B${f}层`,
        floorHeight: defaultHeight,
        shopList: shopChildren,
        ownershipUnitCode, // 赋值：楼层继承楼栋的产权单位编码
      })
    }

    // 5. 更新当前楼栋的floorData，ElTree会自动重新渲染并回显产权单位
    currentBuilding.floorList = floorData
  })
}

// 先完善TS接口：补全Floor、Shop的产权单位相关字段，保证类型匹配
interface Shop {
  projectId: string
  shopNumber: string
  shopHeight: number | null
  ownershipUnitCode: string | any[] // 支持数组（前端绑定）/字符串（提交后端）
  ownershipUnitName: string // 产权单位中文名称
}

interface Floor {
  floorHeight: number | null
  shopList: Shop[] // 楼层下的商铺列表，关联Shop接口
  ownershipUnitCode: string | any[] // 支持数组（前端绑定）/字符串（提交后端）
  ownershipUnitName: string // 产权单位中文名称
  floorName?: string // 兼容楼层名称字段
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      let Flag = true
      const paramsData = JSON.parse(JSON.stringify(formData))

      const processOwnershipUnit = (target: {
        ownershipUnitCode: string | any[]
        ownershipUnitName: string
      }) => {
        if (Array.isArray(target.ownershipUnitCode)) {
          const targetCode = target.ownershipUnitCode[target.ownershipUnitCode.length - 1] ?? ''
          if (!targetCode) Flag = false
          target.ownershipUnitName =
            findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
          target.ownershipUnitCode = targetCode
        }
      }

      processOwnershipUnit(paramsData)
      paramsData.enclosureTypeName =
        findValueByCustomId(paramsData.enclosureTypeCode, 'dicCode', 'dicName', enclosureOptions) ||
        ''
      // 1. 处理楼层数据
      paramsData.floorList?.forEach((floor: Floor) => {
        if (!floor?.floorHeight) Flag = false
        processOwnershipUnit(floor)
        // 2. 处理商铺数据
        floor.shopList?.forEach((shop: Shop) => {
          shop.projectId = paramsData.projectId
          if (!shop.shopHeight) Flag = false
          processOwnershipUnit(shop)
        })
      })

      if (Flag) {
        const {msg} = await addEncloseure({...paramsData})
        ElMessage.success(msg)
        router.push('/asset/management/enclosure-floor')
      } else {
        ElMessage.warning('请填写完整信息：层高、户型、产权单位为必填项')
      }
    } else {
      ElMessage.error('请填写完整楼栋基础信息')
    }
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        新增围合
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
              <el-form-item label="围合名称" prop="enclosureName" required>
                <el-input v-model="formData.enclosureName" placeholder="请填写围合名称" />
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
        </section-group>

        <section-group title="楼层信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="地面（层）">
                <div class="flex w-full">
                  <el-input-number
                    v-model="formData.aboveground"
                    placeholder="请填写地面（层）"
                    :min="0"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地下（层）">
                <div class="flex w-full">
                  <el-input-number
                    v-model="formData.underground"
                    placeholder="请填写地下（层）"
                    :min="0"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每层商铺数">
                <div class="flex w-full">
                  <el-input-number
                    v-model="formData.shopNumber"
                    placeholder="请填写每层商铺数"
                    :min="0"
                  />
                  <el-button type="primary" class="ml-4" @click="generateFloorAndShop">
                    生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-tree
            ref="treeRef"
            :data="formData.floorList"
            node-key="shopId"
            default-expand-all
            :props="{
              children: 'shopList',
            }"
            :expand-on-click-node="false"
          >
            <template #default="{data}">
              <el-row v-if="data.shopList" :gutter="24">
                <span class="ml-2">
                  楼层：
                  <el-input class="w-40!" v-model="data.floorName" />
                </span>
                <span class="ml-2">
                  层高：
                  <el-input-number
                    class="w-40!"
                    v-model="data.floorHeight"
                    placeholder="请输入层高"
                    :min="0"
                  />
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
              </el-row>
              <el-row v-else :gutter="24">
                <span class="ml-2">
                  商铺名称：
                  <el-input class="w-40!" v-model="data.shopName" />
                </span>
                <span class="ml-2">
                  商铺号：
                  <el-input class="w-40!" v-model="data.shopNumber" />
                </span>
                <span class="ml-2">
                  层高：
                  <el-input-number
                    class="w-40!"
                    v-model="data.shopHeight"
                    placeholder="请输入层高"
                  />
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
              </el-row>
            </template>
          </el-tree>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/enclosure-floor')">返回</el-button>
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
