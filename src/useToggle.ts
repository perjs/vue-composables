import { ref } from 'vue'
export default (showOnInit: boolean = false) => {
  const isVisible = ref(showOnInit)

  const show = () => {
    isVisible.value = true
  }
  const hide = () => {
    isVisible.value = false
  }
  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  return {
    show,
    hide,
    toggle,
    isVisible
  }
}
