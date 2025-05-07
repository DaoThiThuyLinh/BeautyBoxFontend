<template>
  <BaseTab v-model="tabActive" :tabs="tabs" />
  <component :is="component" :tabActive="tabActive" />
</template>

<script setup lang="ts">
  import type { ITab } from '@/types/component.types'
  import type { IOrderTabValue } from '@/types/order.types'

  import pushParams from '@/utils/pushParams'

  import TabOrderView from './TabOrderView.vue'

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
        return TabOrderView
      case 'PENDING':
        pushParams({ blockActive: 'order', tabActive: 'PENDING' })
        return TabOrderView
      case 'CONFIRMED':
        pushParams({ blockActive: 'order', tabActive: 'CONFIRMED' })
        return TabOrderView
      case 'SHIPPED':
        pushParams({ blockActive: 'order', tabActive: 'SHIPPED' })
        return TabOrderView
      case 'DELIVERED':
        pushParams({ blockActive: 'order', tabActive: 'DELIVERED' })
        return TabOrderView
      case 'CANCELLED':
        pushParams({ blockActive: 'order', tabActive: 'CANCELLED' })
        return TabOrderView
      case 'RETURNED':
        pushParams({ blockActive: 'order', tabActive: 'RETURNED' })
      case 'WAITING_FOR_PAYMENT':
        pushParams({ blockActive: 'order', tabActive: 'WAITING_FOR_PAYMENT' })
        return TabOrderView
      default:
        return TabOrderView
    }
  })
</script>

<style scoped></style>
