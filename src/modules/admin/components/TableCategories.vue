<template>
  <BaseLoading v-if="isLoadingCategories" />
  <BaseEmpty v-else-if="!listCategories.length" class="mt-40" />
  <ElTable v-else-if="isDesktop" :data="listCategories" row-class-name="table-row">
    <ElTableColumn label="#" type="index" width="64" />
    <ElTableColumn label="ID" prop="id" width="400" />
    <ElTableColumn label="TÊN" prop="name" />
    <ElTableColumn label="TỔNG SỐ SẢN PHẨM" prop="totalProduct" align="right" />
    <ElTableColumn align="right">
      <template #default="{ row }">
        <div class="flex items-center justify-center space-x-2">
          <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="emits('edit', row)" />
          <BaseIcon
            name="trash"
            class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
            @click="emits('delete', row)"
          />
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
  <template v-else>
    <div v-for="item in listCategories" :key="item.id">
      <BaseCollapse :is-show-divider-header="true">
        <template #title>
          <p class="mr-4 flex items-center justify-between">
            <span>{{ item.name }}</span>
            <span>{{ item.totalProduct }}</span>
          </p>
        </template>
        <div class="space-y-4">
          <p class="flex items-center justify-between">
            <span>ID</span>
            <span>{{ item.id }}</span>
          </p>
          <div class="flex items-center justify-end space-x-2">
            <BaseIcon
              name="edit"
              class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
              @click="emits('edit', item)"
            />
            <BaseIcon
              name="trash"
              class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
              @click="emits('delete', item)"
            />
          </div>
        </div>
      </BaseCollapse>
    </div>
  </template>
</template>
<script setup lang="ts">
  import type { ICategory } from '@/types/category.types'

  import { useBaseStore } from '@/stores/base.store'

  const { listCategories, isLoadingCategories, isDesktop } = storeToRefs(useBaseStore())
  const emits = defineEmits<{
    edit: [category: ICategory]
    delete: [category: ICategory]
  }>()
</script>

<style scoped lang="scss">
  :deep(.el-table__header-wrapper) {
    .el-table__header {
      .el-table__cell {
        color: var(--color-text-primary);
        text-transform: uppercase;
        font-weight: 600;
        font-size: 16px;
        .cell {
          text-wrap: nowrap;
        }
      }
    }
  }
  :deep(.table-row) {
    font-size: 16px;
    height: 46px;
  }
  :deep(.el-collapse) {
    border-top: none;
    .el-collapse-item {
      .el-collapse-item__header {
        padding-bottom: 16px;
      }
    }

    .el-collapse-item__wrap {
      border-top: 1px solid #dbdbdb;
      .el-collapse-item__content {
        padding-top: 12px;
      }
    }
  }
</style>
