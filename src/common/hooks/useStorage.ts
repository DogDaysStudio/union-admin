import {onMounted, ref} from 'vue'

/**
 * 本地存储 hook（手动保存）
 * @example
 * const {value, saveValue} = useLocalStorage('myKey', 'defaultValue')
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  onMounted(() => {
    const storageValue = localStorage.getItem(key)
    if (storageValue) {
      value.value = JSON.parse(storageValue)
    }
  })

  const saveValue = (val: T) => {
    value.value = val
    localStorage.setItem(key, JSON.stringify(val))
  }

  return {value, saveValue}
}
