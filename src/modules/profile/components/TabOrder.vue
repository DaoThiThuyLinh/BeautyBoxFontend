<template>
  <div class="mt-6">
    <BaseTable
      v-if="isDesktop"
      :data="orders"
      :query="query"
      :is-loading="isLoading"
      @limit-change="handleChange('pageSize', $event)"
      @page-change="handleChange('pageIndex', $event)"
    >
      <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />
      <ElTableColumn label="Tên sản phẩm" min-width="200">
        <template #default="{ row }">
          <div class="flex flex-col gap-2">
            <div v-for="item in row.orderItemsResponse" :key="item.id" class="flex items-center gap-2">
              <img :src="item.imageUrl" alt="" class="h-10 w-10 rounded-lg" />
              <p class="flex flex-col gap-1">
                <span class="text-sm">{{ item.productName }}</span>
                <span class="text-xs">{{ item.productDetailName }} x {{ item.quantity }}</span>
              </p>
            </div>
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn label="Giá" align="right" min-width="120">
        <template #default="{ row }">
          <div class="flex flex-col items-end gap-2">
            <div v-for="item in row.orderItemsResponse" :key="item.id" class="flex items-center gap-2">
              <p></p>
              <p class="flex h-10 items-center justify-center text-sm">{{ formatCurrency(item.newPrice) }}</p>
            </div>
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn label="Tổng tiền" prop="totalAmount" align="right" min-width="120">
        <template #default="{ row }">
          <span class="text-sm font-semibold">{{ formatCurrency(row.totalAmount) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Ngày đặt hàng" prop="orderTime" min-width="160">
        <template #default="{ row }">
          <span class="text-sm">{{ dateFormat(row.orderTime, 'DD/MM/YYYY HH:mm') }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Trạng thái" prop="status" width="180">
        <template #default="{ row }">
          <span class="text-sm" :class="toSlug(row.status)">{{ row.status }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="tabActive === 'PENDING' || tabActive === 'ALL'" align="right" width="60">
        <template #default="{ row }">
          <template v-if="row.status === 'Chờ xác nhận'">
            <div v-if="isCancelOrder && cancelOrderId === row.id" class="flex items-center justify-center">
              <div class="is-loading">
                <BaseIcon name="loading" />
              </div>
            </div>
            <BaseIcon
              v-else
              name="x"
              class="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-text-primary)]"
              size="20"
              @click="handleCancelOrder(row.id)"
            />
          </template>
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="tabActive === 'DELIVERED' || tabActive === 'ALL'" align="right" width="100">
        <template #default="{ row }">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col items-end gap-2">
              <div v-for="item in row.orderItemsResponse" :key="item.id" class="flex items-center gap-2">
                <p></p>
                <p
                  v-if="row.status === 'Đã nhận'"
                  class="flex h-10 items-center justify-center text-sm underline"
                  @click="handleReview(item)"
                >
                  Đánh giá
                </p>
              </div>
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="tabActive === 'WAITING_FOR_PAYMENT' || tabActive === 'ALL'" align="right" width="160">
        <template #default="{ row }">
          <p v-if="row.status === 'Chờ thanh toán'" class="text-right text-sm underline" @click="handlePayment(row.id)">
            Thanh toán
          </p>
        </template>
      </ElTableColumn>
    </BaseTable>

    <template v-else>
      <BaseLoading v-if="isLoading" />
      <BaseEmpty v-else-if="orders?.length === 0" />
      <template v-else>
        <div v-for="item in orders" :key="item.id">
          <BaseCollapse :is-show-divider-header="true">
            <template #title>
              <div class="mr-4 flex w-full justify-between">
                <div class="flex flex-col gap-2">
                  <div v-for="_item in item.orderItemsResponse" :key="_item.id" class="flex items-center gap-2">
                    <img :src="_item.imageUrl" alt="" class="h-10 w-10 rounded-lg" />
                    <p class="flex flex-col gap-1 text-left">
                      <span class="text-sm">{{ _item.productName }}</span>
                      <span class="text-xs">{{ _item.productDetailName }} x {{ _item.quantity }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <div v-for="_item in item.orderItemsResponse" :key="_item.id" class="flex items-center gap-2">
                    <p></p>
                    <p class="flex h-10 items-center justify-center text-sm">{{ formatCurrency(_item.newPrice) }}</p>
                  </div>
                </div>
              </div>
            </template>
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <p>Tổng tiền</p>
                <p class="text-right text-sm font-semibold">{{ formatCurrency(item.totalAmount) }}</p>
              </div>
              <div class="flex items-start justify-between">
                <p>Ngày đặt hàng</p>
                <span class="text-right text-sm">{{ dateFormat(item.orderTime, 'DD/MM/YYYY HH:mm') }}</span>
              </div>
              <div class="flex items-start justify-between">
                <p>Trạng thái</p>
                <span class="text-right text-sm" :class="toSlug(item.status)">{{ item.status }}</span>
              </div>
              <template v-if="tabActive === 'PENDING' || tabActive === 'ALL'">
                <template v-if="item.status === 'Chờ xác nhận'">
                  <div class="flex justify-end">
                    <div v-if="isCancelOrder && cancelOrderId === item.id" class="flex items-center justify-center">
                      <div class="is-loading">
                        <BaseIcon name="loading" />
                      </div>
                    </div>
                    <BaseButton v-else type="outline" round-size="lg" class="w-24" @click="handleCancelOrder(item.id)"
                      >Hủy</BaseButton
                    >
                  </div>
                </template>
              </template>

              <template v-if="tabActive === 'DELIVERED' || tabActive === 'ALL'">
                <div class="flex flex-col gap-2">
                  <div v-for="_item in item.orderItemsResponse" :key="_item.id" class="flex justify-between">
                    <div class="flex items-center gap-2">
                      <img :src="_item.imageUrl" alt="" class="h-10 w-10 rounded-lg" />
                      <p class="flex flex-col gap-1 text-left">
                        <span class="text-sm">{{ _item.productName }}</span>
                        <span class="text-xs">{{ _item.productDetailName }} x {{ _item.quantity }}</span>
                      </p>
                    </div>
                    <p
                      v-if="item.status === 'Đã nhận'"
                      class="flex h-10 items-center justify-center text-sm underline"
                      @click="handleReview(_item)"
                    >
                      Đánh giá
                    </p>
                  </div>
                </div>
              </template>
              <template v-if="tabActive === 'WAITING_FOR_PAYMENT' || tabActive === 'ALL'">
                <p v-if="item.status === 'Chờ thanh toán'" class="text-right text-sm underline" @click="handlePayment(item.id)">
                  Thanh toán
                </p>
              </template>
            </div>
          </BaseCollapse>
        </div>
        <BasePagination
          :query="query"
          @limit-change="handleChange('pageSize', $event)"
          @page-change="handleChange('pageIndex', $event)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import router from '@/router'
  import { apiOrder } from '@/services'

  import type { IOrder, IOrderItem, IParamsOrder } from '@/types/order.types'

  import dateFormat from '@/utils/dateFormat'
  import formatCurrency from '@/utils/formatCurrency'
  import printIndex from '@/utils/printIndex'
  import toSlug from '@/utils/toSlug'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())
  const { userInfo } = storeToRefs(useAuthStore())
  const { tabActive = '' } = defineProps<{
    tabActive: string
  }>()

  const status = computed(() => {
    switch (tabActive) {
      case 'ALL':
        return ''
      case 'PENDING':
        return '1'
      case 'CONFIRMED':
        return '2'
      case 'SHIPPED':
        return '3'
      case 'DELIVERED':
        return '4'
      case 'CANCELLED':
        return '5'
      case 'RETURNED':
        return '6'
      case 'WAITING_FOR_PAYMENT':
        return '7'
      default:
        return ''
    }
  })

  const cancelOrderId = ref('')
  const isCancelOrder = ref(false)
  const isLoading = ref(false)
  const query = ref<IParamsOrder>({
    ...DEFAULT_QUERY_PAGINATION,
    s: '',
    userId: userInfo.value.id,
    status: status.value
  })

  const orders = ref<IOrder[]>([])
  const getOrder = async () => {
    isLoading.value = true
    try {
      const { data } = await apiOrder.getOrder(query.value)
      query.value.total = data.totalElements
      orders.value = data.content
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
  getOrder()

  watch(
    () => tabActive,
    () => {
      query.value.status = status.value
      getOrder()
    }
  )

  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getOrder()
  }

  const handleCancelOrder = async (id: string) => {
    cancelOrderId.value = id
    isCancelOrder.value = true
    try {
      await apiOrder.cancelOrder({ orderId: id })
      ElNotification({
        title: 'Thành công',
        message: 'Đơn hàng đã được hủy',
        type: 'success'
      })
      getOrder()
    } catch (error) {
      console.log(error)
    }
    isCancelOrder.value = false
  }

  const handleReview = (row: IOrderItem) => {
    router.push({
      name: 'ProductDetail',
      params: {
        id: row.productId
      },
      query: {
        orderId: row.id
      }
    })
  }

  const handlePayment = async (id: string) => {
    const { data } = await apiOrder.payAgain({ orderId: id })
    if (data) window.open(String(data), '_self', 'noopener,noreferrer')
    getOrder()
  }
</script>

<style scoped lang="scss">
  .is-loading {
    color: var(--color-text-primary);
    margin-right: 6px;
    cursor: default;
    pointer-events: none;
    animation: rotating 2s linear infinite;
  }

  :deep(.el-collapse) {
    border-top: none;
    .el-collapse-item {
      .el-collapse-item__header {
        padding: 16px 0;
      }
    }

    .el-collapse-item__wrap {
      border-top: 1px solid #dbdbdb;
      .el-collapse-item__content {
        padding-top: 12px;
      }
    }
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
