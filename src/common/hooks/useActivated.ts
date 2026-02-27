import {onActivated, onDeactivated, onMounted, ref} from 'vue'

/**
 * 组件再次激活时执行 hook 函数（首次激活不执行）
 */
export function useActivated(hook: Function, options?: {immediate?: boolean}) {
  const enabled = ref(false)
  onActivated(() => {
    if (!enabled.value) return
    hook?.()
  })

  onDeactivated(() => {
    enabled.value = true
  })

  onMounted(() => {
    if (options?.immediate) {
      hook?.()
    }
  })
}
