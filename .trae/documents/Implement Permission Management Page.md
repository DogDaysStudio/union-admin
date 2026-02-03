# 实现权限管理页面

## 项目结构分析

* 项目使用 Vue 3 + TypeScript + Element Plus + vue-request + Tailwind CSS

* 已存在类似的管理页面（如部门管理、项目管理）可参考

* API 定义位于 `src/types/api.d.ts`，包含权限相关接口

## 实现步骤

### 1. 创建 permission.vue 页面

* 使用 `<script setup lang="ts">` 语法

* 导入必要的依赖（Vue 核心 API、Element Plus、vue-request、API 服务）

### 2. 实现搜索表单

* 基于 `AuthPermissionListDTO` 类型创建搜索表单

* 包含字段：功能名称、所属平台、状态

* 实现搜索和重置功能

### 3. 实现数据表格

* 使用 `usePagination` 处理分页和数据获取

* 调用 `/iam/auth-permission/list` 接口，并把接口归在 iamAuth.ts 中

* 表格列包括：序号、功能编码、功能名称、功能类型、功能级别、父级名称、所属平台、所属端、所属服务、功能URL、排序值、更新时间、创建人、创建时间、状态、操作

* 实现状态切换功能（启用/禁用），切换前弹窗提示

### 4. 实现新增/编辑弹窗

* 创建共用弹窗组件

* 基于 `AuthPermissionUpsertDTO` 类型创建表单

* 包含字段：功能编码、功能名称、功能类型、功能级别、父级名称、所属平台、所属端、所属服务、功能URL、功能排序

* 实现表单验证和提交功能

### 5. 实现删除功能

* 调用 `/iam/auth-permission/delete` 接口

* 使用 `ElMessageBox` 实现删除确认

### 6. 实现其他功能

* 处理加载状态

* 实现错误提示

* 优化用户体验

## 技术要点

* 使用 `usePagination` 处理分页数据

* 使用 `useRequest` 处理 API 调用

* 使用 Element Plus 组件库构建 UI

* 使用 Tailwind CSS 进行样式设计

* 遵循项目的编码规范和命名约定

* 可参考 department.vue 实现

## 预期结果

* 完整的权限管理页面，包含搜索、列表展示、分页、新增、编辑、删除功能

* 与现有管理页面风格一致

* 符合项目的技术规范和编码标准

