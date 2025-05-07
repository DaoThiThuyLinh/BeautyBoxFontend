<template>
  <div class="space-y-6">
    <div class="mt-6 flex items-center justify-between">
      <div></div>
      <BaseButton
        type="secondary"
        class="w-32"
        round-size="lg"
        @click="
          () => {
            actionType = 'ADD'
            setOpenDialog('dialog-add-category')
          }
        "
        >Thêm loại</BaseButton
      >
    </div>
    <CategoriesTable @edit="handleEdit" @delete="handleDelete" />
    <DialogAddCategory
      :is-loading="isLoading"
      :category="category"
      :action-type="actionType"
      @save="handleAddCategory"
      @edit="handleEditCategory"
      @cancel="setOpenDialog('dialog-add-category', false)"
    />
  </div>
  <DialogConfirm
    :is-loading="isDeleteCategory"
    title="Xác nhận xóa"
    name="dialog-confirm-delete-category"
    name-button-primary="Xóa"
    @confirm="handleDelete(category, 'DELETE')"
  >
    <p>
      Bạn chắn chắn muốn xóa thể loại: <span class="text-base font-semibold">{{ category.name }}</span>
    </p>
  </DialogConfirm>
</template>

<script setup lang="ts">
  import { apiAdmin } from '@/services'

  import type { ICategory } from '@/types/category.types'

  import { useBaseStore } from '@/stores/base.store'

  import DialogAddCategory from '../components/DialogAddCategory.vue'
  import CategoriesTable from '../components/TableCategories.vue'

  const { setOpenDialog, getListCategories } = useBaseStore()

  const isLoading = ref(false)
  const isDeleteCategory = ref(false)
  const category = ref<ICategory>({} as ICategory)
  const actionType = ref<'ADD' | 'EDIT'>('ADD')

  onMounted(() => {
    getListCategories()
  })

  const handleAddCategory = async (categoryName: string) => {
    isLoading.value = true
    try {
      await apiAdmin.addCategory({ categoryName })
      ElNotification({
        title: 'Success',
        message: 'Thêm mới loại sản phẩm thành công',
        type: 'success'
      })
      setOpenDialog('dialog-add-category', false)
      getListCategories()
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleEdit = (_category: ICategory) => {
    actionType.value = 'EDIT'
    category.value = _category
    setOpenDialog('dialog-add-category', true)
  }

  const handleDelete = async (_category: ICategory, type?: 'DELETE') => {
    category.value = _category
    if (type === 'DELETE') {
      isDeleteCategory.value = true
      try {
        await apiAdmin.deleteCategory(_category.id)
        ElNotification({
          title: 'Success',
          message: 'Xóa loại sản phẩm thành công',
          type: 'success'
        })
        setOpenDialog('dialog-confirm-delete-category', false)
        getListCategories()
      } catch (error) {
        console.log(error)
      }
      isDeleteCategory.value = false
    } else {
      setOpenDialog('dialog-confirm-delete-category', true)
    }
  }

  const handleEditCategory = async (categoryName: string, id: string) => {
    isLoading.value = true
    try {
      const body = {
        categoryName,
        id
      }
      await apiAdmin.editCategory(body)
      ElNotification({
        title: 'Success',
        message: 'Sửa loại sản phẩm thành công',
        type: 'success'
      })
      setOpenDialog('dialog-add-category', false)
      getListCategories()
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
</script>

<style scoped></style>
