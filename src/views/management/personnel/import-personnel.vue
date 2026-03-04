<template>
  <el-card>
    <template #header>导入项目</template>
    <import-data
      template-url="/iam/auth-user/template-export"
      check-url="/iam/auth-user/template-check"
      check-export-url="/iam/auth-user/template-check-export"
      import-url="/iam/auth-user/template-import"
      :title="{
        template: '填写导入员工的信息',
        // templateDesc: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除',
        upload: '上传填好的员工信息表',
        // uploadDesc: '文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M',
      }"
      @finish="console.log('finish')"
    ></import-data>
  </el-card>
</template>
