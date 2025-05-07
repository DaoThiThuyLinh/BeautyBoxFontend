<template>
  <div class="mb-6 text-2xl font-bold max-sm:my-4 max-sm:text-lg">Đơn hàng</div>
  <BaseTab v-model="tabActive" :tabs="tabs" />
  <component :is="component" :tabActive="tabActive" />
</template>

<script setup lang="ts">
  import type { ITab } from '@/types/component.types'
  import type { IOrderTabValue } from '@/types/order.types'

  import pushParams from '@/utils/pushParams'

  import TabOrder from './TabOrder.vue'

  const tabActive = ref<IOrderTabValue>('ALL')

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

  const component = computed(() => {
    switch (tabActive.value) {
      case 'ALL':
        pushParams({ blockActive: 'order', tabActive: 'ALL' })
        return TabOrder
      case 'PENDING':
        pushParams({ blockActive: 'order', tabActive: 'PENDING' })
        return TabOrder
      case 'CONFIRMED':
        pushParams({ blockActive: 'order', tabActive: 'CONFIRMED' })
        return TabOrder
      case 'SHIPPED':
        pushParams({ blockActive: 'order', tabActive: 'SHIPPED' })
        return TabOrder
      case 'DELIVERED':
        pushParams({ blockActive: 'order', tabActive: 'DELIVERED' })
        return TabOrder
      case 'CANCELLED':
        pushParams({ blockActive: 'order', tabActive: 'CANCELLED' })
        return TabOrder
      case 'RETURNED':
        pushParams({ blockActive: 'order', tabActive: 'RETURNED' })
        return TabOrder
      default:
        return TabOrder
    }
  })
</script>

<style scoped></style>
