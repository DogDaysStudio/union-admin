// 这段可以直接添加到你的任何 `.ts` 文件中，例如 `router.ts`
// 也可以添加到一个 `.d.ts` 文件中。确保这个文件包含在
// 项目的 `tsconfig.json` 中的 "file" 字段内。

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 路由标题
     */
    title?: string

    /**
     * 是否显示在菜单中，最后一级才需要标记，带 children 的层级不需要配置
     * @default false
     */
    menu?: boolean

    /**
     * 根菜单，标记顶级菜单
     * @default false
     */
    root?: boolean
  }
}
