<template>
  <div class="container mx-auto grid gap-10" :class="gridClass">
    <template v-for="(_item, index) in numberCardLoading" :key="index">
      <LoadingCard />
    </template>
  </div>
</template>

<script setup lang="ts">
  import LoadingCard from '@/components/base/loading/LoadingCard.vue'

  const { numberCardLoading = 5, gridClass = 'grid-cols-5' } = defineProps<{
    numberCardLoading?: number
    gridClass?: string
  }>()
</script>

<style scoped></style>
