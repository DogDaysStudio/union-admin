# Vue + TypeScript 项目开发规范

## 概述

本文档为 Vue 3 + TypeScript + Element Plus + Axios + vue-request 项目提供完整的开发规范，旨在确保代码一致性、可维护性和高质量。

## 目录

- [代码风格规范](#代码风格规范)
- [TypeScript 规范](#typescript-规范)
- [Vue 组件规范](#vue-组件规范)
- [页面请求规范](#页面请求规范)
- [CSS 样式规范](#css-样式规范)
- [项目架构规范](#项目架构规范)
- [Git 规范](#git-规范)
- [代码质量检查](#代码质量检查)

---

## 代码风格规范

### 基本规则

1. **缩进**：使用 2 个空格进行缩进
2. **换行**：使用 LF (Unix 风格) 换行符
3. **行宽**：每行最大 100 字符
4. **分号**：不使用分号（项目已配置 Prettier）
5. **引号**：使用单引号（项目已配置 Prettier）
6. **对象括号**：不使用空格（项目已配置 Prettier）

### 命名规范

#### 文件和目录命名

- **组件文件**：使用 PascalCase（首字母大写），如 `HelloWorld.vue`
- **其他文件**：使用 kebab-case（短横线连接），如 `date-helper.ts`
- **目录**：使用 kebab-case（短横线连接），如 `components/icons/`

#### 变量和函数命名

- **变量**：使用 camelCase（小驼峰），如 `userData`
- **常量**：使用 UPPER_SNAKE_CASE（大写蛇形），如 `MAX_ITEMS`
- **函数**：使用 camelCase（小驼峰），如 `getUserData()`
- **类型/接口**：使用 PascalCase（首字母大写），如 `UserProfile`
- **枚举**：使用 PascalCase（首字母大写），成员使用 UPPER_SNAKE_CASE
- **私有属性**：使用 `_` 前缀，如 `_privateMethod()`

```typescript
// 好的命名
const MAX_ITEMS = 10
const userData = {
  firstName: 'John',
  lastName: 'Doe',
}

interface UserProfile {
  id: number
  email: string
}

function getUserData(): UserProfile {
  // ...
}
```

---

## TypeScript 规范

### 类型声明

#### 严格类型检查

项目已启用严格类型检查，禁止使用 `any` 类型：

```typescript
// 禁止
function processData(data: any) {
  // ...
}

// 推荐
interface DataStructure {
  id: number
  name: string
}

function processData(data: DataStructure) {
  // ...
}
```

#### 接口与类型别名

- 优先使用 `interface` 定义数据结构
- 使用 `type` 定义类型别名、联合类型和交叉类型

```typescript
// 接口（推荐用于对象类型）
interface Product {
  id: number
  name: string
  price: number
}

// 类型别名（推荐用于联合类型、交叉类型）
type Status = 'active' | 'inactive' | 'pending'
type ProductWithStatus = Product & {status: Status}
```

#### 可选属性

使用 `?` 标记可选属性，避免使用 `undefined` 类型联合：

```typescript
// 好的做法
interface User {
  id: number
  name: string
  email?: string // 可选属性
}
```

---

## Vue 组件规范

### 组件结构

#### SFC 基本结构

使用 `<script setup lang="ts">` 语法，按以下顺序组织代码：

```vue
<script setup lang="ts">
import {ref, computed} from 'vue'

// 1. 类型定义
interface Props {
  title: string
  subtitle?: string
}

// 2. Props 定义
const props = withDefaults(defineProps<Props>(), {
  subtitle: '默认副标题',
})

// 3. Emits 定义
const emit = defineEmits<{
  'update:model-value': [value: string]
  'item-click': [item: any, index: number]
}>()

// 4. 响应式数据
const count = ref(0)

// 5. 计算属性
const doubleCount = computed(() => count.value * 2)

// 6. 方法
const increment = () => {
  count.value++
  emit('update:model-value', String(count.value))
}
</script>

<template>
  <div class="component-name">
    <h1>{{ props.title }}</h1>
    <p>{{ props.subtitle }}</p>
    <el-button @click="increment">Count: {{ count }}</el-button>
  </div>
</template>

<style scoped>
.component-name {
  padding: 20px;
}
</style>
```

### Props 规范

- 使用 TypeScript 接口定义 Props 类型
- 使用 `withDefaults` 提供默认值
- Props 名称使用 camelCase
- 避免使用 `v-bind` 绑定简单类型

```typescript
// 推荐
interface Props {
  userId: number
  userName?: string
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Guest',
})
```

### Emit 规范

- 使用类型声明定义 Emit 事件
- 事件名称使用 kebab-case
- 事件处理函数使用 camelCase
- 使用 `defineEmits` 类型参数语法

```typescript
const emit = defineEmits<{
  'update:model-value': [value: string]
  'item-click': [item: Item, index: number]
}>()

// 调用
emit('item-click', item, index)
```

### 响应式数据

- 使用 `ref()` 定义基本类型响应式数据
- 使用 `reactive()` 定义对象类型响应式数据
- 避免过度使用 `ref()` 包装对象
- 大型数据使用 `shallowRef` 或 `shallowReactive` 优化性能

```typescript
// 基本类型
const count = ref(0)

// 对象类型（推荐使用 reactive）
const user = reactive<{name: string; age: number}>({
  name: 'John',
  age: 30,
})

// 大型数据（推荐使用 shallowRef）
const largeData = shallowRef({
  /* 大量数据 */
})
```

---

## 页面请求规范

### 基本规则

1. **统一使用 vue-request**：项目中所有页面请求必须使用 `vue-request` 库进行管理
2. **导入规范**：在组件中导入 `useRequest` 函数
3. **类型安全**：确保请求参数和返回值都有正确的 TypeScript 类型定义

### 核心功能使用

#### Loading 状态管理

- 使用 `useRequest` 返回的 `loading` 状态来控制 UI 加载状态
- 在表单提交、数据获取等操作中，使用 `:loading` 属性绑定到按钮或其他 UI 元素

```vue
<template>
  <el-button :loading="loading" @click="handleLogin">登录</el-button>
</template>

<script setup lang="ts">
import {useRequest} from 'vue-request'
import {iamAuth} from '@/service/api/iamAuth'

const {runAsync, loading} = useRequest(iamAuth.iamAuthLogin)

const handleLogin = async () => {
  await runAsync({
    /* 登录参数 */
  })
}
</script>
```

#### 节流和防抖

- **节流 (throttle)**：适用于频繁触发的操作，如获取验证码、搜索输入等
- **防抖 (debounce)**：适用于需要等待用户输入完成后再执行的操作

```typescript
// 节流示例 - 验证码获取
const reqImgCode = useRequest(iamAuth.iamAuthGetImgCode, {
  throttleInterval: 500, // 500ms 内最多执行一次
})

// 防抖示例 - 搜索
const reqSearch = useRequest(searchApi, {
  debounceInterval: 300, // 300ms 内无操作才执行
})
```

---

## CSS 样式规范

优先使用 Tailwind 写 CSS，而不是写在 <style></style> 中

### 使用原则

- **优先使用内置类**：尽量使用 Tailwind 提供的内置类，避免使用自定义值
- **避免过度定制**：如果已有合适的内置类（如 `px-3`），避免使用任意值（如 `px-[12px]`）
- **语义化命名**：使用语义化的类名，避免使用难以理解的简写
- **统一风格**：项目内保持一致的设计风格，使用相同的间距、颜色和字体

### 类名使用规范

#### 优先使用内置类

```vue
<!-- 推荐 -->
<div class="px-3 py-2">
  内容
</div>

<!-- 尽量避免 - 使用任意值替代内置类 -->
<div class="px-[12px] py-[8px]">
  内容
</div>
```

#### 避免过度使用任意值

```vue
<!-- 推荐 -->
<div class="bg-blue-500 text-white rounded-lg shadow-md">
  按钮
</div>

<!-- 禁止 - 过度使用任意值 -->
<div class="bg-[#2563eb] text-[#ffffff] rounded-[0.5rem] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
  按钮
</div>
```

### 自定义配置

- 仅在必要时扩展 Tailwind 配置
- 在 `tailwind.config.js` 中统一管理自定义配置
- 避免在组件中硬编码样式

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 性能优化

- 避免过度使用类名组合
- 合理使用 `@layer` 指令组织自定义样式
- 避免在模板中使用复杂的计算属性生成类名

```vue
<!-- 推荐 -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg">
  <h1 class="text-lg font-semibold">标题</h1>
  <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded">
    按钮
  </button>
</div>

<!-- 禁止 - 过度复杂的类名组合 -->
<div
  class="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
>
  <h1 class="text-lg font-semibold text-gray-900">标题</h1>
  <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
    按钮
  </button>
</div>
```

---

## 项目架构规范

### 目录结构

```
src/
├── assets/           # 静态资源
│   ├── base.css      # 基础样式
│   ├── logo.svg      # 项目 Logo
│   └── main.css      # 主样式
├── components/       # 通用组件
│   └── icons/        # 图标组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

### 导入规范

- 使用路径别名 `@/` 代替相对路径
- 导入顺序：Vue 核心 API → 第三方库 → 项目组件 → 样式

```typescript
// 禁止 - 相对路径
import {formatDate} from '../../utils/date-helper'

// 推荐 - 使用路径别名
import {formatDate} from '@/utils/date-helper'

// 推荐的导入顺序
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import '@/assets/main.css'
```

---

## Git 规范

### 分支命名

```
<type>/<description>
```

**类型说明：**

- `feature/` - 新功能开发
- `fix/` - 错误修复
- `refactor/` - 代码重构

**示例：**

```
feature/xx新功能开发
fix/修复xx错误
refactor/xx代码重构
```

### Commit 规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型说明：**

- `feat` - 新功能
- `fix` - 错误修复
- `docs` - 文档更新

**示例：**

```
feat: 添加用户管理页面 (#123)

- 新增用户列表组件
- 实现用户搜索功能
- 添加用户详情页面

BREAKING CHANGE: 移除了旧的用户API
```

### 代码提交检查

项目配置了以下提交前检查：

- TypeScript 类型检查
- ESLint 代码规范检查
- Oxlint 快速代码检查
- Prettier 格式化检查

---

## 代码质量检查

### 运行检查命令

```bash
# 启动开发服务器
pnpm run dev

# 构建项目（包括类型检查）
pnpm run build

# 预览构建结果
pnpm run preview

# TypeScript 类型检查
pnpm run type-check

# 代码规范检查和修复（oxlint + eslint）
pnpm run lint

# 仅运行 oxlint 检查
pnpm run lint:oxlint

# 仅运行 eslint 检查
pnpm run lint:eslint

# 格式化代码
pnpm run format
```

### 常见问题修复

1. **类型错误**

   ```bash
   pnpm run type-check
   # 查看并修复类型错误
   ```

2. **代码规范问题**

   ```bash
   pnpm run lint
   # 自动修复大部分规范问题
   ```

3. **格式化问题**
   ```bash
   pnpm run format
   # 自动格式化代码
   ```

---

## 最佳实践

### 性能优化

1. **避免过度渲染**
   - 使用 `v-memo` 优化列表渲染
   - 合理使用 `v-show`（频繁切换）和 `v-if`（条件渲染）
   - 避免在模板中使用复杂计算

2. **代码分割**
   - 使用动态导入优化首屏加载
   - 懒加载组件
   - 按需加载第三方库

3. **响应式优化**
   - 使用 `shallowRef` 和 `shallowReactive` 优化大型数据
   - 避免在计算属性中使用副作用
   - 使用 `toRefs` 解构响应式对象

### 组件设计

1. **单一职责原则**
   - 每个组件只负责一个功能

2. **可复用性**
   - 抽取通用逻辑到组合式函数
   - 设计可配置的组件接口

3. **可测试性**
   - 组件逻辑与 UI 分离
   - 使用组合式函数提高可测试性

### 安全建议

1. **XSS 防护**
   - 避免使用 `v-html`
   - 对用户输入进行适当转义

2. **API 安全**
   - 使用 HTTPS
   - 验证和消毒输入数据
   - 实现适当的权限控制

---

## 工具和插件

### 推荐的 VS Code 插件

- Vue Language Features (Volar)
- TypeScript Vue Plugin
- ESLint
- Prettier - Code formatter
- Oxlint
- Vite

### 配置文件

| 配置文件             | 用途                    |
| -------------------- | ----------------------- |
| `tsconfig.json`      | TypeScript 根配置       |
| `tsconfig.app.json`  | 应用 TypeScript 配置    |
| `tsconfig.node.json` | Node.js TypeScript 配置 |
| `vite.config.ts`     | Vite 构建配置           |
| `eslint.config.ts`   | ESLint 代码规范配置     |
| `.oxlintrc.json`     | Oxlint 代码检查配置     |
| `.prettierrc.json`   | Prettier 格式化配置     |
| `.editorconfig`      | 编辑器通用配置          |

---

## 总结

遵循这些规范可以帮助我们：

- 提高代码质量和一致性
- 减少错误和维护成本
- 提高团队协作效率
- 优化项目性能和用户体验

请务必遵守这些规范，并在代码审查过程中严格执行。
