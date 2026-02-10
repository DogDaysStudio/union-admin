<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {
  amsAssetProjectList,
  amsAssetBuildingList,
  amsAssetFloorList,
  amsAssetRoomInsert,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
// import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 获取项目列表
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋列表
const buildList = useRequest(amsAssetBuildingList, {
  throttleInterval: 500,
})
const buildOptions = reactive<{buildingId: string; buildingName: string}[]>([])
// 楼层列表
const floorList = useRequest(amsAssetFloorList, {
  throttleInterval: 500,
})
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 字典 户型
const roomListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const roomOptions = reactive<SysDicVO[]>([])
// 新增楼层
const addFloor = useRequest(amsAssetRoomInsert, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

interface floorDTO {
  projectId: string
  assetId: string
  floorId: string
  roomLayoutCode: string
}

// 核心：定义围合完整类型 = 原有AssetBuildingDTO + 楼层扩展字段floorDTO
type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetRoomInsertDTO & AssetBuildingCompleteDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'change'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'change'},
  roomLayoutCode: {required: true, message: '请选择户型', trigger: 'change'},
})

onMounted(() => getOptions())

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList.runAsync({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: build} = await buildList.runAsync({pageable: false} as AssetBuildingListDTO)
  buildOptions.push(...Object.values(build))
  const {data: floor} = await floorList.runAsync({
    pageable: false,
    assetType: '1',
  } as AssetFloorListDTO)
  floorOptions.push(...Object.values(floor))
  console.log(floorOptions, 'floorOptions')
  const {data: roomList} = await roomListTree.runAsync({
    dicType: 1024,
    pageable: false,
  } as SysDicListDTO)
  roomOptions.push(...Object.values(roomList))
}

// 生成商铺数据：点击生成按钮触发
const handleGenerateShops = () => {}

interface Shop {
  projectId: string
  shopNumber: string
  shopHeight: number
  ownershipUnitCode: []
  ownershipUnitName: string
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      let Flag = true
      const paramsData = JSON.parse(JSON.stringify(formData))
      paramsData.assetType = '2'
      paramsData.roomList?.forEach((shop: Shop) => {
        shop.projectId = paramsData.projectId
        if (!shop?.shopHeight) Flag = false
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
        新增
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
              <el-form-item label="所属楼栋" prop="assetId" required>
                <el-select v-model="formData.assetId" placeholder="请选择所属楼栋">
                  <el-option
                    v-for="item in buildOptions"
                    :key="item.buildingId"
                    :label="item.buildingName"
                    :value="item.buildingId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属楼层" prop="floorId" required>
                <el-select v-model="formData.floorId" placeholder="请选择所属楼层">
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
              <el-form-item label="户型" prop="roomLayoutCode" required>
                <el-select v-model="formData.roomLayoutCode" placeholder="请选择户型">
                  <el-option
                    v-for="item in roomOptions"
                    :key="item.dicId"
                    :label="item.dicName"
                    :value="item.dicId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="商铺信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="每层商铺数">
                <div class="flex w-full">
                  <!-- <el-input-number v-model="formData.shopNumber" placeholder="请填写每层商铺数" /> -->
                  <el-button type="primary" class="ml-4" @click="handleGenerateShops">
                    生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-tree
            ref="treeRef"
            :data="formData.roomList"
            node-key="shopId"
            default-expand-all
            :props="{
              children: 'roomList',
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
