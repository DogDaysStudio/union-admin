import fs from 'fs'
import path from 'path'

/**
 * @typedef {{name: string; description: string; properties: {name: string; type: string; description: string; required: boolean; isArray: boolean}[]}} ComponentSchema
 * @typedef {{prefix: string; path: string; method: string; reqType: string; reqTypeIsArray: boolean; resType: string; resTypeIsArray: boolean; summary: string; description: string; tags: string[]}} PathSchema
 * @typedef {{name: string; isArray: boolean}} ParseResult
 */

const apis = [
  {
    url: 'https://union-sit.anjueasy.com/iam/v3/api-docs?token=M0DIK8E6PYO7F5B9WRJANV2GCZQHSL1T',
    prefix: '/iam',
  },
  {
    url: 'https://union-sit.anjueasy.com/ams/v3/api-docs?token=M0DIK8E6PYO7F5B9WRJANV2GCZQHSL1T',
    // url:'http://172.24.163.130:9000/ams/v3/api-docs?token=M0DIK8E6PYO7F5B9WRJANV2GCZQHSL1T',
    prefix: '/ams',
  },
  {
    url: 'http://8.135.74.217:88/pms/v3/api-docs?token=M0DIK8E6PYO7F5B9WRJANV2GCZQHSL1T',
    // url:'http://172.24.163.130:9000/ams/v3/api-docs?token=M0DIK8E6PYO7F5B9WRJANV2GCZQHSL1T',
    prefix: '/pms',
  },
]
const outputPath = path.join(process.cwd(), 'src/types/api.d.ts')

/**
 *
 * @param {string} url
 * @returns {Object}
 */
function fetchOpenApiSpec(url) {
  // return JSON.parse(
  //   fs.readFileSync(path.join(process.cwd(), 'scripts/api-docs.example.json'), 'utf-8')
  // )
  return fetch(url).then(res => res.json())
}

function isSchema(schema) {
  return !!schema.items?.$ref || schema.$ref
}
/**
 *
 * @returns {ParseResult}
 */
function parseSchema(schema) {
  const ref = schema?.items?.$ref || schema?.$ref || ''
  let name = ref?.split('/')?.pop()
  let isArray = false
  if (name.startsWith('ResultModelList')) {
    isArray = true
    name = name.replace('ResultModelList', '')
  }
  if (name.startsWith('ResultModelSet')) {
    isArray = true
    name = name.replace('ResultModelSet', '')
  }
  if (name.startsWith('ResultModel')) {
    name = name.replace('ResultModel', '')
  }
  return {name: mapType(name), isArray}
}

/**
 * 映射 OpenAPI 类型到 TypeScript 类型
 * @param {string} type OpenAPI 类型
 * @returns {string} TypeScript 类型
 */
function mapType(type) {
  if (type?.startsWith('MapStringList'))
    return `Record<string, ${mapType(type.replace('MapStringList', ''))}[]>`
  if (type?.startsWith('MapString'))
    return `Record<string, ${mapType(type.replace('MapString', ''))}>`
  return (
    {
      Map: 'Record<string, any>',
      JSONObject: 'Record<string, any>',
      Object: 'Record<string, any>',
      object: 'Record<string, any>',
      Void: 'any',
      int: 'number',
      Int: 'number',
      integer: 'number',
      Integer: 'number',
      double: 'number',
      Double: 'number',
      long: 'number',
      Long: 'number',
      Boolean: 'boolean',
      bool: 'boolean',
      String: 'string',
      undefined: 'any',
    }[type] || type
  )
}

function parseRequestSchema(request) {
  return parseSchema(request?.content?.['application/json']?.schema)
}
function parseResponseSchema(response) {
  return parseSchema(response?.[200]?.content?.['*/*']?.schema)
}

/**
 * @returns {ComponentSchema[]}
 */
function parseComponents(openApiSpec) {
  return Object.entries(openApiSpec.components?.schemas || {})
    .filter(([name]) => !name.startsWith('ResultModel'))
    .map(([name, schema]) => ({
      name,
      description: schema.description,
      properties: Object.entries(schema.properties || {}).map(([name, prop]) => {
        const item = {
          name,
          description: prop.description,
          isArray: false,
          required: !schema.required ? true : schema.required?.includes(name),
          // type: prop.type, // todo:最后在做类型转化；$ref 转为对应的类型
          // isArray: prop.type === 'array', // todo: 完善 isArray 字段逻辑
        }
        if (isSchema(prop)) {
          const ref = parseSchema(prop)
          item.type = ref.name
          item.isArray = ref.isArray
        } else if (prop.items?.type) {
          item.type = mapType(prop.items.type)
        } else {
          item.type = mapType(prop.type)
        }
        if (prop.type === 'array') {
          item.isArray = true
        }
        return item
      }),
    }))
}

/**
 * 是否是 object:{}
 * @param {string} type
 * @returns {boolean}
 */
function isObjectDesc(type) {
  return /^object:{.*}$/.test(type)
}

/**
 * 将 object:{orgId:组织ID,enable:bool,enableNotes:原因} 解析成 {orgId:string;enable:boolean;enableNotes:string}
 * @param {string} type
 * @returns
 */
