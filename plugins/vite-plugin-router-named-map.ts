import {Plugin} from 'vite'
import path from 'path'
import fs from 'fs'

type Route = {
  path: string
  name?: string
  children?: Route[]
  meta?: any
  redirect?: string
  component?: any
}

/**
 * 解析路由路径中的参数
 * @param routePath 路由路径，例如 /asset/management/project/:id
 * @returns 参数列表，例如 ['id']
 */
function parseRouteParams(routePath: string): string[] {
  const params: string[] = []
  const paramRegex = /:([^/:]+)/g
  let match

  while ((match = paramRegex.exec(routePath)) !== null) {
    // 提取参数名，移除可能的正则部分，例如将 'pathMatch(.*)*' 提取为 'pathMatch'
    let paramName = match[1]
    const paramNameEndIndex = paramName.indexOf('(')
    if (paramNameEndIndex > -1) {
      paramName = paramName.substring(0, paramNameEndIndex)
    }
    params.push(paramName)
  }

  return params
}

/**
 * 为路由生成 RouteRecordInfo 类型定义
 * @param route 路由对象
 * @returns RouteRecordInfo 类型定义字符串
 */
function generateRouteRecordInfo(route: Route): string {
  const path = route.path
  const name = route.name || path
  const params = parseRouteParams(path)

  // 生成 params 类型，例如 {id: string | number}
  const paramsRawType =
    params.length > 0 ? `{${params.map(param => `${param}: ParamValue<true>`).join('; ')}}` : 'any'

  // 生成 paramsRaw 类型，例如 {id: string}
  const paramsType =
    params.length > 0 ? `{${params.map(param => `${param}: ParamValue<false>`).join('; ')}}` : 'any'

  // 转义路径中的反斜杠，确保正则表达式部分正确处理
  const escapedPath = path.replace(/\\/g, '\\\\')
  const escapedName = name.replace(/\\/g, '\\\\')

  return `  '${escapedPath}': RouteRecordInfo<
    '${escapedName}',
    '${escapedPath}',
    ${paramsRawType},
    ${paramsType},
    never
  >`
}

/**
 * 递归处理路由数组，生成 RouteNamedMap 对象
 * @param routes 路由数组
 * @param parentPath 父路由路径
 * @returns RouteNamedMap 类型定义字符串
 */
function generateRouteNamedMap(routes: Route[], parentPath: string = ''): string {
  let routeNamedMap = ''
  const processedPaths = new Set<string>()

  function processRoutes(routeList: Route[], currentParentPath: string) {
    for (const route of routeList) {
      // 跳过空路径
      if (!route.path) {
        // 处理空路径的子路由
        if (route.children && route.children.length > 0) {
          processRoutes(route.children, currentParentPath)
        }
        continue
      }

      // 计算完整路径
      let fullPath: string
      if (route.path.startsWith('/')) {
        // 以 / 开头的路径，直接使用
        fullPath = route.path
      } else {
        // 不以 / 开头的路径，与父路径拼接
        if (currentParentPath === '') {
          fullPath = route.path
        } else {
          fullPath = `${currentParentPath}/${route.path}`
        }
      }

      // 跳过已处理的路径
      if (processedPaths.has(fullPath)) {
        continue
      }

      // 创建包含完整路径的临时路由对象
      const routeWithFullPath = {
        ...route,
        path: fullPath,
      }

      // 处理当前路由
      routeNamedMap += generateRouteRecordInfo(routeWithFullPath)
      routeNamedMap += '\n'
      processedPaths.add(fullPath)

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        processRoutes(route.children, fullPath)
      }
    }
  }

  processRoutes(routes, parentPath)

  // 最后一行去掉 \n
  routeNamedMap = routeNamedMap.replace(/\n$/, '')

  return routeNamedMap
}

export default function routerWatcherPlugin(): Plugin {
  let server: any = null
  let debounceTimer: NodeJS.Timeout | null = null
  const debounceTime = 800 // 0.8秒防抖

  return {
    name: 'vite-plugin-router-watcher',
    configureServer(_server) {
      server = _server

      // 监听 src/router 目录下的文件变化
      const routerDir = path.resolve(process.cwd(), 'src/router')
      // console.log(`[Router Watcher] Starting to watch directory: ${routerDir}`)

      // 使用 Vite 内置的文件监听器
      server.watcher.add(routerDir)

      server.watcher.on('change', (filePath: string) => {
        // 只处理路由目录下的文件变化
        if (filePath.startsWith(routerDir)) {
          // console.log(`[Router Watcher] File changed: ${filePath}`)
          // 向 web 发送消息
          if (server.ws) {
            server.ws.send({type: 'custom', event: 'router:changed', data: {filePath}})
            // console.log('[Router Watcher] Sent router:changed message to web')
          }
        }
      })

      // 监听 web 发送的消息
      if (server.ws) {
        server.ws.on('connection', (socket: any) => {
          socket.on('message', (data: any) => {
            try {
              const message = JSON.parse(data)
              if (message.type === 'custom' && message.event === 'router:updated') {
                // console.log('[Router Watcher] Received updated routes from web:')

                // 实现真正的防抖机制：清除之前的定时器，设置新的定时器
                if (debounceTimer) {
                  clearTimeout(debounceTimer)
                  // console.log('[Router Watcher] Cleared previous debounce timer')
                }

                // 保存当前的路由数据
                const routes = message.data.routes

                // 设置新的定时器，在 debounceTime 毫秒后执行生成操作
                debounceTimer = setTimeout(() => {
                  // console.log('[Router Watcher] Executing generation after debounce')

                  // 转换 routes 为 RouteNamedMap
                  const routeNamedMap = generateRouteNamedMap(routes)

                  // 生成完整的类型定义
                  const typeDefinition = `// 这段可以直接添加到你的任何 '.ts' 文件中，例如 'router.ts'
// 也可以添加到一个 '.d.ts' 文件中。确保这个文件包含在
// 项目的 'tsconfig.json' 中的 "file" 字段内。
import {RouteRecordInfo, RouteRecordName, ParamValue} from 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 'export' 声明
export interface RouteNamedMap {
${routeNamedMap}
}

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
`

                  // 保存到文件
                  const outputPath = path.resolve(process.cwd(), 'src/types/router.d.ts')
                  fs.writeFileSync(outputPath, typeDefinition)
                  console.log(`[Router Watcher] Generated RouteNamedMap and saved to ${outputPath}`)

                  // 打印转换结果
                  // console.log('[Router Watcher] Generated RouteNamedMap:')
                  // console.log(typeDefinition)

                  // 清除定时器
                  debounceTimer = null
                }, debounceTime)
              }
            } catch (error) {
              console.error('[Router Watcher] Error processing message:', error)
              // 忽略非 JSON 消息
            }
          })
        })
      }
    },
  }
}
