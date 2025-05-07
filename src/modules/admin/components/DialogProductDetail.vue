<template>
  <BaseDialog
    name="dialog-product-detail"
    title="CHI TIẾT SẢN PHẨM"
    width="1000"
    class="dialog-product-detail"
    :is-show-footer="false"
    @open="getListProductsChildrenById"
    @cancel="setOpenDialog('dialog-product-detail', false)"
    @close="emit('reload')"
  >
    <BaseLoadingCard
      v-if="isLoading"
      :number-card-loading="isDesktop ? 3 : 2"
      :grid-class="isDesktop ? 'grid-cols-3' : 'grid-cols-2'"
    />
    <template v-else>
      <div class="grid grid-cols-6 gap-4 max-sm:grid-cols-2">
        <div v-for="(item, index) in product.images" :key="index">
          <img :src="item.image" alt="" class="h-[150px] w-[150px] rounded-lg object-cover" />
        </div>
      </div>

      <div class="my-4 space-y-1">
        <p class="line-clamp-2 text-xl font-semibold">
          {{ product.name }}
        </p>
        <p><span class="font-semibold">Đã bán:</span> {{ product.totalSold }}</p>
        <p><span class="font-semibold"> Thể loại:</span> {{ product.categoryName }}</p>
        <p><span class="font-semibold">Thương hiệu:</span> {{ product.brandName }}</p>
        <div class="-mt-1 flex items-center justify-start space-x-2">
          <span class="font-semibold">Đánh giá: </span>
          <p class="flex items-center justify-start">
            <ElRate :model-value="product.reviewsResponse?.averageRating ?? 0" disabled text-color="#ff9900" class="rate" />
            <span class="text-sm">({{ product.reviewsResponse?.totalNumRating ?? 0 }})</span>
          </p>
        </div>
      </div>
      <p class="my-4 text-xl font-medium">Danh mục sản phẩm</p>

      <div class="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
        <div
          v-for="item in product.details"
          :key="item.id"
          class="product-card transform cursor-pointer space-y-2 rounded-lg bg-[#fafafa] p-4 transition duration-500 hover:scale-105 hover:rounded-lg hover:bg-[#ffebd6]"
        >
          <div class="flex items-center justify-center">
            <img :src="item.image" class="h-[180px] w-[180px] rounded-lg object-cover" alt="" loading="lazy" />
          </div>
          <p class="text-center text-sm font-semibold uppercase">{{ item.name }}</p>
          <p class="text-xs">
            <span class="font-semibold">Giá:</span>
            {{ formatCurrency(item.price) }}
          </p>
          <p v-if="item.discount" class="text-xs">
            <span class="font-semibold">Giảm giá:</span>
            <span class="text-[var(--color-text-error)]"> -{{ item.discount }}%</span>
          </p>
          <p class="text-xs">
            <span class="font-semibold">Giá sau khi giảm: </span>
            {{ formatCurrency(item.newPrice) }}
          </p>
          <p class="text-xs">
            <span class="font-semibold">Tổng số lượng: </span>
            {{ formatNumber(item.stock) }}
          </p>
          <p class="text-xs">
            <span class="font-semibold">Số lượng đã bán: </span>
            {{ formatNumber(item.totalSold) }}
          </p>
          <p class="text-xs">
            <span class="font-semibold">Số lượng còn lại: </span>
            {{ formatNumber(item.stock - item.totalSold) }}
          </p>
          <p class="text-xs">
            <span class="font-semibold">Trạng thái: </span>
            {{ item.status }}
          </p>

          <span class="w-20 font-semibold">Mô tả:</span>
          <span v-html="item.description"></span>

          <div v-if="isDesktop" class="action-buttons-wrapper flex items-center justify-center space-x-3">
            <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="handleEdit(item)" />
            <BaseIcon
              name="trash"
              class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
              @click="handleDelete(item)"
            />
          </div>
          <div v-else class="mt-6 flex items-center justify-center space-x-3">
            <BaseIcon name="edit" class="cursor-pointer hover:text-[var(--color-primary-dashboard)]" @click="handleEdit(item)" />
            <BaseIcon
              name="trash"
              class="cursor-pointer hover:text-[var(--color-primary-dashboard)]"
              @click="handleDelete(item)"
            />
          </div>
        </div>

        <div
          class="mt-3 mb-4 flex h-[150px] w-[150px] items-center justify-center rounded-md border border-dashed border-[#dbdbdb] p-6"
          @click="handleAddProductChildren"
        >
          <div class="relative flex h-full w-full cursor-pointer items-center justify-center">
            <BaseIcon name="plus" size="40" class="text-[#8c939d]" />
          </div>
        </div>
      </div>
      <p class="my-4 text-xl font-medium">Mô tả</p>
      <div
        ref="descriptionContainer"
        v-html="productDetail.description"
        :class="{ 'description-collapsed': !showFullDescription && descriptionContainer?.offsetHeight! > 300 }"
        class="prose prose-sm max-w-none transition-all duration-300"
      ></div>
      <p
        v-if="descriptionContainer?.scrollHeight! > 300"
        @click="showFullDescription = !showFullDescription"
        class="mt-2 cursor-pointer text-center font-semibold text-[var(--color-primary-light)] hover:underline"
      >
        {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
      </p>
    </template>
  </BaseDialog>
  <DialogAddOrEditProductChildren
    :product-id="product.id"
    :product-children="productChildren"
    :action-type="actionType"
    @reload="setOpenDialog('dialog-product-detail', false)"
  />
  <DialogConfirm
    :is-loading="isDeleteProduct"
    title="Xác nhận xóa"
    name="dialog-confirm-delete-product-children"
    name-button-primary="Xóa"
    @confirm="handleDelete(productChildren, 'DELETE')"
  >
    <p>
      Bạn chắn chắn muốn xóa thương hiệu: <span class="text-base font-semibold">{{ productDetail.name }}</span>
    </p>
  </DialogConfirm>
</template>

<script setup lang="ts">
  import { apiAdmin } from '@/services'

  import type { IProductChildren, IProductParent } from '@/types/product.types'

  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'

  import { useBaseStore } from '@/stores/base.store'

  import DialogAddOrEditProductChildren from './DialogAddOrEditProductChildren.vue'

  const { setOpenDialog } = useBaseStore()

  const { isDesktop } = storeToRefs(useBaseStore())
  const { productDetail } = defineProps<{
    productDetail: IProductParent
  }>()

  const emit = defineEmits<{
    reload: []
  }>()
  const showFullDescription = ref(false)
  const descriptionContainer = ref<HTMLElement | null>(null)

  const handleAddProductChildren = () => {
    actionType.value = 'ADD'
    setOpenDialog('dialog-add-or-edit-product-children')
  }

  const actionType = ref<'ADD' | 'EDIT'>('ADD')
  const isLoading = ref(false)
  const product = ref<IProductParent>({} as IProductParent)
  const productChildren = ref<IProductChildren>({} as IProductChildren)
  const isDeleteProduct = ref(false)

  const getListProductsChildrenById = async () => {
    isLoading.value = true
    try {
      const { data } = await apiAdmin.getListProductsChildrenById(productDetail.id)
      product.value = data
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleEdit = (_productChildren: IProductChildren) => {
    actionType.value = 'EDIT'
    productChildren.value = _productChildren
    setOpenDialog('dialog-add-or-edit-product-children')
  }

  const handleDelete = async (_productChildren: IProductChildren, type?: 'DELETE') => {
    productChildren.value = _productChildren
    if (type === 'DELETE') {
      isDeleteProduct.value = true
      try {
        await apiAdmin.deleteProductChildren(_productChildren.id)
        ElNotification({
          title: 'Success',
          message: 'Xóa sản phẩm con thành công',
          type: 'success'
        })
        setOpenDialog('dialog-confirm-delete-product-children', false)
        getListProductsChildrenById()
      } catch (error) {
        console.log(error)
      }
      isDeleteProduct.value = false
    } else {
      setOpenDialog('dialog-confirm-delete-product-children', true)
    }
  }
</script>

<style scoped lang="scss">
  .rate {
    :deep(.el-rate__item) {
      .el-rate__icon {
        color: #c1c1c1;
      }
      .is-active {
        color: #f7ba2a;
      }
    }
  }

  .product-card {
    position: relative;
    overflow: hidden;
  }

  .action-buttons-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-primary-dashboard-light);
    padding: 10px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .product-card:hover .action-buttons-wrapper {
    transform: translateY(0);
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in-out forwards;
    opacity: 0;
  }

  .description-collapsed {
    max-height: 300px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(transparent, white);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
