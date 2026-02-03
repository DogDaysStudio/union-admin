<script setup lang="ts" generic="T">
/**
 * 使用 v-for 循环 slot 作用域会失效，所以要使用 #default="scope" 而不能解构
 * 且使用 scope 时需要需要使用可选链调用，如：scope?.index；用在事件、指令中除外
 *
 * @example
 * <!-- 如果要校验 nameList 不为空，可以在 uni-form-list 外套一层 el-form-item -->
 * <!-- <el-form-item label="姓名列表" prop="nameList" :rules="[rules.required()]"> -->
 * <uni-form-list v-model="formModel.nameList">
 *   <template #default="scope">
 *     <el-row :gutter="20" class="w-full mb-5">
 *       <el-col :span="12">
 *         <el-form-item
 *           label="姓名"
 *           :prop="`nameList.${scope?.index}.name`"
 *           :rules="[{required: true, message: '不能为空'}]"
 *         >
 *           <el-input v-model="scope.item.name" placeholder="请输入姓名" />
 *         </el-form-item>
 *       </el-col>
 *       <el-col :span="12">
 *         <el-form-item
 *           label="姓名"
 *           :prop="`nameList.${scope?.index}.name2`"
 *           :rules="[{required: scope?.index === 0, message: 'name2 不能为空'}]"
 *         >
 *           <el-input v-model="scope.item.name2" placeholder="请输入姓名" />
 *         </el-form-item>
 *       </el-col>
 *     </el-row>
 *   </template>
 *
 *   <!-- 也可以自定义增/删操作 -->
 *   <template #operation="{item, index, remove, add}">
 *     <div class="w-40">
 *       <el-button @click="remove(item)">删除</el-button>
 *       <el-button v-if="index === formModel.nameList?.length - 1" @click="add()">
 *         添加
 *       </el-button>
 *     </div>
 *   </template>
 *   <template #operation-default="{add}">
 *     <div class="w-40">
 *       <el-button @click="add()">添加</el-button>
 *     </div>
 *   </template>
 * </uni-form-list>
 */

const modelValue = defineModel<T[]>()
defineProps<{
  rowClass?: string
  itemClass?: string
  operationClass?: string
}>()

const add = (value?: Partial<T>) => {
  modelValue.value?.push((value || {}) as T)
}
const remove = (item: T) => {
  modelValue.value?.splice(modelValue.value?.indexOf(item), 1)
}

defineSlots<{
  // 列表项插槽
  default: (scope: {item: T; index: number; remove: typeof remove; add: typeof add}) => any
  // 操作插槽，列表为空时显示，也可以使用插槽自定义
  operation: (scope: {item: T; index: number; remove: typeof remove; add: typeof add}) => any
  // 空列表插槽
  'operation-default': (scope: {remove: typeof remove; add: typeof add}) => any
}>()
</script>

<template>
  <template v-if="modelValue?.length">
    <template v-for="(item, index) in modelValue" :key="index">
      <div class="flex flex-row w-full" :class="rowClass">
        <div class="flex-1" :class="itemClass">
          <slot v-bind="{item, index, remove, add}"></slot>
        </div>
        <slot name="operation" v-bind="{item, index, remove, add}">
          <div class="w-20" :class="operationClass">
            <el-button link type="danger" @click="remove(item)">删除</el-button>
            <el-button v-if="index === modelValue?.length - 1" link @click="add()">添加</el-button>
          </div>
        </slot>
      </div>
    </template>
  </template>
  <slot v-else name="operation-default" v-bind="{remove, add}">
    <el-button link @click="add()">添加</el-button>
  </slot>
</template>
