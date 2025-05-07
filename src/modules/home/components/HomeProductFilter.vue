<template>
  <div class="container">
    <div class="flex items-center justify-end space-x-4 max-sm:grid max-sm:grid-cols-2 max-sm:gap-4">
      <BaseSelect v-model="category" placeholder="Thể loại" clearable teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in listCategories" :key="item.id" :label="item.name" :value="item.id" />
      </BaseSelect>
      <BaseSelect v-model="brand" placeholder="Thương hiệu" clearable teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in listBrands" :key="item.id" :label="item.name" :value="item.id" />
      </BaseSelect>
      <BaseSelect v-model="orderBy" placeholder="Sắp xếp" clearable teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in ORDER_BY_PRODUCT" :key="item.value" :label="item.label" :value="item.value" />
      </BaseSelect>
      <BaseSelect v-model="price" placeholder="Giá" clearable teleported class="w-44" @change="emit('filter')">
        <ElOption v-for="item in LIST_PRICE" :key="item.value" :label="item.label" :value="item.value" />
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LIST_PRICE, ORDER_BY_PRODUCT } from '@/constant'

  import { useBaseStore } from '@/stores/base.store'

  const { listCategories, listBrands } = storeToRefs(useBaseStore())
  const emit = defineEmits<{
    filter: []
  }>()
  const category = defineModel('category', { type: String, default: '' })
  const brand = defineModel('brand', { type: String, default: '' })
  const orderBy = defineModel('orderBy', { type: String, default: '' })
  const price = defineModel('price', { type: String, default: '' })
</script>

<style scoped></style>
