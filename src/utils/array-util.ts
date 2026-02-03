/**
 * 根据自定义ID字段查询对应目标值（支持平级/树形结构，数字/字符串ID自动兼容）
 * @param targetId 要查询的ID值（支持数字/字符串，自动做类型兼容匹配）
 * @param idKey 数据源中的ID字段名（自定义，如id/key/code/value等，不再固定为id）
 * @param targetKey 要获取的目标字段名（如name/label/englishName等）
 * @param dataSource 数据源（平级数组 | 树形结构数组，任意层级嵌套）
 * @param childrenKey 树形结构的子节点字段名，默认children，可自定义（如roomList/childrenList）
 * @returns 匹配到的目标字段值，未匹配/异常场景返回null
 */
export function findValueByCustomId(
  targetId: number | string,
  idKey: string,
  targetKey: string,
  dataSource: Record<string, any>[],
  childrenKey: string = 'children'
): any | null {
  // 核心容错1：数据源非数组/空数组，直接返回null
  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    return null
  }
  // 核心容错2：ID字段/目标字段为空，直接返回null（避免无效查询）
  if (!idKey || !targetKey) {
    return null
  }

  // 统一ID类型为字符串，解决数字/字符串ID不匹配问题（如1和'1'视为同一个ID）
  const targetIdStr = String(targetId)

  // 递归遍历逻辑：支持任意层级树形结构，匹配到结果立即终止递归
  const recursiveFind = (arr: Record<string, any>[]): any | null => {
    for (const item of arr) {
      // 匹配ID：先判断当前项是否有该ID字段，再统一转字符串对比（兼容所有类型ID）
      if (item[idKey] !== undefined && String(item[idKey]) === targetIdStr) {
        // 目标字段存在则返回值，不存在返回null（兜底）
        return item[targetKey] ?? null
      }
      // 存在子节点且为数组，递归查询子节点（深度优先）
      if (item[childrenKey] && Array.isArray(item[childrenKey])) {
        const childResult = recursiveFind(item[childrenKey])
        // 子节点匹配到结果，立即返回（避免无效遍历，提升性能）
        if (childResult !== null) {
          return childResult
        }
      }
    }
    // 遍历完当前层级无匹配，返回null
    return null
  }

  return recursiveFind(dataSource)
}
