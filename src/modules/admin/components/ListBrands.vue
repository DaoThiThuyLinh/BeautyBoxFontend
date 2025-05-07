<template>
  <BaseLoading v-if="isLoadingBrands" />
  <BaseEmpty v-else-if="!listBrands.length" class="mt-40" />
  <div v-else class="grid grid-cols-6 gap-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
    <div
      v-for="(item, index) in listBrands"
      :key="item.id"
      class="brand-card fade-in transform cursor-pointer rounded-lg bg-[#fafafa] p-4 transition duration-500 hover:scale-105 hover:bg-[#ffebd6]"
      :style="{ animationDelay: `${index * 200}ms` }"
    >
      <div class="flex items-center justify-center">
        <div class="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-lg">
          <img :src="item.imgUrl" :alt="item.name" class="first-image absolute top-0 left-0 h-[220px] w-[220px] object-cover" />
        </div>
      </div>
      <p class="mt-2 line-clamp-2 text-center font-medium">{{ item.name }}</p>
      <p v-html="item.description" class="line-clamp-3 text-sm text-gray-600"></p>
      <p><span class="text-sm font-medium">Tổng sản phẩm: </span> {{ item.totalProduct }}</p>

      <div v-if="isDesktop" class="action-buttons-wrapper flex items-center justify-center space-x-3">
        <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="emits('edit', item)" />
        <BaseIcon
          name="trash"
          class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
          @click="emits('delete', item)"
        />
      </div>

      <div v-else class="mt-6 flex items-center justify-center space-x-3">
        <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="emits('edit', item)" />
        <BaseIcon
          name="trash"
          class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
          @click="emits('delete', item)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IBrand } from '@/types/brand.types'

  import { useBaseStore } from '@/stores/base.store'

  const { listBrands, isLoadingBrands, isDesktop } = storeToRefs(useBaseStore())
  const emits = defineEmits<{
    edit: [category: IBrand]
    delete: [category: IBrand]
  }>()
</script>

<style lang="scss" scoped>
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .brand-card {
    position: relative;
    overflow: hidden;
  }

  .action-buttons-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-primary-dashboard-light);
    padding: 10px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .brand-card:hover .action-buttons-wrapper {
    transform: translateY(0);
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in-out forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
