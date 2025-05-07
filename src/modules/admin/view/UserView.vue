<template>
  <div class="space-y-6 max-sm:space-y-0">
    <UsersFilter v-model:value="query.value" v-model:order-by="query.orderBy" @filter="getListUsers" />
    <TableUsers
      :is-loading="isLoading"
      :list-users="listUsers"
      :query
      @limit-change="handleChange('pageSize', $event)"
      @page-change="handleChange('pageIndex', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { DEFAULT_QUERY_PAGINATION } from '@/constant'
  import { apiAdmin } from '@/services'

  import type { IQueryUsers, IUser } from '@/types/user.types'

  import TableUsers from '../components/TableUsers.vue'
  import UsersFilter from '../components/UsersFilter.vue'

  const isLoading = ref(false)
  const listUsers = ref<IUser[]>([])
  const query = ref<IQueryUsers>({
    ...DEFAULT_QUERY_PAGINATION,
    value: '',
    orderBy: ''
  })

  const getListUsers = async () => {
    isLoading.value = true
    try {
      const { data } = await apiAdmin.getListUsers(query.value)
      listUsers.value = data.content
      query.value.total = data.totalElements
    } catch (error) {
      console.error(error)
    }
    isLoading.value = false
  }
  getListUsers()
  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getListUsers()
  }
</script>

<style scoped></style>
