<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {
  amsAssetProjectList,
  amsAssetBuildingList,
  amsAssetFloorList,
  amsAssetRoomInsert,
  amsAssetRoomList,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 楼栋列表
const {runAsync: buildList} = useRequest(amsAssetBuildingList)
const buildOptions = reactive<{buildingId: string; buildingName: string}[]>([])
// 楼层列表
const {runAsync: floorList} = useRequest(amsAssetFloorList)
const floorOptions = reactive<{floorId: string; floorName: string}[]>([])
// 字典 [户型 产权单位]
const {runAsync: dicListTree} = useRequest(iamCommonDicListTree)
const roomOptions = reactive<SysDicVO[]>([])
const companyOptions = reactive<SysDicVO[]>([])
// 房间列表
const {runAsync: roomList} = useRequest(amsAssetRoomList)
// 新增楼层
const {runAsync: addFloor, loading: insertLoading} = useRequest(amsAssetRoomInsert)

const formRef = ref<FormInstance>()

// 1. 房间信息
interface RoomInfo {
  assetType: string
  roomNumber: string
  roomLayoutCode: string
  roomLayoutName: string
  projectId: string
  buildingArea: number
  ownershipUnitCode: string
  ownershipUnitName: string
}

// 2. 楼层信息
interface FloorInfo {
  projectId: string
  assetId: string
  floorId: string
  floorName: string
  roomNumber: number
  roomLayoutCode: string
  count: number
  children: RoomInfo[]
}

// 3. 基本信息
interface BaseInfo {
  projectId: string
  assetId: string
  floorId: string
  roomLayoutCode: string
  floorList: FloorInfo[]
}

const formData = reactive({floorList: []} as AssetRoomInsertDTO & BaseInfo)

const formRules = reactive<FormRules>({
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'blur'},
  floorId: {required: true, message: '请选择所属楼层', trigger: 'blur'},
  roomLayoutCode: {required: true, message: '请选择户型', trigger: 'blur'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: roomList} = await dicListTree({
    dicType: 1024,
    pageable: false,
  } as SysDicListDTO)
  roomOptions.push(...Object.values(roomList))
  const {data: companyList} = await dicListTree({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
}

// 监听projectId变化，获取楼栋列表
watch(
  () => formData.projectId,
  async projectId => {
    buildOptions.length = 0
    formData.assetId = ''
    floorOptions.length = 0
    formData.floorId = ''
    if (projectId) {
      const {data: build} = await buildList({
        pageable: false,
        projectId,
      } as AssetBuildingListDTO)
      buildOptions.push(...Object.values(build))
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
        assetType: '1',
        assetId,
      } as AssetFloorListDTO)
      floorOptions.push(...Object.values(floor))
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
      const {data: room} = await roomList({
        floorId: formData.floorId,
        pageable: false,
      } as AssetRoomListDTO)
      formData.floorList.push({
        projectId: formData.projectId,
        assetId: formData.assetId,
        floorId: formData.floorId,
        floorName: room[0].floorName,
        roomNumber: room.length,
        roomLayoutCode: formData.roomLayoutCode,
        count: null,
        children: [],
      })
    }
  })
}

// 生成房间
const handleAddRoom = (data: FloorInfo) => {
  if (!data.count) {
    ElMessage.warning('请填写新增房间数量！')
    return
  }
  data.children = Array.from({length: data.count}, () => ({
    projectId: data.projectId,
    assetId: data.assetId,
    assetType: '1',
    floorId: data.floorId,
    roomNumber: '',
    roomLayoutCode: data.roomLayoutCode,
    buildingArea: null,
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
      const paramsData = JSON.parse(JSON.stringify(formData)) as AssetRoomInsertDTO & BaseInfo
      if (!paramsData?.floorList) {
        ElMessage.warning('请生成楼层')
        return
      }
      let flag = true
      paramsData.roomList = []
      paramsData?.floorList.map(e => {
        e.children.map(k => {
          if (!k?.roomNumber || !k?.buildingArea || !k?.ownershipUnitCode) flag = false
          k.roomLayoutName =
            findValueByCustomId(k.roomLayoutCode, 'dicCode', 'dicName', roomOptions) || ''
          paramsData.roomList.push(k as unknown as AssetRoomUpsertDTO)
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
        const {msg} = await addFloor({roomList: paramsData.roomList})
        ElMessage.success(msg)
        router.push('/asset/management/room')
      } else {
        ElMessage.warning('请填写房号、产权、面积！')
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
              <el-form-item label="所属楼栋" prop="assetId" required>
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属楼栋"
                  :disabled="!formData.projectId"
                >
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
            <el-col :span="8">
              <el-form-item label="户型" prop="roomLayoutCode" required>
                <el-select v-model="formData.roomLayoutCode" placeholder="请选择户型">
                  <el-option
                    v-for="item in roomOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="房间信息" inline>
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
                  <el-input class="w-50!" v-model="data.floorName" disabled />
                </span>
                <span class="ml-2">
                  已有房间数：
                  <el-input class="w-50!" v-model="data.roomNumber" disabled />
                </span>
                <span class="ml-2">
                  户型：
                  <el-select class="w-50!" v-model="data.roomLayoutCode" placeholder="请选择户型">
                    <el-option
                      v-for="item in roomOptions"
                      :key="item.dicCode"
                      :label="item.dicName"
                      :value="item.dicCode"
                    />
                  </el-select>
                </span>
                <span class="ml-2">
                  新增房间数：
                  <el-input-number class="w-50!" v-model="data.count" :min="1" />
                  <el-button class="ml-2" type="primary" @click="handleAddRoom(data)">
                    生成房间
                  </el-button>
                </span>
              </div>
              <div :gutter="24" v-else>
                <span class="ml-2">
                  房号：
                  <el-input class="w-50!" v-model="data.roomNumber" />
                </span>
                <span class="ml-2">
                  户型：
                  <el-select class="w-50!" v-model="data.roomLayoutCode" placeholder="请选择户型">
                    <el-option
                      v-for="item in roomOptions"
                      :key="item.dicCode"
                      :label="item.dicName"
                      :value="item.dicCode"
                    />
                  </el-select>
                </span>
                <span class="ml-2">
                  产权单位：
                  <el-cascader
                    class="w-50!"
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
                  面积：
                  <el-input-number class="w-50!" v-model="data.buildingArea" :min="0" />
                </span>
              </div>
            </template>
          </el-tree>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/room')">返回</el-button>
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
