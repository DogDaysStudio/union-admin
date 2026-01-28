<script setup lang="tsx">
import {ref} from 'vue'

const name2 = ref('张三')

// const DemoView = defineComponent({
//   props: {
//     gender: {type: String},
//   },
//   setup(props, ctx) {
//     console.log('props', props, ctx)
//     return () => {
//       console.log('ctx.slots.default?.({go: 2})', ctx.slots.default?.())

//       return (
//         <div>
//           {props.gender}
//           <el-button type='primary'>按钮</el-button>
//           {/* {ctx.slots.default?.({go: 2})} */}
//         </div>
//       )
//     }
//   },
// })
</script>

<template>
  <main @click="name2 = '李四'">
    <el-form label-width="120" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item>
                  <el-input placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-input placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <DemoView v-for="index in 19" :key="index" :gender="`${index}`">
      <div class="hello">hello</div>
      <div>hello</div>
      <div>hello</div>
    </DemoView> -->
  </main>
</template>
