<template>
  <div class="base-icon" :style="{ width: size + 'px' }" @click="emit('click')">
    <component :is="icon"></component>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    name: string
    size?: string | number
  }
  const props = withDefaults(defineProps<IProps>(), {
    name: '',
    size: 20
  })
  const emit = defineEmits<{
    click: []
  }>()
  const icons = import.meta.glob(`@/icons/*.svg`)
  const icon = shallowRef<unknown | null>(null)

  watch(
    () => props.name,
    () => {
      loadIcon()
    }
  )

  onMounted(() => {
    loadIcon()
  })

  const loadIcon = () => {
    //@ts-ignore
    icon.value = defineAsyncComponent(async () => {
      try {
        const key = `/src/icons/${props.name}.svg`
        if (!icons[key]) {
          throw new Error(`Icon ${props.name} not found`)
        }
        return icons[key]()
      } catch (error) {
        console.error(error)
      }
    })
  }
</script>

<style scoped></style>