function parseObjectType(type) {
  if (isObjectDesc(type)) {
    try {
      // 尝试转换成json
      const obj = JSON.parse(type.replace(/^object:({.*})$/, '$1'))
      return `{${Object.entries(obj)
        .map(
          ([key, value]) =>
            `${key}: ${value === 'bool' ? 'boolean' : 'any'}${Array.isArray(value) ? '[]' : ''}`
        )
        .join('; ')}}`
    } catch {
      const obj = type.replace(/^object:{(.*)}$/, '$1')
      return `{${obj
        .split(',')
        .map(item => item.trim())
        .map(item => item.split(':'))
        .map(([key, value]) => `${key}: ${value === 'bool' ? 'boolean' : 'any'}`)
        .join('; ')}}`
    }
  }
  return null
}

/**
 * 解析 OpenAPI 规范中的路径
 * @param {Object} openApiSpec OpenAPI 规范
 * @returns {PathSchema[]}
 */
function parsePaths(openApiSpec, prefix = '') {
  const paths = []
  Object.entries(openApiSpec.paths)
    .filter(([path]) => path !== '/')
    .forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          const req = parseRequestSchema(operation.requestBody)
          const res = parseResponseSchema(operation.responses)
          paths.push({
            prefix,
            path,
            method,
            summary: operation.summary,
            description: operation.description,
            tags: operation.tags || [],
            reqType:
              req.name.startsWith('Record<') && isObjectDesc(operation.description)
                ? (parseObjectType(operation.description) ?? req.name)
                : req.name,
            reqTypeIsArray: req.isArray,
            resType: res.name,
            resTypeIsArray: res.isArray,
          })
        }
      })
    })
  return paths
}

/**
 * 路径转成驼峰命名
 * @param {string} path 路径
 * @returns {string} 驼峰命名
 */
function pathToCamelCase(path) {
  return path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, '-')
    .replace(/–/g, '-')
    .split('-')
    .map((item, i) => (i === 0 ? item : item[0].toUpperCase() + item.substr(1)))
    .join('')
}

/**
 * 生成 ApiType 行结果
 * @param {PathSchema[]} pathSchemas
 * @returns {string}
 */
function generateApiTypeRowsFromPathSchemas(pathSchemas) {
  return pathSchemas
    .map(
      path => `  /*${path.tags?.length ? ` 【${path.tags.join(', ')}】` : ''}
  // ${[path.summary, path.description].filter(Boolean).join(' | ')}
  export function ${pathToCamelCase(path.prefix + path.path)}(${path.reqType ? `payload: ${path.reqType}${path.reqTypeIsArray ? '[]' : ''}` : ''}) {return http.${path.method}<Res<${path.resType}${path.resTypeIsArray ? '[]' : ''}>>('${path.prefix}${path.path}'${path.reqType ? ', payload' : ''})}
  */
  '${path.prefix}${path.path}': {${[path.reqType ? `Req: ${path.reqType}${path.reqTypeIsArray ? '[]' : ''}` : '', path.resType ? `Res: ${path.resType}${path.resTypeIsArray ? '[]' : ''}` : ''].filter(Boolean).join('; ')}}`
    )
    .join('\n\n')
}

/**
 * 生成 interface 声明
 * @param {ComponentSchema[]} componentSchemas 组件 schema 列表
 * @returns {string}
 */
function generatorInterfaceFromComponents(componentSchemas) {
  return componentSchemas
    .map(
      schema => `${schema.description ? `// ${schema.description}\n` : ''}interface ${schema.name} {
  ${schema.properties.map(prop => `${prop.name}${prop.required ? '' : '?'}: ${prop.type}${prop.isArray ? '[]' : ''}${prop.description ? ` // ${prop.description}` : ''}`).join('\n  ')}
}`
    )
    .join('\n\n')
}

/**
 * 合并 apiType 和 apiInterface
 * @param {string} apiType
 * @param {string} apiInterface
 * @returns {string}
 */
function mergeTypeAndInterface(apiType, apiInterface) {
  return `interface Res<T = any> {
  code: number
  data: T
  msg: string
  pageNum: number
  pageSize: number
  total: number
}

interface ApiType {
${apiType}
}

${apiInterface}
`
}

/**
 * 只能存在唯一的 interface
 * @param {ComponentSchema[]} componentSchema
 * @param  {ComponentSchema[][]} componentSchemas
 */
function uniqueComponent(componentSchema, ...componentSchemas) {
  componentSchemas.forEach(schemas => {
    schemas.forEach(schema => {
      if (componentSchema.every(item => item.name !== schema.name)) {
        componentSchema.push(schema)
      }
    })
  })
  return componentSchema
}

async function main() {
  try {
    const results = await Promise.all(
      apis.map(async ({url, prefix}) => {
        console.log(`开始解析 ${url}`)
        const openApiSpec = await fetchOpenApiSpec(url)
        const pathSchemas = parsePaths(openApiSpec, prefix)
        const componentSchemas = parseComponents(openApiSpec)
        return {pathSchemas, componentSchemas}
      })
    )

    const apiType = generateApiTypeRowsFromPathSchemas(
      results.flatMap(({pathSchemas}) => pathSchemas)
    )
    const apiInterface = generatorInterfaceFromComponents(
      uniqueComponent([], ...results.map(({componentSchemas}) => componentSchemas))
    )

    const apiFileContent = mergeTypeAndInterface(apiType, apiInterface)

    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }

    fs.writeFileSync(outputPath, apiFileContent, 'utf-8')
    console.log(`api 类型生成成功：${outputPath}`)
  } catch (error) {
    console.error('Error generating API types:', error)
    process.exit(1)
  }
}

main()
