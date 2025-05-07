<template>
  <div class="container">
    <p class="my-6 text-2xl font-bold">Danh mục bài viết</p>
    <BaseLoadingCard v-if="isLoading" class="my-6" />
    <template v-else>
      <div class="grid w-full grid-cols-3 gap-6 max-sm:grid-cols-1">
        <div
          v-for="(blog, index) in blogs"
          :key="blog.id"
          class="fade-in cursor-pointer"
          :style="{ animationDelay: `${index * 200}ms` }"
          @click="handleClickBlog(blog)"
        >
          <img :src="`https://image.hsv-tech.io/1040x662/${blog.image}`" alt="" class="rounded-lg" />
          <p class="my-2 text-base font-semibold">{{ blog.data.graphData.title }}</p>
          <p v-html="blog.data.detail[0].shortContent" class="line-clamp-3 text-sm opacity-60"></p>
        </div>
      </div>
      <BasePagination
        :query="query"
        @limit-change="handleChange('pageSize', $event)"
        @page-change="handleChange('pageIndex', $event)"
      />
    </template>
  </div>
  <DialogBlogDetail :blog-detail="blogDetail" />
</template>

<script setup lang="ts">
  import { apiBlogs } from '@/services'

  import type { IQuery } from '@/types/component.types'
  import type { IBlog } from '@/types/home.types'

  import { useBaseStore } from '@/stores/base.store'

  import DialogBlogDetail from '../components/DialogBlogDetail.vue'

  const blogs = ref<IBlog[]>([])
  const blogDetail = ref<IBlog>({} as IBlog)
  const { setOpenDialog } = useBaseStore()
  const query = ref<IQuery>({
    sort: 'createdAt,DESC',
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })

  const isLoading = ref(false)

  const getBlogs = async () => {
    isLoading.value = true
    try {
      const params = computed(() => {
        const { pageIndex, pageSize, ...rest } = query.value
        return {
          ...rest,
          page: pageIndex,
          limit: pageSize
        }
      })
      const { data, total } = await apiBlogs.getBlogs(params.value)
      blogs.value = data
      query.value.total = total
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
  getBlogs()

  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    query.value = {
      ...query.value,
      [field]: value
    }
    getBlogs()
  }

  const handleClickBlog = (blog: IBlog) => {
    console.log('🚀 ~ handleClickBlog ~ blog:', blog)
    blogDetail.value = blog
    setOpenDialog('dialog-blog-detail')
  }
</script>

<style scoped lang="scss">
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
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
