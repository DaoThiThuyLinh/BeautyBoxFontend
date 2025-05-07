<template>
  <template v-if="route.query.productId">
    <div class="mb-6 flex items-center gap-2 text-[var(--color-primary-dashboard)] max-sm:gap-1 max-sm:text-sm">
      <BaseIcon name="next" :size="isDesktop ? 24 : 16" />
      <span class="cursor-pointer" @click="handleBack">{{ route.params.productId }}</span>
      <BaseIcon name="next" :size="isDesktop ? 24 : 16" />
      <span class="cursor-pointer">{{ route.query.productId }}</span>
    </div>

    <BaseTable
      v-if="isDesktop"
      :data="listWarehouse"
      :query="queryWarehouse"
      :is-loading="isGetWarehouse"
      :show-pagination="false"
    >
      <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />

      <ElTableColumn label="Số lượng" prop="entryQuantity" align="right" width="160">
        <template #default="{ row }">
          <span class="text-sm">{{ formatNumber(row.entryQuantity) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Giá nhập" prop="entryPrice" align="right">
        <template #default="{ row }">
          <span class="text-sm">{{ formatCurrency(row.entryPrice) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Ngày nhập" prop="entryDate" width="200" align="center">
        <template #default="{ row }">
          <span class="text-sm">{{ dateFormat(row.entryDate, 'DD/MM/YYYY') }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Số điện thoại" prop="entryPhoneNumber" />
      <ElTableColumn label="Địa chỉ" prop="entryPlace" width="400" />

      <ElTableColumn align="right" width="80">
        <template #default="{ row }">
          <BaseIcon
            name="edit"
            class="text-[var(--color-secondary)] hover:text-[var(--color-text-primary)]"
            @click="handleEditWarehouse(row)"
          />
        </template>
      </ElTableColumn>
    </BaseTable>

    <template v-else>
      <BaseLoading v-if="isGetWarehouse" />
      <BaseEmpty v-else-if="listWarehouse?.length === 0" />
      <template v-else>
        <div v-for="item in listWarehouse" :key="item.id">
          <BaseCollapse :is-show-divider-header="true" class="fix-el-collapse">
            <template #title>
              <div class="mr-4 flex w-full justify-between">
                <span>{{ dateFormat(item.entryDate, 'DD/MM/YYYY') }}</span>
                <span>{{ formatNumber(item.entryQuantity) }}</span>
              </div>
            </template>
            <div class="space-y-4">
              <p class="flex items-start justify-between">
                <span>Giá nhập</span>
                <span class="text-right">{{ formatCurrency(item.entryPrice) }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Số điện thoại</span>
                <span>{{ item.entryPhoneNumber }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Địa chỉ</span>
                <span>{{ item.entryPlace }}</span>
              </p>
              <div class="flex justify-end">
                <BaseIcon
                  name="edit"
                  class="text-[var(--color-secondary)] hover:text-[var(--color-text-primary)]"
                  @click="handleEditWarehouse(item)"
                />
              </div>
            </div>
          </BaseCollapse>
        </div>
      </template>
    </template>
  </template>

  <template v-else>
    <div
      class="mb-6 flex items-center gap-2 text-[var(--color-primary-dashboard)] max-sm:gap-1 max-sm:text-sm"
      @click="handleBackWarehouseList"
    >
      <BaseIcon name="previous" :size="isDesktop ? 24 : 16" />
      <span class="cursor-pointer">{{ route.params.productId }}</span>
    </div>

    <BaseTable
      v-if="isDesktop"
      :data="product.details"
      :query
      :is-loading="isGetProduct"
      @row-click="handleRowClick"
      :show-pagination="false"
    >
      <ElTableColumn label="#" type="index" :index="(i: number) => printIndex(i, query)" align="center" width="64" />
      <ElTableColumn label="Sản phẩm" prop="name" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <img :src="row.image" alt="" class="h-10 w-10 rounded-lg" />
            <span class="text-sm">{{ row.name }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Giá" prop="price" align="right" min-width="120">
        <template #default="{ row }">
          <span class="text-sm">{{ formatCurrency(row.price) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Giảm giá" prop="discount" align="right" min-width="120">
        <template #default="{ row }">
          <span class="text-sm text-red-500"> -{{ row.discount }}%</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Giá sau giảm giá" prop="newPrice" align="right" width="180">
        <template #default="{ row }">
          <span class="text-sm"> {{ formatCurrency(row.newPrice) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Số lượng" prop="stock" align="right" min-width="120">
        <template #default="{ row }">
          <span class="text-sm">{{ formatNumber(row.stock) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Số lượng đã bán" prop="totalSold" align="right" width="180">
        <template #default="{ row }">
          <span class="text-sm">{{ formatNumber(row.totalSold) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Số lượng còn lại" align="right" width="180">
        <template #default="{ row }">
          <span class="text-sm">{{ formatNumber(row.stock - row.totalSold) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Trạng thái" prop="status" min-width="120">
        <template #default="{ row }">
          <span class="text-sm" :class="toSlug(row.status)">{{ row.status }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn align="right" width="40">
        <template #default="{ row }">
          <div class="flex justify-end" @click.stop="handeEdit(row.id)">
            <BaseIcon name="eye" class="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-text-primary)]" />
          </div>
        </template>
      </ElTableColumn>
    </BaseTable>

    <template v-else>
      <BaseLoading v-if="isGetProduct" />
      <BaseEmpty v-else-if="product.details?.length === 0" />
      <template v-else>
        <div v-for="item in product.details" :key="item.id" class="mt-4">
          <BaseCollapse :is-show-divider-header="true">
            <template #title>
              <div class="mr-4 flex w-full items-center justify-between">
                <div class="flex items-center justify-start gap-2">
                  <img :src="item.image" alt="" class="h-10 w-10 rounded-lg" />
                  <span>{{ item.name }}</span>
                </div>
                <span class="text-sm" :class="toSlug(item.status)">{{ item.status }}</span>
              </div>
            </template>
            <div class="space-y-4">
              <p class="flex items-start justify-between">
                <span>Giá</span>
                <span class="text-right">{{ formatCurrency(item.price) }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Giảm giá</span>
                <span class="text-right text-red-500"> -{{ item.discount }}%</span>
              </p>

              <p class="flex items-start justify-between">
                <span>Giá sau giảm giá</span>
                <span class="text-right">{{ formatCurrency(item.newPrice) }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Số lượng</span>
                <span class="text-right">{{ formatNumber(item.stock) }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Số lượng đã bán</span>
                <span class="text-right">{{ formatNumber(item.totalSold) }}</span>
              </p>
              <p class="flex items-start justify-between">
                <span>Số lượng còn lại</span>
                <span class="text-right">{{ formatNumber(item.stock - item.totalSold) }}</span>
              </p>
              <div class="flex items-center justify-between gap-4">
                <BaseButton type="secondary" class="mt-4 w-full" round-size="lg" @click="handleRowClick(item)">Nhập</BaseButton>
                <BaseButton type="secondary" class="mt-4 w-full" round-size="lg" @click="handeEdit(item.id)"
                  >Xem chi tiết</BaseButton
                >
              </div>
            </div>
          </BaseCollapse>
        </div>
      </template>
    </template>
  </template>
  <DialogEditWarehouse :warehouse @reload="getListWarehouse" />
</template>

<script setup lang="ts">
  import { apiAdmin, apiWarehouse } from '@/services'

  import type { IQuery } from '@/types/component.types'
  import type { IProductChildren, IProductParent } from '@/types/product.types'
  import type { IWarehouse } from '@/types/warehouse.types'

  import dateFormat from '@/utils/dateFormat'
  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'
  import printIndex from '@/utils/printIndex'
  import toSlug from '@/utils/toSlug'

  import { useBaseStore } from '@/stores/base.store'

  import DialogEditWarehouse from './DialogEditWarehouse.vue'

  const { setOpenDialog } = useBaseStore()
  const { isDesktop } = storeToRefs(useBaseStore())

  const route = useRoute()
  const router = useRouter()
  const isGetProduct = ref(false)
  const isGetWarehouse = ref(false)
  const query = ref<IQuery>({
    pageIndex: 1,
    pageSize: 50,
    total: 0
  })

  const queryWarehouse = ref<IQuery>({
    productDetailId: route.query.productId || '',
    pageIndex: 1,
    pageSize: 50,
    total: 0
  })
  const listWarehouse = ref<IWarehouse[]>([])
  const product = ref<IProductParent>({} as IProductParent)
  const warehouse = ref<IWarehouse>({} as IWarehouse)

  const getListProductsChildrenById = async () => {
    isGetProduct.value = true
    try {
      const { data } = await apiAdmin.getListProductsChildrenById(route.params.productId as string)
      product.value = data
      query.value.total = data.details.length
    } catch (error) {
      console.log(error)
    }
    isGetProduct.value = false
  }
  getListProductsChildrenById()

  const handleRowClick = (row: IProductChildren) => {
    router.push({
      name: 'WarehouseProduct',
      params: { productId: route.params.productId, productDetailId: row.id }
    })
  }

  const handeEdit = async (id: string) => {
    router.push({
      name: 'WarehouseProductDetail',
      query: { productId: id }
    })
    queryWarehouse.value.productDetailId = id || route.query.productId
    getListWarehouse()
  }

  const getListWarehouse = async () => {
    isGetWarehouse.value = true
    try {
      const { data } = await apiWarehouse.getWarehouseList(queryWarehouse.value)
      listWarehouse.value = data.content
      queryWarehouse.value.total = data.totalElements
    } catch (error) {
      console.log(error)
    }
    isGetWarehouse.value = false
  }

  if (route.query.productId) {
    getListWarehouse()
  }

  const handleEditWarehouse = (row: IWarehouse) => {
    warehouse.value = row
    setOpenDialog('dialog-edit-warehouse', true)
  }

  const handleBack = () => {
    router.push({
      name: 'WarehouseProductDetail',
      params: { productId: route.params.productId }
    })
  }

  const handleBackWarehouseList = () => {
    router.push({
      name: 'Warehouse'
    })
  }
</script>

<style scoped lang="scss">
  :deep(.el-collapse) {
    border-top: none;
    .el-collapse-item {
      .el-collapse-item__header {
        padding-bottom: 16px;
      }
    }

    .el-collapse-item__wrap {
      border-top: 1px solid #dbdbdb;
      .el-collapse-item__content {
        padding-top: 12px;
      }
    }
  }
  :deep(.fix-el-collapse.el-collapse) {
    .el-collapse-item {
      .el-collapse-item__header {
        padding-bottom: 0px;
      }
    }
  }
</style>
