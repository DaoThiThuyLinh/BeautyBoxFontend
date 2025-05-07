<template>
  <div class="base-pagination my-6 flex">
    <div class="flex w-full items-center justify-between">
      <div v-if="isDesktop" class="w-full text-sm text-[#667085]">
        Hiển thị
        {{ formatNumber(props.query.total == 0 ? 0 : (props.query.pageIndex - 1) * props.query.pageSize + 1) }}
        -
        {{
          formatNumber(
            props.query.pageIndex * props.query.pageSize > props.query.total
              ? props.query.total
              : props.query.pageIndex * props.query.pageSize
          )
        }}
        /
        {{ formatNumber(props.query.total) }} {{ props.label }}
      </div>
      <div class="list-paging sm:w-full" :class="{ mobile: !isDesktop }">
        <div v-if="!isDesktop" class="option-list">
          <BaseSelect :placeholder="String(props.query.pageSize)" class="!w-[62px] opacity-100" @change="limitChangeHandle">
            <ElOption v-for="item in pageSizes" :key="item" :value="item"></ElOption>
          </BaseSelect>
        </div>
        <ElPagination
          :current-page="props.query.pageIndex"
          :page-sizes="pageSizes"
          :page-size="props.query.pageSize"
          :total="props.query.total"
          :pager-count="
            (() => {
              if (isDesktop) return 5
              else return 3
            })()
          "
          popper-class="select-pagination sm:flex sm:justify-end"
          background
          layout="sizes, prev, pager, next"
          @size-change="emits('limit-change', $event)"
          @current-change="emits('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElPagination } from 'element-plus'

  import type { IQuery } from '@/types/component.types'

  import formatNumber from '@/utils/formatNumber'

  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())
  const pageSizes: number[] = [10, 20, 50, 100]
  interface IProps {
    query?: IQuery
    label?: string
  }
  const props = withDefaults(defineProps<IProps>(), {
    query: () => ({
      pageIndex: 1,
      pageSize: 20,
      total: 0
    }),
    label: ''
  })
  const limitChangeHandle = (i: number) => {
    emits('limit-change', i)
  }
  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
  }>()
</script>

<style scoped lang="scss">
  .base-pagination {
    .list-paging.mobile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .option-list {
        height: 36px;
        width: 63px;
        :deep(.base-select) {
          max-height: 36px;
          width: 63px;
          .el-select {
            height: 38px;
            .el-input {
              height: 38px;
              .el-input__wrapper {
                justify-content: space-evenly;
                align-items: center;
                padding: 0 12px;
                .el-input__inner {
                  width: 22px;
                }
                .el-input__suffix {
                  margin: 0;
                  .el-select__caret {
                    margin: 0;
                  }
                }
              }
            }
          }
        }
      }
      :deep(.el-pagination) {
        button {
          height: 32px;
          width: 32px;
          margin: 0 8px;
          * {
            width: 16px;
            font-size: 16px;
          }
        }
        .el-pager {
          * {
            height: 32px;
            width: 32px;
          }
        }
        .el-pagination__sizes {
          display: none;
        }
      }
    }
    :deep(.list-paging) {
      display: flex;
      justify-content: end;
      .el-pagination__sizes {
        .el-select {
          .el-input {
            width: 114px;
            &:hover {
              .el-input__wrapper {
                border-color: var(--color-primary-dashboard);
              }
            }
            .el-input__wrapper {
              border: 1px solid var(--color-border-input);
              box-shadow: none;
              border-radius: 4px;
              padding-top: 0;
              padding-bottom: 0;
              height: 32px;
              // .el-input__inner {
              //   height: 38px;
              // }
            }
            .el-input__wrapper.is-focus,
            .el-input__wrapper.is-focus + .el-input-group__append {
              border-color: var(--color-primary-dashboard);
              box-shadow: none !important;
            }
          }
          .el-input.is-focus {
            .el-input__wrapper {
              box-shadow: none !important;
            }
          }
        }
      }
      .btn-prev,
      .btn-next {
        background-color: transparent;
        border: 1px solid var(--color-border-input);
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        &:hover {
          border-color: var(--color-primary-dashboard);
        }
        i {
          width: 20px;
          font-size: 20px;
          color: #667085;
        }
      }
      .el-pager {
        .number {
          height: 32px;
          width: 32px;
          border: 1px solid var(--color-border-input);
          border-radius: 4px;
          background-color: transparent;
          &:hover {
            border-color: var(--color-primary-dashboard);
            color: var(--color-primary-dashboard);
          }
        }
        .is-active {
          border-color: var(--color-primary-dashboard);
          color: var(--color-content);
          background-color: var(--color-primary-dashboard);
          &:hover {
            color: var(--color-content);
          }
        }
      }
    }
  }
</style>
