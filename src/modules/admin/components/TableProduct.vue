<template>
  <BaseLoadingCard
    v-if="isLoading"
    :number-card-loading="isDesktop ? 5 : 2"
    :grid-class="isDesktop ? 'grid-cols-5' : 'grid-cols-2'"
  />
  <BaseEmpty v-else-if="listProducts.length === 0" class="mt-40" />
  <template v-else>
    <div class="grid grid-cols-5 gap-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
      <div
        v-for="(item, index) in listProducts"
        :key="item.id"
        class="product-card fade-in transform cursor-pointer rounded-lg bg-[#fafafa] p-4 transition duration-500 hover:scale-105 hover:bg-[#ffebd6]"
        :style="{ animationDelay: `${index * 200}ms` }"
      >
        <div @click="emits('click-product', item)">
          <div class="flex items-center justify-center">
            <div
              class="relative flex h-[260px] w-[260px] items-center justify-center overflow-hidden rounded-lg max-sm:h-[150px]"
              @mouseenter="hoveredItem = item.id"
              @mouseleave="hoveredItem = null"
            >
              <div class="image-container" :class="{ 'slide-active': hoveredItem === item.id }">
                <img
                  :src="item.images[0].image"
                  :alt="item.name"
                  class="first-image absolute top-0 left-0 h-full w-full object-cover max-sm:object-center"
                />
                <img
                  v-if="item.images.length > 1"
                  :src="item.images[1].image"
                  :alt="item.name"
                  class="second-image absolute top-0 left-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <p class="mt-2 line-clamp-2 text-center font-medium">{{ item.name }}</p>
          <p v-html="item.description" class="line-clamp-3 text-sm text-gray-600"></p>
          <div class="flex items-center justify-start">
            <ElRate v-model="item.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate" />
            <span class="text-sm">({{ item.reviewsResponse.totalNumRating }})</span>
          </div>
          <p class="text-sm">
            Đã bán: <span>{{ item.totalSold }}</span>
          </p>
        </div>
        <div v-if="isDesktop" class="action-buttons-wrapper flex items-center justify-center space-x-3">
          <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="emits('edit', item)" />
          <BaseIcon
            name="trash"
            class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
            @click="emits('delete', item)"
          />
        </div>
        <div v-else class="action-buttons-wrapper-mb mt-6 flex items-center justify-center space-x-3">
          <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="emits('edit', item)" />
          <BaseIcon
            name="trash"
            class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
            @click="emits('delete', item)"
          />
        </div>
      </div>
    </div>

    <BasePagination :query="query" @limit-change="emits('limit-change', $event)" @page-change="emits('page-change', $event)" />
  </template>
</template>

<script setup lang="ts">
  import type { IQuery } from '@/types/component.types'
  import type { IProductParent } from '@/types/product.types'

  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())

  const hoveredItem = ref<string | null>(null)

  const {
    listProducts = [],
    query = {
      pageIndex: 1,
      pageSize: 20,
      total: 0
    },
    isLoading = false
  } = defineProps<{
    listProducts: IProductParent[]
    query: IQuery
    isLoading: boolean
  }>()
  const emits = defineEmits<{
    'page-change': [page: number]
    'limit-change': [limit: number]
    'click-product': [data: IProductParent]
    edit: [product: IProductParent]
    delete: [product: IProductParent]
  }>()
</script>

<style scoped lang="scss">
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .first-image,
  .second-image {
    transition: transform 0.4s ease;
  }

  .second-image {
    transform: translateX(100%);
  }

  .slide-active .first-image {
    transform: translateX(-100%);
  }

  .slide-active .second-image {
    transform: translateX(0);
  }
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .rate {
    :deep(.el-rate__item) {
      .el-rate__icon {
        color: #c1c1c1;
      }
      .is-active {
        color: #f7ba2a;
      }
    }
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

  .product-card {
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

  .product-card:hover .action-buttons-wrapper {
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
