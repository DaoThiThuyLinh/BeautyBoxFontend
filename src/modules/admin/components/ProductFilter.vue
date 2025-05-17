<template>
  <div v-if="isDesktop" class="mt-6 flex items-center justify-between">
    <div class="flex gap-4">
      <BaseInput v-model="value" placeholder="Tìm kiếm" borderRadius="8px" @change="handleSearch" />
      <BaseSelect v-model="category" placeholder="Thể loại" teleported clearable class="w-44" @change="emit('filter')">
        <ElOption v-for="item in listCategories" :key="item.id" :label="item.name" :value="item.id" />
      </BaseSelect>
      <BaseSelect v-model="brand" placeholder="Thương hiệu" teleported clearable class="w-44" @change="emit('filter')">
        <ElOption v-for="item in listBrands" :key="item.id" :label="item.name" :value="item.id" />
      </BaseSelect>
      <BaseSelect v-model="orderBy" placeholder="Sắp xếp" teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in ORDER_BY_PRODUCT" :key="item.value" :label="item.label" :value="item.value" />
      </BaseSelect>
      <BaseSelect v-model="price" placeholder="Giá" clearable teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in LIST_PRICE" :key="item.value" :label="item.label" :value="item.value" />
      </BaseSelect>
    </div>
    <BaseButton v-if="type === 'product'" type="secondary" class="w-44" round-size="lg" @click="emit('add-product')">
      Thêm sản phẩm
    </BaseButton>
  </div>

  <div v-else class="items-center justify-between gap-4 max-sm:flex">
    <BaseInput v-model="value" placeholder="Tìm kiếm" borderRadius="8px" class="w-full" @change="handleSearch" />
    <div class="rounded-lg border border-solid border-[#DBDBDB] p-2" @click="drawerFilter = true">
      <BaseIcon name="filter" size="20" />
    </div>
    <BaseButton v-if="type === 'product'" type="secondary" class="w-44" round-size="lg" @click="emit('add-product')">
      Thêm
    </BaseButton>
    <ElDrawer :model-value="drawerFilter" :show-close="false" size="100%" footer-class="border-t border-gray-200">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <base-icon name="x" size="24" class="cursor-pointer text-[#0A0B0D]" @click="drawerFilter = false" />
          <span class="text-lg font-semibold">Lọc</span>
          <span class="cursor-pointer text-sm" @click="handleResetDrawerFilter">Reset</span>
        </div>
      </template>
      <div class="space-y-6">
        <BaseSelect v-model="category" placeholder="Thể loại" teleported clearable class="w-full">
          <ElOption v-for="item in listCategories" :key="item.id" :label="item.name" :value="item.id" />
        </BaseSelect>
        <BaseSelect v-model="brand" placeholder="Thương hiệu" teleported clearable class="w-full">
          <ElOption v-for="item in listBrands" :key="item.id" :label="item.name" :value="item.id" />
        </BaseSelect>
        <BaseSelect v-model="orderBy" placeholder="Sắp xếp" teleported clearable class="w-full">
          <ElOption v-for="item in ORDER_BY_PRODUCT" :key="item.value" :label="item.label" :value="item.value" />
        </BaseSelect>
        <BaseSelect v-model="price" placeholder="Giá" clearable teleported class="w-full">
          <ElOption v-for="item in LIST_PRICE" :key="item.value" :label="item.label" :value="item.value" />
        </BaseSelect>
        <BaseButton
          type="secondary"
          class="w-full"
          round-size="lg"
          @click="
            () => {
              emit('filter'), (drawerFilter = false)
            }
          "
          >Tìm kiếm</BaseButton
        >
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import { ORDER_BY_PRODUCT } from '@/constant'
  import { LIST_PRICE } from '@/constant'
  import { debounce } from 'lodash-es'

  import { useBaseStore } from '@/stores/base.store'

  const { listCategories, listBrands, isDesktop } = storeToRefs(useBaseStore())
  const drawerFilter = ref(false)

  const { type } = defineProps<{
    type: 'product' | 'warehouse'
  }>()
  const emit = defineEmits<{
    'add-product': []
    filter: []
  }>()
  const value = defineModel('value', { type: String, default: '' })
  const category = defineModel('category', { type: String, default: '' })
  const brand = defineModel('brand', { type: String, default: '' })
  const orderBy = defineModel('orderBy', { type: String, default: '' })
  const price = defineModel('price', { type: String, default: '' })

  const handleSearch = debounce(() => {
    emit('filter')
  }, 400)

  const handleResetDrawerFilter = () => {
    value.value = ''
    category.value = ''
    brand.value = ''
    orderBy.value = ''
    price.value = ''
    drawerFilter.value = false
    emit('filter')
  }
</script>

<style scoped></style>
