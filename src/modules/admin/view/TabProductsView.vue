<template>
  <div class="space-y-6 max-sm:mt-6">
    <ProductFilter
      v-model:value="query.value"
      v-model:category="query.category"
      v-model:brand="query.brand"
      v-model:orderBy="query.orderBy"
      v-model:price="price"
      type="product"
      @add-product="handleAddProduct"
      @filter="handleFilter"
    />
    <TableProduct
      :is-loading="isLoading"
      :list-products="listProducts"
      :query
      @click-product="handleClickProduct"
      @edit="handleEdit"
      @delete="handleDelete"
      @limit-change="handleChange('pageSize', $event)"
      @page-change="handleChange('pageIndex', $event)"
    />
  </div>
  <DialogAddOrEditProduct
    v-if="isShowDialog"
    :product-detail="productDetail"
    :type-action="typeAction"
    @reload="getListProducts"
  />
  <DialogProductDetail :product-detail="productDetail" @reload="getListProducts" />
  <DialogConfirm
    :is-loading="isDeleteProduct"
    title="Xác nhận xóa"
    name="dialog-confirm-delete-product"
    name-button-primary="Xóa"
    @confirm="handleDelete(productDetail, 'DELETE')"
  >
    <p>
      Bạn chắn chắn muốn xóa thương hiệu: <span class="text-base font-semibold">{{ productDetail.name }}</span>
    </p>
  </DialogConfirm>
</template>

<script setup lang="ts">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import { apiAdmin } from '@/services'

  import type { IParamsProduct, IProductParent } from '@/types/product.types'

  import { useBaseStore } from '@/stores/base.store'

  import DialogAddOrEditProduct from '../components/DialogAddOrEditProduct.vue'
  import DialogProductDetail from '../components/DialogProductDetail.vue'
  import ProductFilter from '../components/ProductFilter.vue'
  import TableProduct from '../components/TableProduct.vue'

  const { setOpenDialog, getListCategories, getListBrands } = useBaseStore()
  const { dialog } = storeToRefs(useBaseStore())

  onMounted(() => {
    Promise.all([getListCategories(), getListBrands(), getListProducts()])
  })
  const isShowDialog = computed(() => {
    return dialog.value.includes('dialog-add-or-edit-product')
  })

  const query = ref<IParamsProduct>({
    ...DEFAULT_QUERY_PAGINATION,
    value: '',
    category: '',
    brand: '',
    orderBy: '',
    minPrice: '',
    maxPrice: ''
  })
  const isDeleteProduct = ref(false)
  const price = ref('')
  const isLoading = ref(false)
  const productDetail = ref<IProductParent>({} as IProductParent)
  const listProducts = ref<IProductParent[]>([])
  const typeAction = ref<'ADD' | 'EDIT'>('ADD')

  const getListProducts = async () => {
    isLoading.value = true
    try {
      if (query.value.orderBy === '4') {
        query.value.sortDirection = 'desc'
      }
      const rs = await apiAdmin.getListProducts(query.value)
      listProducts.value = rs.data.content
      query.value.total = rs.data.totalElements
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getListProducts()
  }

  const handleClickProduct = (data: IProductParent) => {
    productDetail.value = data
    setOpenDialog('dialog-product-detail')
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
  const handleAddProduct = () => {
    typeAction.value = 'ADD'
    setOpenDialog('dialog-add-or-edit-product')
  }

  const handleEdit = (data: IProductParent) => {
    typeAction.value = 'EDIT'
    productDetail.value = data
    setOpenDialog('dialog-add-or-edit-product')
  }

  const handleDelete = async (_product: IProductParent, type?: 'DELETE') => {
    productDetail.value = _product
    if (type === 'DELETE') {
      isDeleteProduct.value = true
      try {
        await apiAdmin.deleteProduct(_product.id)
        ElNotification({
          title: 'Success',
          message: 'Xóa sản phẩm thành công',
          type: 'success'
        })
        setOpenDialog('dialog-confirm-delete-product', false)
        getListProducts()
      } catch (error) {
        console.log(error)
      }
      isDeleteProduct.value = false
    } else {
      setOpenDialog('dialog-confirm-delete-product', true)
    }
  }
</script>

<style scoped></style>
