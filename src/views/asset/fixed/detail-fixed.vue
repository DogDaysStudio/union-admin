<script setup lang="ts">
import {computed, onMounted, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetFixedGet} from '@/service/api/amsAsset'

const route = useRoute()
const router = useRouter()
const detail = reactive<Partial<AssetFixedVO>>({})
const {runAsync: fetchDetail, loading} = useRequest(amsAssetFixedGet)

const loadDetail = async () => {
  const fixedId = route.params.id as string
  if (!fixedId) return
  const {data} = await fetchDetail({fixedId})
  Object.assign(detail, data)
}

const detailConfig = computed(() => [
  {
    title: '基本信息',
    fields: [
      [
        {label: '固定资产名称', field: detail.fixedName},
        {label: '固定资产编码', field: detail.fixedId},
        {label: '序列号', field: detail.serialNumber},
      ],
      [
        {label: '资产类型', field: detail.fixedTypeName || detail.fixedTypeCode},
        {label: '设备类型', field: detail.deviceTypeName || detail.deviceTypeCode},
        {label: '品牌', field: detail.fixedBrand},
      ],
      [
        {label: '规格', field: detail.fixedSpecs},
        {label: '型号', field: detail.fixedModel},
        {label: '资产来源', field: detail.fixedSource},
      ],
      [
        {label: '购买日期', field: detail.purchaseDate},
        {label: '资产金额', field: detail.assetAmount},
        {label: '电梯速度(m/s)', field: detail.elevatorSpeed},
      ],
      [{label: '关联车位号', field: detail.parkingSpaceNo}],
    ],
  },
  {
    title: '位置信息',
    fields: [
      [
        {label: '所属项目', field: detail.projectName},
        {label: '楼栋/围合', field: detail.assetType},
        {label: '楼层', field: detail.floorName},
      ],
      [{label: '位置', field: detail.locationName}],
    ],
  },
  {
    title: '设备保障信息',
    fields: [
      [
        {label: '产权单位', field: detail.ownershipUnitName},
        {label: '设备管理员', field: detail.deviceManageUser},
        {label: '设备总监', field: detail.deviceMajordomoUser},
      ],
      [
        {label: '设备年检日期', field: detail.deviceCheckDate},
        {
          label: '设备启停状态',
          field:
            detail.deviceWorkState === undefined
              ? '-'
              : detail.deviceWorkState === 1
                ? '启用'
                : '停用',
        },
        {label: '注册登记日期', field: detail.registerDate},
      ],
      [
        {label: '设备安装日期', field: detail.deviceInstallDate},
        {label: '验收日期', field: detail.acceptanceDate},
        {label: '设备质保到期日', field: detail.warrantyExpireDate},
      ],
      [
        {label: '设备质保方名称', field: detail.warrantyCompany},
        {label: '设备质保方联系人', field: detail.warrantyLinkman},
        {label: '设备质保方联系方式', field: detail.warrantyPhone},
      ],
      [
        {label: '设备维保到期日', field: detail.maintenanceExpireDate},
        {label: '设备维保方名称', field: detail.maintenanceCompany},
        {label: '设备维保方联系人', field: detail.maintenanceLinkman},
      ],
      [
        {label: '设备维保方联系方式', field: detail.maintenancePhone},
        {label: '下次巡检日期', field: detail.nextPatrolDate},
        {label: '下次保养日期', field: detail.nextMaintenanceDate},
      ],
      [{label: '标签', field: detail.label}],
    ],
  },
])

onMounted(loadDetail)
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span>查看详情</span>
        <el-button
          type="primary"
          link
          @click="router.push(`/asset/management/fixed/edit/${detail.fixedId}`)"
        >
          编辑
        </el-button>
      </div>
    </template>

    <el-skeleton v-if="loading" :rows="10" animated />
    <div v-else class="space-y-6">
      <section-group v-for="group in detailConfig" :key="group.title" :title="group.title" inline>
        <el-row v-for="(row, rowIdx) in group.fields" :key="rowIdx" :gutter="24">
          <el-col v-for="(item, colIdx) in row" :key="colIdx" :span="8">
            <el-form-item :label="item.label">
              <span class="ml-4 text-gray-700">{{ item.field ?? '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </section-group>
    </div>
  </el-card>
</template>
