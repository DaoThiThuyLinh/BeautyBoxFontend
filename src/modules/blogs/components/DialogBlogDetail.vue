<template>
  <BaseDialog name="dialog-blog-detail" title="CHI TIẾT BẢN TIN" width="1200" class="dialog-blog-detail" :is-show-footer="false">
    <p class="my-6 text-center text-3xl font-bold">{{ blogDetail.data.detail[0].title }}</p>
    <div class="my-6 flex justify-center">
      <img :src="`https://image.hsv-tech.io/1040x662/${blogDetail.image}`" alt="" class="rounded-lg" />
    </div>
    <div class="mx-auto max-w-[800px]">
      <p v-html="blogDetail.data.detail[1].content"></p>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import type { IBlog } from '@/types/home.types'

  const { blogDetail = {} as IBlog } = defineProps<{
    blogDetail: IBlog
  }>()
</script>

<style scoped></style>
