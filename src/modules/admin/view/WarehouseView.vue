<template>
  <ProductFilter
    v-model:value="query.value"
    v-model:category="query.category"
    v-model:brand="query.brand"
    v-model:orderBy="query.orderBy"
    v-model:price="price"
    type="warehouse"
    @filter="handleFilter"
  />
  <WarehouseTable
    :list-products="listProducts"
    :is-loading="isLoading"
    :query
    @limit-change="handleChange('pageSize', $event)"
    @page-change="handleChange('pageIndex', $event)"
    @click-product="handleClickProduct"
  />
</template>

<script setup lang="ts">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import router from '@/router'
  import { apiAdmin } from '@/services'

  import type { IParamsProduct, IProductParent } from '@/types/product.types'

  import { useBaseStore } from '@/stores/base.store'

  import ProductFilter from '../components/ProductFilter.vue'
  import WarehouseTable from '../components/WarehouseTable.vue'

  const { getListCategories, getListBrands } = useBaseStore()
  onMounted(() => {
    Promise.all([getListCategories(), getListBrands(), getListProducts()])
  })

  const isLoading = ref(false)
  const listProducts = ref<IProductParent[]>([])
  const price = ref('')
  const query = ref<IParamsProduct>({
    ...DEFAULT_QUERY_PAGINATION,
    value: '',
    category: '',
    brand: '',
    orderBy: '',
    minPrice: '',
    maxPrice: ''
  })

  const getListProducts = async () => {
    isLoading.value = true
    try {
      const rs = await apiAdmin.getListProducts(query.value)
      listProducts.value = rs.data.content
      query.value.total = rs.data.totalElements
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleFilter = () => {
    if (price.value) {
      const [min, max] = price.value.includes(' - ')
        ? price.value.split(' - ').map(Number)
        : [price.value === '500000' ? null : 2000000, price.value === '500000' ? 500000 : null]

      query.value.minPrice = min || 0
      query.value.maxPrice = max || 0
    } else {
      query.value.minPrice = ''
      query.value.maxPrice = ''
    }
    getListProducts()
  }
  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getListProducts()
  }
  const handleClickProduct = (product: IProductParent) => {
    router.push({
      name: 'WarehouseProductDetail',
      params: { productId: product.id }
    })
  }
</script>

<style scoped></style>
