## 实现 OpenAPI 到 TypeScript 接口生成脚本

### 功能概述

创建一个 Node.js 脚本，从 OpenAPI URL 获取 JSON 规范，并将其转换为 TypeScript 接口定义文件。

### 实现步骤

1. **完善** **`scripts/generator-api.js`** **文件**

   * 从 OpenAPI URL 获取 JSON 数据

   * 解析 OpenAPI 规范（paths、components/schemas）

   * 生成 TypeScript 接口定义

   * 输出到 `src/api.d.ts` 文件

2. **生成的文件结构**

   * `ApiType` 接口：包含所有 API 端点的映射（带注释的方法签名）

   * DTO 接口：所有请求和响应的数据结构

   * 支持嵌套类型和数组类型

   * 保留原始注释信息

3. **核心功能**

   * HTTP 请求获取 OpenAPI JSON

   * 类型转换逻辑（OpenAPI 类型 → TypeScript 类型）

   * 接口名称生成（PascalCase）

   * 文件写入操作

4. **使用方式**

   * 运行 `pnpm run generator-api` 执行脚本

   * 自动生成 `src/api.d.ts` 文件

### 技术要点

* 使用 Node.js 内置 `https` 或 `fetch` 模块获取数据

* 递归处理嵌套对象和数组

* 处理 OpenAPI 的 $ref 引用

* 生成符合项目规范的 TypeScript 代码

