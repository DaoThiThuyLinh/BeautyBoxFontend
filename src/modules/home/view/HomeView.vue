<template>
  <div class="space-y-10">
    <HomeContainer :images-banner="imagesBanner" :is-loading-banner="isLoadingBanner" />
    <h1 class="text-center text-[26px] font-bold max-sm:text-lg">DANH SÁCH SẢN PHẨM</h1>
    <HomeProductFilter
      v-model:category="queryProduct.category"
      v-model:brand="queryProduct.brand"
      v-model:order-by="queryProduct.orderBy"
      v-model:price="price"
      @filter="handleFilter"
    />
    <HomeProducts :is-loading="isGetListProducts" :products="listProducts" @view-product-info="handleViewProductInfo" />
    <h1 class="text-center text-[26px] font-bold max-sm:text-lg">DANH SÁCH SẢN PHẨM BÁN CHẠY NHẤT</h1>
    <HomeProducts
      :is-loading="isGetListProductsBestseller"
      :products="listProductsBestseller"
      type="bestseller"
      @view-product-info="handleViewProductInfo"
    />
    <HomeBlogs :blogs :is-loading="isLoading" @change-tab="handleTabChange" />
  </div>
  <DialogProductInfo :product-info="productInfo" />
</template>

<script setup lang="ts">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import { apiAdmin, apiHome } from '@/services'

  import type { IBlog } from '@/types/home.types'
  import type { IParamsProduct, IProductParent } from '@/types/product.types'

  import { useBaseStore } from '@/stores/base.store'

  import DialogProductInfo from '../components/DialogProductInfo.vue'
  import HomeBlogs from '../components/HomeBlogs.vue'
  import HomeContainer from '../components/HomeContainer.vue'
  import HomeProductFilter from '../components/HomeProductFilter.vue'
  import HomeProducts from '../components/HomeProducts.vue'

  type tabValue = 'NEWS' | 'REVIEW' | 'SKIN' | 'EVENT' | 'HEALTH'
  const { queryProduct, isDesktop, isGetListProducts, listProducts } = storeToRefs(useBaseStore())

  const { getListProducts, getListCategories, getListBrands, setOpenDialog } = useBaseStore()
  const router = useRouter()

  const productInfo = ref<IProductParent>({} as IProductParent)
  const isLoading = ref(false)
  const isLoadingBanner = ref(false)
  const blogs = ref<IBlog[]>([])
  const price = ref('')
  const imagesBanner = ref<any[]>([])
  const isGetListProductsBestseller = ref(false)
  const listProductsBestseller = ref<IProductParent[]>([])
  const queryProductBestseller = ref<IParamsProduct>({
    ...DEFAULT_QUERY_PAGINATION,
    pageSize: 5,
    value: '',
    category: '',
    brand: '',
    sortDirection: 'desc',
    orderBy: '4',
    minPrice: '',
    maxPrice: ''
  })

  const handleTabChange = (value: string) => {
    if (['NEWS', 'REVIEW', 'SKIN', 'EVENT', 'HEALTH'].includes(value)) {
      getBlogs(value as tabValue)
    } else {
      console.error(`Invalid tab value: ${value}`)
    }
  }

  onMounted(() =>
    Promise.all([
      getListProducts(),
      getListProductsBestseller(),
      getListCategories(),
      getListBrands(),
      getBlogs('NEWS'),
      getBeautyBox(),
      setOpenDialog('dialog-product-info', false)
    ])
  )
  const getBlogs = async (value: tabValue) => {
    isLoading.value = true
    try {
      let data
      switch (value) {
        case 'NEWS':
          ;({ data } = await apiHome.getBlogNews())
          blogs.value = data
          break
        case 'REVIEW':
          ;({ data } = await apiHome.getBlogReviews())
          blogs.value = data
          break
        case 'SKIN':
          ;({ data } = await apiHome.getBlogSkins())
          blogs.value = data
          break
        case 'EVENT':
          ;({ data } = await apiHome.getBlogEvents())
          blogs.value = data
          break
        case 'HEALTH':
          ;({ data } = await apiHome.getBlogHealth())
          blogs.value = data
          break

        default:
          break
      }
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

      queryProduct.value.minPrice = min || 0
      queryProduct.value.maxPrice = max || 0
    } else {
      queryProduct.value.minPrice = ''
      queryProduct.value.maxPrice = ''
    }
    getListProducts()
  }

  const handleViewProductInfo = (product: IProductParent) => {
    if (isDesktop.value) {
      productInfo.value = product
      setOpenDialog('dialog-product-info')
    } else {
      router.push({ name: 'ProductDetail', params: { id: product.id } })
    }
  }

  const getBeautyBox = async () => {
    isLoadingBanner.value = true
    try {
      const { data } = await apiHome.getBeautyBox()
      const queries = data.productBeautybox.pageProps.initialReduxState.cmsApi.queries
      let bannerData = null
      for (const key in queries) {
        if (key.includes('getByIdCms') && key.includes('"type":"banner"')) {
          const entry = queries[key]
          if (entry.status === 'fulfilled') {
            bannerData = entry.data
            break
          }
        }
      }

      imagesBanner.value = bannerData[0].data.items
    } catch (error) {
      console.log(error)
    }

    isLoadingBanner.value = false
  }

  const getListProductsBestseller = async () => {
    isGetListProductsBestseller.value = true
    try {
      const rs = await apiAdmin.getListProducts(queryProductBestseller.value)
      listProductsBestseller.value = rs.data.content
      queryProductBestseller.value.total = rs.data.totalElements
    } catch (error) {
      console.log(error)
    }
    isGetListProductsBestseller.value = false
  }
</script>

<style scoped></style>
