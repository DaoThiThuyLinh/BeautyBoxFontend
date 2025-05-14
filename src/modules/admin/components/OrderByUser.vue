<template>
  <BaseTab v-model="tabActive" :tabs="tabs" />
  <div class="mt-6 space-y-6">
    <div class="flex items-center justify-start gap-6 max-sm:hidden">
      <BaseInput v-model="query.s" placeholder="Tìm kiếm" borderRadius="8px" class="w-1/4" @change="handleSearch" />
      <p class="w-1/4">
        <ElDatePicker
          v-model="datePicker"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="From date"
          end-placeholder="To date"
          :shortcuts="shortcuts"
          class="date-picker !w-full"
          @change="getOrder"
        />
      </p>
    </div>
    <div class="hidden items-center justify-between gap-4 max-sm:flex">
      <BaseInput v-model="query.s" placeholder="Tìm kiếm" borderRadius="8px" class="w-full" @change="handleSearch" />
      <div class="rounded-lg border border-solid border-[#DBDBDB] p-2" @click="drawerFilter = true">
        <BaseIcon name="filter" size="20" />
      </div>
      <ElDrawer :model-value="drawerFilter" :show-close="false" size="100%" footer-class="border-t border-gray-200">
        <template #header>
          <div class="flex w-full items-center justify-between">
            <base-icon name="x" size="24" class="cursor-pointer text-[#0A0B0D]" @click="drawerFilter = false" />
            <span class="text-lg font-semibold">Lọc</span>
            <span class="cursor-pointer text-sm" @click="handleResetDrawerFilter">Reset</span>
          </div>
        </template>
        <div>
          <div class="mb-6 hidden h-full w-full justify-between max-sm:flex">
            <ElDatePicker
              v-model="datePicker[0]"
              type="date"
              placeholder="From date"
              class="filter-date h-full flex-1"
              :disabled-date="(time: string) => disableDatePicker(time, 'FROM', datePicker[1])"
            />
            <span class="mx-3 text-[#DBDBDB]">-</span>
            <ElDatePicker
              v-model="datePicker[1]"
              type="date"
              placeholder="To date"
              class="filter-date h-full flex-1"
              :disabled-date="(time: string) => disableDatePicker(time, 'TO', datePicker[0])"
            />
          </div>
          <BaseButton
            type="secondary"
            class="w-full"
            round-size="lg"
            @click="
              () => {
                getOrder(), (drawerFilter = false)
              }
            "
            >Tìm kiếm</BaseButton
          >
        </div>
      </ElDrawer>
    </div>
    <BaseTable
      v-if="isDesktop"
      :data="orders"
      :query="query"
      :is-loading="isLoading"
      @limit-change="handleChange('pageSize', $event)"
      @page-change="handleChange('pageIndex', $event)"
    >
      <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />
      <ElTableColumn label="Mã" width="120">
        <template #default="{ row }">
          <span class="text-sm">{{ row.id }}</span>
        </template>
      </ElTableColumn>
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
      <ElTableColumn label="Trạng thái" prop="status" min-width="160">
        <template #default="{ row }">
          <span class="text-sm" :class="toSlug(row.status)">{{ row.status }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="tabActive !== 'ALL'" min-width="200">
        <template #default="{ row }">
          <div class="flex h-14 items-center justify-center">
            <BaseSelect
              v-model="row.statusOrder"
              placeholder="Chọn trạng thái"
              teleported
              clearable
              class="w-full"
              :loading="row.isUpdating"
              :disabled="row.isUpdating"
              @change="handleChangeStatus(row.id, row.statusOrder)"
            >
              <ElOption v-for="item in ORDER_STATUS" :key="item.value" :label="item.label" :value="item.value" />
            </BaseSelect>
          </div>
        </template>
      </ElTableColumn>
      <!-- <ElTableColumn v-if="tabActive === 'WAITING_FOR_PAYMENT'" min-width="120">
        <template #default="{ row }">
          <span class="text-sm underline" @click="handlePayment(row.id)">Thanh toán</span>
        </template>
      </ElTableColumn> -->
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
              <template v-if="tabActive !== 'ALL'">
                <div class="flex h-14 items-center justify-center">
                  <BaseSelect
                    v-model="item.statusOrder"
                    placeholder="Chọn trạng thái"
                    teleported
                    clearable
                    class="w-full"
                    @change="handleChangeStatus(item.id, item.statusOrder!)"
                  >
                    <ElOption v-for="item in ORDER_STATUS" :key="item.value" :label="item.label" :value="item.value" />
                  </BaseSelect>
                </div>
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
  import { ORDER_STATUS } from '@/constant'
  import { apiOrder } from '@/services'
  import { debounce } from 'lodash-es'

  import type { ITab } from '@/types/component.types'
  import type { IOrder, IOrderTabValue, IParamsOrder } from '@/types/order.types'

  import { convertUTCTime } from '@/utils/convertUTCTime'
  import dateFormat from '@/utils/dateFormat'
  import disableDatePicker from '@/utils/disableDatePicker'
  import formatCurrency from '@/utils/formatCurrency'
  import printIndex from '@/utils/printIndex'
  import pushParams from '@/utils/pushParams'
  import toSlug from '@/utils/toSlug'

  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())

  const datePicker = ref<[Date | string, Date | string]>(['', ''])

  const tabActive = ref<IOrderTabValue>('ALL')

  const drawerFilter = ref(false)
  const route = useRoute()
  if (route.query.tabActive) {
    tabActive.value = route.query.tabActive as IOrderTabValue
  }

  const tabs = ref<ITab[]>([
    {
      id: 1,
      title: 'Tất cả', // ''
      tabValue: 'ALL'
    },
    {
      id: 2,
      title: 'Chờ xác nhận', //'1'
      tabValue: 'PENDING'
    },
    {
      id: 3,
      title: 'Đang chuẩn bị hàng', // '2'
      tabValue: 'CONFIRMED'
    },
    {
      id: 4,
      title: 'Đang giao hàng', // '3'
      tabValue: 'SHIPPED'
    },
    {
      id: 5,
      title: 'Đã giao hàng', // '4'
      tabValue: 'DELIVERED'
    },
    {
      id: 6,
      title: 'Đã hủy', // '5'
      tabValue: 'CANCELLED'
    },
    {
      id: 7,
      title: 'Đã hoàn hàng', // '6'
      tabValue: 'RETURNED'
    },
    {
      id: 8,
      title: 'Chờ thanh toán', // '7'
      tabValue: 'WAITING_FOR_PAYMENT'
    }
  ])

  watch(tabActive, newVal => {
    const validTabs = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'WAITING_FOR_PAYMENT']

    if (validTabs.includes(newVal)) {
      pushParams({ blockActive: 'order', tabActive: newVal })
      switch (tabActive.value) {
        case 'ALL':
          query.value.status = ''
          getOrder()
          break
        case 'PENDING':
          query.value.status = '1'
          getOrder()
          break
        case 'CONFIRMED':
          query.value.status = '2'
          getOrder()
          break
        case 'SHIPPED':
          query.value.status = '3'
          getOrder()
          break
        case 'DELIVERED':
          query.value.status = '4'
          getOrder()
          break
        case 'CANCELLED':
          query.value.status = '5'
          getOrder()
          break
        case 'RETURNED':
          query.value.status = '6'
          getOrder()
          break
        case 'WAITING_FOR_PAYMENT':
          query.value.status = '7'
          getOrder()
          break
        default:
          break
      }
    }
  })

  const isLoading = ref(false)
  const query = ref<IParamsOrder>({
    ...DEFAULT_QUERY_PAGINATION,
    s: '',
    status: '',
    userId: route.params.userId as string
  })

  const orders = ref<IOrder[]>([])

  const shortcuts = [
    {
      text: 'Tuần này',
      value: () => {
        const now = new Date()
        // Lấy ngày đầu tuần (thứ 2)
        const day = now.getDay() || 7 // Chuyển chủ nhật (0) thành 7
        const start = new Date(now)
        start.setDate(now.getDate() - day + 1) // Lùi về thứ 2
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tuần (chủ nhật)
        const end = new Date(start)
        end.setDate(start.getDate() + 6) // Thứ 2 + 6 ngày = Chủ nhật
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Tuần trước',
      value: () => {
        const now = new Date()
        const day = now.getDay() || 7

        // Ngày cuối tuần trước = ngày trước thứ 2 tuần này
        const end = new Date(now)
        end.setDate(now.getDate() - day) // Lùi về chủ nhật tuần trước
        end.setHours(23, 59, 59, 999)

        // Ngày đầu tuần trước = 6 ngày trước ngày cuối tuần trước
        const start = new Date(end)
        start.setDate(end.getDate() - 6) // Lùi về thứ 2 tuần trước
        start.setHours(0, 0, 0, 0)

        return [start, end]
      }
    },
    {
      text: 'Tháng này',
      value: () => {
        const now = new Date()

        // Ngày đầu tháng
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tháng
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Tháng trước',
      value: () => {
        const now = new Date()

        // Ngày đầu tháng trước
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tháng trước
        const end = new Date(now.getFullYear(), now.getMonth(), 0)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Năm nay',
      value: () => {
        const now = new Date()

        // Ngày đầu năm
        const start = new Date(now.getFullYear(), 0, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối năm
        const end = new Date(now.getFullYear(), 11, 31)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Năm trước',
      value: () => {
        const year = new Date().getFullYear() - 1

        // Ngày đầu năm trước
        const start = new Date(year, 0, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối năm trước
        const end = new Date(year, 11, 31)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    }
  ]

  const getOrder = async () => {
    isLoading.value = true
    try {
      const _params = {
        ...query.value,
        fromDate: datePicker.value ? convertUTCTime(datePicker.value[0], 'TO') : '',
        toDate: datePicker.value ? convertUTCTime(datePicker.value[1], 'TO') : ''
      }
      const { data } = await apiOrder.getOrder(_params)
      query.value.total = data.totalElements
      orders.value = data.content
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
  getOrder()

  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getOrder()
  }
  const handleSearch = debounce(() => {
    getOrder()
  }, 400)
  const handleChangeStatus = async (id: string, status: string) => {
    const params = {
      status,
      orderId: id
    }
    await apiOrder.updateStatusOrder(params)
    getOrder()
  }

  const handleResetDrawerFilter = () => {
    datePicker.value = ['', '']
    drawerFilter.value = false
    getOrder()
  }
</script>

<style scoped lang="scss">
  :deep(.date-picker.el-date-editor) {
    height: 40px;
    border-radius: 8px;
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
