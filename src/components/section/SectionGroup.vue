<script setup lang="ts">
import {useSlots} from 'vue'

withDefaults(
  defineProps<{
    title?: string
    /**
     * 是否显示标题
     */
    header?: boolean
    headerClass?: string
    titleClass?: string
    contentClass?: string
    /**
     * 是否显示分隔线
     */
    divider?: boolean
    /**
     * 是否显示阴影
     */
    shadow?: boolean
    /**
     * 是否显示边框
     */
    border?: boolean
  }>(),
  {divider: true, shadow: true, border: true, header: true}
)

const slots = useSlots()
</script>

<template>
  <div class="el-card mb-3" :class="{'is-always-shadow': shadow, 'border-none!': !border}">
    <template v-if="header">
      <div
        class="section-group-header flex flex-row items-center justify-between min-h-14 py-2"
        :class="headerClass"
      >
        <div :class="titleClass">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="slots.extra">
          <slot name="extra"></slot>
        </div>
      </div>
      <el-divider v-if="divider" class="m-0!"></el-divider>
    </template>

    <div class="el-card__body" :class="contentClass">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.section-group-header {
  padding-left: var(--el-card-padding);
  padding-right: var(--el-card-padding);
}

.section-group-content {
  padding-left: var(--el-card-padding);
  padding-right: var(--el-card-padding);
}
</style>
