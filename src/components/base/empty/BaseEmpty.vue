<template>
  <div v-if="prop.show" class="flex h-full flex-col items-center justify-center">
    <BaseIcon name="no-data" size="80" class="text-[var(--color-secondary)]" />
    <p class="mt-3 text-sm text-[var(--color-secondary)]">Không có dữ liệu</p>
  </div>
</template>

<script setup lang="ts">
  import BaseIcon from '../icon/BaseIcon.vue'

  interface IProp {
    show?: boolean
  }

  const prop = withDefaults(defineProps<IProp>(), {
    show: true
  })
</script>

<style scoped></style>
