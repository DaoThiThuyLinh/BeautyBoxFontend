<template>
  <BaseTab v-model="tabActive" :tabs="tabs" />
  <component :is="component" />
</template>

<script setup lang="ts">
  import type { ITab } from '@/types/component.types'

  import pushParams from '@/utils/pushParams'

  import TabBrandView from '../components/TabBrandView.vue'
  import TabCategoriesView from '../components/TabCategoriesView.vue'
  import TabProductsView from './TabProductsView.vue'

  type TabValue = 'PRODUCT' | 'CATEGORY' | 'BRAND'

  const tabActive = ref<TabValue>('PRODUCT')
  const tabs = ref<ITab[]>([
    {
      id: 1,
      title: 'Sản phẩm',
      tabValue: 'PRODUCT'
    },
    {
      id: 2,
      title: 'Loại',
      tabValue: 'CATEGORY'
    },
    {
      id: 3,
      title: 'Thương hiệu',
      tabValue: 'BRAND'
    }
  ])
  const route = useRoute()
  if (route.query.tabActive) {
    tabActive.value = route.query.tabActive as TabValue
  }

  const component = computed(() => {
    switch (tabActive.value) {
      case 'PRODUCT':
        pushParams({ tabActive: 'PRODUCT' })
        return TabProductsView
      case 'CATEGORY':
        pushParams({ tabActive: 'CATEGORY' })
        return TabCategoriesView
      case 'BRAND':
        pushParams({ tabActive: 'BRAND' })
        return TabBrandView
      default:
        return TabProductsView
    }
  })
</script>

<style scoped></style>
