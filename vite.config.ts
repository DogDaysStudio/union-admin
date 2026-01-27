import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import GenerateComponentName from 'unplugin-generate-component-name/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver({importStyle: 'sass'})],
    }),
    Components({
      resolvers: [ElementPlusResolver({importStyle: 'sass'})],
    }),
    GenerateComponentName({
      include: ['src/views/**/*.vue'],
      enter: [
        {
          include: ['src/views/**/*.vue'],
          exclude: ['src/views/**/components/**/*.vue'],
          genComponentName: ({attrName, dirname, originalName}) =>
            attrName ?? `${dirname}-${originalName}`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局注入自定义变量文件
        additionalData: `@use "@/assets/styles/element/variables.scss" as *;`,
      },
    },
  },
})
