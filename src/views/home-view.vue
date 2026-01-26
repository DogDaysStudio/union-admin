<script setup lang="tsx">
import {defineComponent, ref} from 'vue'

const name2 = ref('张三')

const DemoView = defineComponent({
  props: {
    gender: {type: String},
  },
  setup(props, ctx) {
    console.log('props', props, ctx)
    return () => {
      console.log('ctx.slots.default?.({go: 2})', ctx.slots.default?.())

      return (
        <div>
          {props.gender}
          <el-button type='primary'>按钮</el-button>
          {/* {ctx.slots.default?.({go: 2})} */}
        </div>
      )
    }
  },
})
</script>

<template>
  <main @click="name2 = '李四'">
    {{ name2 }}

    <!-- <DemoView v-for="index in 19" :key="index" :gender="`${index}`">
      <div class="hello">hello</div>
      <div>hello</div>
      <div>hello</div>
    </DemoView> -->
  </main>
</template>
