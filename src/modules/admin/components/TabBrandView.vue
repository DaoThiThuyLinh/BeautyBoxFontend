<template>
  <div class="space-y-6">
    <div class="mt-6 flex items-center justify-between">
      <div></div>
      <BaseButton
        type="secondary"
        class="w-44"
        round-size="lg"
        @click="
          () => {
            actionType = 'ADD'
            setOpenDialog('dialog-add-brand')
          }
        "
        >Thêm thương hiệu</BaseButton
      >
    </div>
    <ListBrands @edit="handleEdit" @delete="handleDelete" />
    <DialogAddBrand :is-loading="isLoading" :action-type="actionType" :brand @reload="getListBrands" />
  </div>
  <DialogConfirm
    :is-loading="isDeleteBrand"
    title="Xác nhận xóa"
    name="dialog-confirm-delete-brand"
    name-button-primary="Xóa"
    @confirm="handleDelete(brand, 'DELETE')"
  >
    <p>
      Bạn chắn chắn muốn xóa thương hiệu: <span class="text-base font-semibold">{{ brand.name }}</span>
    </p>
  </DialogConfirm>
</template>

<script setup lang="ts">
  import { apiAdmin } from '@/services'

  import type { IBrand } from '@/types/brand.types'

  import { useBaseStore } from '@/stores/base.store'

  import DialogAddBrand from '../components/DialogAddBrand.vue'
  import ListBrands from '../components/ListBrands.vue'

  const isLoading = ref(false)
  const brand = ref<IBrand>({} as IBrand)
  const isDeleteBrand = ref(false)
  const actionType = ref<'ADD' | 'EDIT'>('ADD')

  const { setOpenDialog, getListBrands } = useBaseStore()
  onMounted(() => {
    getListBrands()
  })

  const handleEdit = (_brand: IBrand) => {
    brand.value = _brand
    actionType.value = 'EDIT'
    setOpenDialog('dialog-add-brand')
  }

  const handleDelete = async (_brand: IBrand, type?: 'DELETE') => {
    brand.value = _brand
    if (type === 'DELETE') {
      isDeleteBrand.value = true
      try {
        await apiAdmin.deleteBrand(_brand.id)
        ElNotification({
          title: 'Success',
          message: 'Xóa thương hiệu sản phẩm thành công',
          type: 'success'
        })
        setOpenDialog('dialog-confirm-delete-category', false)
        getListBrands()
      } catch (error) {
        console.log(error)
      }
      isDeleteBrand.value = false
    } else {
      setOpenDialog('dialog-confirm-delete-brand', true)
    }
  }
</script>

<style scoped></style>
