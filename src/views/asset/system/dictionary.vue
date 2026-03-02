<script setup lang="ts">
import {ref, useTemplateRef, watch} from 'vue'
import LevelDict from './components/LevelDict.vue'
import KVDict from './components/KVDict.vue'

interface Tree {
  label: string
  value?: number | number
  children?: Tree[]
}

// SYS_TYPE(9000, 1, "系统分类"), // (union,ams,iam,eportal,pms,openapi,job)
// SYS_PERM_TYPE(9001, 1, "权限分类"),// (menu,api,button,data,file)

const sysDict = [
  {label: '系统分类', value: 9000},
  {label: '权限分类', value: 9001},
  {label: '性别', value: 9002},
]

const dict = [
  {label: '公司', value: 1001},
  {label: '资产分类', value: 1002},
  {label: '项目类型', value: 1003},
  {label: '位置', value: 1004},
  {label: '房间类型', value: 1005},
  {label: '客户来源', value: 1006},
  {label: '客户类型', value: 1007},
  {label: '设备类型', value: 1008},
  {label: '业务类型', value: 1009},
  {label: '广告类型', value: 1010},
  {label: '点位类型', value: 1011},
  {label: '媒体类型分类', value: 1012},
  {label: '停车场位置', value: 1013},
  {label: '车位类别', value: 1014},
  {label: '充电位', value: 1015},
  {label: '车位属性', value: 1016},
  {label: '供应商合作模式', value: 1017},
  {label: '供应商分类', value: 1018},
  {label: '企业性质', value: 1019},
  {label: '经营模式', value: 1020},
  {label: '筹集方式', value: 1021},
  {label: '产权性质', value: 1022},
  {label: '围合类型', value: 1023},
  {label: '户型', value: 1024},
  {label: '区域类别', value: 1025},
  {label: '停车方式', value: 1026},
  {label: '固定资产标签', value: 1027},
  {label: '资源业务标签', value: 1028},
  {label: '物业服务模式', value: 1029},
  {label: '平台', value: 1030},
]
const dictNameMap: Record<number, Partial<{[key in keyof SysDicVO]: string}>> = {
  ...Object.fromEntries([...sysDict, ...dict].map(item => [item.value, {dicName: item.label}])),
  1001: {
    dicName: '公司名称',
    dicNameShort: '公司简称',
    dicCode: '英文名称',
    dicCodeShort: '英文简称',
    dicPcode: '上级公司', // dicPcode 新增/编辑表单显示，数据列表不显示
    dicPname: '上级公司名称', // dicPname 数据列表显示，新增/编辑表单不显示
    dicNotes: '公司描述',
  },
  1018: {
    dicName: '供应商分类',
    dicCode: '分类编码',
    dicPcode: '供应商上级分类',
    dicPname: '供应商上级分类名称',
  },
  1002: {
    dicName: '资产分类',
    dicNameShort: '资产分类编码',
    dicCode: '资产类型',
    dicCodeShort: '资产类型编码',
    dicPcode: '上级资产',
  },
  1008: {
    dicName: '设备一级分类',
    dicNameShort: '一级分类编码',
    dicCode: '设备二级分类',
    dicCodeShort: '二级分类编码',
    dicPcode: '上级设备',
  },
}

const tree: Tree[] = [
  {
    label: '系统字典',
    value: 0,
    children: sysDict,
  },
  {
    label: '资产字典',
    value: 1,
    children: dict,
  },
]

const activeNode = ref(dict[0].value)

// const initState = {}

const filterText = ref('')
const treeRef = useTemplateRef('treeRef')
watch(filterText, val => {
  treeRef.value!.filter(val)
})
</script>

<template>
  <el-row :gutter="24">
    <el-col :span="6">
      <el-input v-model="filterText" placeholder="请输入关键字进行过滤" />
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="tree"
        @node-click="activeNode = $event.children?.length ? activeNode : $event.value"
        default-expand-all
        highlight-current
        node-key="value"
        :current-node-key="activeNode"
        :filter-node-method="(value, data) => (!value ? true : data.label.includes(value))"
      />
    </el-col>
    <el-col :span="18" :key="activeNode">
      <LevelDict
        v-if="[1001, 1018, 1002, 1008].includes(activeNode)"
        :dicType="activeNode"
        :dic-names="dictNameMap[activeNode]"
      />
      <KVDict v-else :dic-type="activeNode" :dic-names="dictNameMap[activeNode]" />
    </el-col>
  </el-row>
</template>
