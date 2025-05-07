<template>
  <BaseTable
    v-if="isDesktop"
    :data="listUsers"
    :query="query"
    :is-loading="isLoading"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
  >
    <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />
    <ElTableColumn label="Tên" prop="name" min-width="200" />
    <ElTableColumn label="Email" prop="email" min-width="280" />
    <ElTableColumn label="Số điện thoại" prop="phone" width="160" />
    <ElTableColumn label="Giới tính" prop="gender" width="100">
      <template #default="{ row }"
        ><span> {{ row.gender === 'MALE' ? 'Nam' : 'Nữ' }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Tổng số tiền mua hàng" prop="totalRevenue" align="right" width="240">
      <template #default="{ row }">
        <span> {{ formatCurrency(row.totalRevenue) }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Tổng số đơn hàng" prop="totalOrder" align="right" width="240">
      <template #default="{ row }">
        <span>{{ formatNumber(row.totalOrder) }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Ngày tạo" prop="createdAt" width="160">
      <template #default="{ row }">
        <span>{{ dateFormat(row.createdAt, 'DD/MM/YYYY HH:mm') }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn align="right" width="40">
      <template #default="{ row }">
        <div class="flex justify-end" @click.stop="handeViewOrder(row.id)">
          <BaseIcon name="eye" class="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-text-primary)]" />
        </div>
      </template>
    </ElTableColumn>
  </BaseTable>

  <template v-else>
    <BaseLoading v-if="isLoading" />
    <BaseEmpty v-else-if="listUsers?.length === 0" />
    <template v-else>
      <div v-for="item in listUsers" :key="item.id">
        <BaseCollapse :is-show-divider-header="true">
          <template #title>
            <div class="mr-4 flex w-full items-center justify-between">
              <p class="flex flex-col gap-2 -space-y-8 text-left">
                <span>{{ item.name }}</span>
                <span>{{ item.email }}</span>
              </p>
              <p>{{ formatCurrency(item.totalRevenue) }}</p>
            </div>
          </template>
          <div class="space-y-2">
            <p class="flex items-start justify-between">
              <span>Số điện thoại</span>
              <span class="text-right">{{ item.phone }}</span>
            </p>
            <p class="flex items-start justify-between">
              <span>Giới tính</span>
              <span class="text-right">{{ item.gender === 'MALE' ? 'Nam' : 'Nữ' }}</span>
            </p>
            <p class="flex items-start justify-between">
              <span>Tổng số đơn hàng</span>
              <span class="text-right">{{ formatNumber(item.totalOrder) }}</span>
            </p>
            <p class="flex items-start justify-between">
              <span>Ngày tạo</span>
              <span class="text-right">{{ dateFormat(item.createdAt, 'DD/MM/YYYY HH:mm') }}</span>
            </p>
            <p class="cursor-pointer text-right underline" @click="handeViewOrder(item.id)">Xem chi tiết đơn hàng</p>
          </div>
        </BaseCollapse>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
  import type { IQueryUsers, IUser } from '@/types/user.types'

  import dateFormat from '@/utils/dateFormat'
  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'
  import printIndex from '@/utils/printIndex'

  import { useBaseStore } from '@/stores/base.store'

  const router = useRouter()
  const { isDesktop } = storeToRefs(useBaseStore())
  const {
    listUsers = [],
    query = {
      pageIndex: 1,
      pageSize: 20,
      total: 0
    },
    isLoading = false
  } = defineProps<{
    listUsers: IUser[]
    query: IQueryUsers
    isLoading: boolean
  }>()

  const emits = defineEmits<{
    'page-change': [page: number]
    'limit-change': [limit: number]
  }>()

  const handeViewOrder = (userId: string) => {
    router.push({
      name: 'OrderByUser',
      params: {
        userId
      }
    })
  }
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
