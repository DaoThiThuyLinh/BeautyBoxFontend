<template>
  <div class="base-table">
    <template v-if="props.isLoading">
      <BaseLoading />
    </template>
    <ElTable
      v-else
      ref="table"
      class="custom-table"
      :empty-text="props.emptyText"
      :data="props.data"
      row-key="id"
      :row-class-name="rowClassName"
      :tree-props="treeProps"
      :load="load"
      :lazy="lazy"
      @row-click="handleRowClick"
      @select="handleSelectionChange"
      @select-all="handleSelectionAll"
      @cell-click="handleCellClick"
      @expand-change="(row: T, expandedRows: T[]) => emits('expand-change', row, expandedRows)"
    >
      <template #append>
        <slot name="append"></slot>
      </template>
      <template v-if="!props.data.length" #empty>
        <BaseEmpty class="my-10" />
      </template>
      <slot />
    </ElTable>
    <BasePagination
      v-if="showPagination && props.data.length && !props.isLoading"
      :query="query"
      :label="label"
      @limit-change="emits('limit-change', $event)"
      @page-change="emits('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import type { ElTable, TreeNode } from 'element-plus'

  import type { ITable } from '@/types/component.types'

  import BaseLoading from '../loading/BaseLoading.vue'

  interface IProp extends ITable<T> {
    rowClassName?: (value: any) => any
    treeProps?: { hasChildren?: string; children?: string; checkStrictly?: boolean }
    lazy?: boolean
    load?: (row: any, treeNode: TreeNode, resolve: (data: T[]) => void) => void
  }

  const props = withDefaults(defineProps<IProp>(), {
    loading: false,
    emptyText: 'There are no data',
    data: () => [],
    label: '',
    showPagination: true,
    query: () => ({ ...DEFAULT_QUERY_PAGINATION }),
    rowClassName: () => ({}),
    treeProps: () => ({}),
    lazy: false,
    load: () => ({})
  })
  const rowSelected = ref<T[]>([]) as Ref<T[]>
  const table = ref<InstanceType<typeof ElTable> | null>(null)
  defineExpose({ rowSelected, table })

  const emits = defineEmits<{
    'page-change': [page: number]
    'limit-change': [limit: number]
    'row-click': [row: T]
    'cell-click': [index: number]
    'selection-change': [value: T[]]
    'expand-change': [row: T, expandedRows: T[]]
  }>()

  const handleRowClick = (row: T) => {
    emits('row-click', row)
  }

  const handleCellClick = (_row: T, column: Record<string, any>) => {
    emits('cell-click', column.no)
  }

  const handleSelectionChange = (val: T[]) => {
    rowSelected.value = [...val]
    emits('selection-change', rowSelected.value)
  }

  const handleSelectionAll = (val: T[]) => {
    if (val.length) {
      rowSelected.value = [...val]
    } else {
      rowSelected.value = []
    }

    emits('selection-change', val)
  }

  // const tableRowClassName = (rowTable: Record<string, any>) => {
  //   const { row } = rowTable
  //   return rowSelected.value.find((element: Record<string, any>) => element.id == row.id) ? 'selected-row' : ''
  // }
</script>

<style scoped lang="scss">
  .base-table {
    :deep(.custom-table) {
      --el-table-header-bg-color: #fcfcfd;
      --el-table-border: 1px solid var(--border-primary);

      .el-checkbox {
        --el-checkbox-input-width: 20px;
        --el-checkbox-input-height: 20px;
        --el-checkbox-border-radius: 6px;
        --el-checkbox-checked-icon-color: #fff;
        .is-indeterminate {
          .el-checkbox__inner {
            border-color: var(--color-primary-dashboard);
            background-color: var(--color-primary-dashboard);
            &::before {
              top: 8px;
            }
          }
        }
      }
      .el-checkbox.is-checked {
        .el-checkbox__inner {
          border-color: var(--color-primary-dashboard);
          background-color: var(--color-primary-dashboard);
        }
      }

      .el-table__header-wrapper {
        .el-table__header {
          .el-table__cell {
            height: 46px;
            color: var(--color-text-primary);
            text-transform: uppercase;
            font-weight: 600;
            .cell {
              text-wrap: nowrap;
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-scrollbar {
          .el-scrollbar__view {
            display: flex !important;
            flex-direction: column-reverse;
          }
          .el-table__body {
            .el-table__row {
              cursor: pointer;
              .el-table__cell {
                height: 52px;
                color: var(--color-text-primary);
                .cell {
                  word-break: break-word;
                  font-size: 16px;
                }
              }
              .is-center {
                .cell {
                  display: flex;
                  justify-content: center;
                }
              }
              .dot-icon,
              .icon-delete,
              .icon-action {
                visibility: hidden;
              }

              &:hover {
                .dot-icon,
                .icon-delete,
                .icon-action {
                  visibility: visible;
                }
              }
            }
            .selected-row {
              background-color: var(--color-primary-dashboard);
            }
            .hide-selection {
              .el-checkbox {
                display: none;
              }
            }
            .el-table__expand-icon {
              font-size: 16px;
              height: 16px;
              width: 16px;
              i {
                font-size: 16px;
              }
            }
          }
          .el-table__append-wrapper {
            // height: 52px;
            // border-bottom: 1px solid var(--dr-border-primary);
            &:hover {
              background-color: var(--el-table-row-hover-bg-color);
            }
          }
        }
      }
    }
  }
</style>
