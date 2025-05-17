<template>
  <BaseTable
    v-if="isDesktop"
    :data="listProducts"
    :query="query"
    :is-loading="isLoading"
    class="mt-6"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
    @row-click="emits('click-product', $event)"
  >
    <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />
    <ElTableColumn label="Mã" prop="id" width="120">
      <template #default="{ row }">
        <span class="text-sm">{{ row.id }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Tên" prop="name" />
    <ElTableColumn label="Thể loại" prop="categoryName" />
    <ElTableColumn label="Thương hiệu" prop="brandName" />
    <ElTableColumn label="Số lượng đã bán" align="right" width="220">
      <template #default="{ row }">
        <span class="text-sm">{{ formatNumber(row.totalSold) }}</span>
      </template>
    </ElTableColumn>
  </BaseTable>

  <template v-else>
    <BaseLoading v-if="isLoading" />
    <BaseEmpty v-else-if="listProducts?.length === 0" />
    <template v-else>
      <div v-for="item in listProducts" :key="item.id">
        <BaseCollapse :is-show-divider-header="true">
          <template #title>
            <div class="mr-4 flex w-full items-center justify-between">
              <p class="flex flex-col gap-2 -space-y-8 text-left">
                <span>{{ item.name }}</span>
                <span>{{ item.id }}</span>
              </p>
              <span>{{ formatNumber(item.totalSold) }}</span>
            </div>
          </template>
          <div class="space-y-2">
            <p class="flex items-start justify-between">
              <span>Thể loại</span>
              <span class="text-right">{{ item.categoryName }}</span>
            </p>
            <p class="flex items-start justify-between">
              <span>Thương hiệu</span>
              <span class="text-right">{{ item.brandName }}</span>
            </p>
            <BaseButton type="secondary" class="mt-4 w-full" round-size="lg" @click="emits('click-product', item)"
              >Xem chi tiết</BaseButton
            >
          </div>
        </BaseCollapse>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
  import type { IQuery } from '@/types/component.types'
  import type { IProductParent } from '@/types/product.types'

  import formatNumber from '@/utils/formatNumber'
  import printIndex from '@/utils/printIndex'

  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())
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
  }>()
</script>

<style scoped lang="scss">
  :deep(.el-collapse) {
    border-top: none;
    .el-collapse-item__wrap {
      border-top: 1px solid #dbdbdb;
      .el-collapse-item__content {
        padding-top: 12px;
      }
    }
  }
</style>
