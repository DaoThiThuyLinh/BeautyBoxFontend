import { DEFAULT_QUERY_PAGINATION } from '@/constant'
import { apiAdmin, apiCart, apiParams, apiProfile } from '@/services'
import { filter, union } from 'lodash-es'
import { defineStore } from 'pinia'

import type { IBrand } from '@/types/brand.types'
import type { ICart, IProductOrder } from '@/types/cart.types'
import type { ICategory } from '@/types/category.types'
import type { DIALOG_NAME } from '@/types/dialog.types'
import type { IBlog } from '@/types/home.types'
import type { IDistrict, IProvince, IWard } from '@/types/param.types'
import type { IParamsProduct, IProductParent } from '@/types/product.types'
import type { IAddress } from '@/types/profile.types'

export const useBaseStore = defineStore('base', () => {
  const dialog = ref<DIALOG_NAME[]>([])
  const isDesktop = ref(true)
  const screenWidth = ref(window.innerWidth)
  const listCategories = ref<ICategory[]>([])
  const listBrands = ref<IBrand[]>([])
  const blogDetail = ref<IBlog>({} as IBlog)
  const listProducts = ref<IProductParent[]>([])
  const isGetListProducts = ref(false)
  const isLoadingCategories = ref(false)
  const isLoadingBrands = ref(false)
  const listDistricts = ref<IDistrict[]>([])
  const listWards = ref<IWard[]>([])
  const listProvinces = ref<IProvince[]>([])
  const isLoadingAddress = ref(false)
  const listAddress = ref<IAddress[]>([])
  const listProductOrder = ref<IProductOrder[]>([])
  const carts = ref<ICart[]>([])
  const isGetCarts = ref(false)
  const queryProduct = ref<IParamsProduct>({
    ...DEFAULT_QUERY_PAGINATION,
    pageSize: 20,
    value: '',
    category: '',
    brand: '',
    orderBy: '',
    minPrice: '',
    maxPrice: ''
  })

  const setOpenDialog = (dialogName: DIALOG_NAME, isOpen = true) => {
    if (isOpen) {
      dialog.value = union(dialog.value, [dialogName])
    } else {
      dialog.value = filter(dialog.value, value => {
        return value !== dialogName
      })
    }
  }
  const getListCategories = async () => {
    isLoadingCategories.value = true
    try {
      const { data } = await apiAdmin.getListCategories()
      listCategories.value = data
    } catch (error) {
      console.log(error)
    }
    isLoadingCategories.value = false
  }

  const getListBrands = async () => {
    isLoadingBrands.value = true
    try {
      const { data } = await apiAdmin.getListBrands()
      listBrands.value = data
    } catch (error) {
      console.log(error)
    }
    isLoadingBrands.value = false
  }
  const getListProducts = async () => {
    isGetListProducts.value = true
    try {
      if (queryProduct.value.orderBy === '4') {
        queryProduct.value.sortDirection = 'desc'
      }
      const rs = await apiAdmin.getListProducts(queryProduct.value)
      listProducts.value = rs.data.content
      queryProduct.value.total = rs.data.totalElements
    } catch (error) {
      console.log(error)
    }
    isGetListProducts.value = false
  }

  const getListProvince = async () => {
    try {
      const rs = await apiParams.getListProvince()
      listProvinces.value = rs
    } catch (error) {
      console.log(error)
    }
  }
  const getListDistrict = async (provinceCode: string) => {
    try {
      const rs = await apiParams.getListDistrict(provinceCode)
      listDistricts.value = rs.districts
    } catch (error) {
      console.log(error)
    }
  }
  const getListWards = async (districtCode: string) => {
    try {
      const rs = await apiParams.getListWards(districtCode)
      listWards.value = rs.wards
    } catch (error) {
      console.log(error)
    }
  }
  const getAddress = async () => {
    isLoadingAddress.value = true
    try {
      const { data } = await apiProfile.getAddress()
      listAddress.value = data
    } catch (error) {
      console.log(error)
    }
    isLoadingAddress.value = false
  }

  const getCart = async () => {
    isGetCarts.value = true
    try {
      const { data } = await apiCart.getCart()
      carts.value = data
    } catch (error) {
      console.log(error)
    } finally {
      isGetCarts.value = false
    }
  }

  const totalProductInCart = computed(() => {
    return carts.value.length
  })

  return {
    isDesktop,
    screenWidth,
    dialog,
    setOpenDialog,
    getListCategories,
    listCategories,
    getListBrands,
    listBrands,
    blogDetail,
    getListProducts,
    queryProduct,
    isGetListProducts,
    listProducts,
    isLoadingBrands,
    isLoadingCategories,
    getListProvince,
    listProvinces,
    getListDistrict,
    listDistricts,
    getListWards,
    listWards,
    getAddress,
    listAddress,
    isLoadingAddress,
    listProductOrder,
    getCart,
    isGetCarts,
    carts,
    totalProductInCart
  }
})
