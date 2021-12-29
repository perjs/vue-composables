import { onMounted, onBeforeUnmount, reactive, watch } from 'vue'

interface Data {
  observer: IntersectionObserver | null;
  inViewport: boolean;
  isVisible: boolean;
}

interface PayloadObject {
  onChange: (inViewport: boolean) => void;
  offset?: number;
  enabled?: boolean;
  once?: boolean;
}

interface Ref<T = any> {
  value: T | null;
}

export default (element: Ref<HTMLElement>, {
  enabled = true, onChange = () => {
  }, offset = 100, once = true
}: PayloadObject) => {
  const data = reactive<Data>({
    observer: null,
    inViewport: false,
    isVisible: false
  })
  const isServer = typeof window === 'undefined'

  const bootstrap = () => {
    if (isServer || !element.value) {
      return
    }

    data.observer = new IntersectionObserver((entries) => {
      const ratio = Math.max(...entries.map(e => e.intersectionRatio))
      data.inViewport = ratio > 0
      onChange(data.inViewport)
    }, {
      threshold: new Array(101).fill(0).map((_zero, index) => {
        return index * 0.01
      }),
      // @ts-ignore
      rootMargin: [`${offset}px 0px`]
    })

    data.observer.observe(element.value)
  }

  watch(() => data.inViewport, (inViewport) => {
    if (inViewport && data.observer && once) {
      data.observer.disconnect()
    }
  })

  onMounted(() => {
    data.isVisible = !enabled

    if (enabled) {
      bootstrap()
    }
  })

  onBeforeUnmount(() => {
    const { observer } = data
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    ...data
  }
}
