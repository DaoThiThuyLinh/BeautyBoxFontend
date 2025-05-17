<template>
  <template v-if="isDesktop">
    <div class="header-top">
      <div class="m-auto flex items-center justify-center gap-5 py-1 text-xs text-white">
        <span>Freeship 15K mọi đơn hàng</span>
        <div class="separator"></div>
        <span>Quà Tặng Cho Đơn Từ 499K</span>
        <div class="separator"></div>
        <span>Giao Hàng Nhanh 24H</span>
        <div class="separator"></div>
        <span>Mua online nhận tại cửa hàng gần nhất</span>
      </div>
    </div>
    <div class="container flex h-20 items-center justify-center">
      <div class="flex w-full items-center justify-between py-4">
        <img src="/images/logo.png" alt="" class="h-16 cursor-pointer" loading="lazy" @click="router.replace({ name: 'Home' })" />
        <div class="flex items-center space-x-4">
          <!-- <BaseSelect
            v-model.trim="search"
            placeholder="Tìm kiếm"
            :filterable="true"
            :remote="true"
            :filter-method="text => suggestSearch(text)"
            :loading="true"
            name="search"
            loading-text="Không có dữ liệu"
            popper-class="search"
            class="search w-[400px]"
            @change="handleSearch"
          >
            <ElOption v-for="item in listSuggest" :key="item" :label="item" :value="item" />
          </BaseSelect> -->

          <ElPopover
            class="box-item"
            placement="bottom"
            :width="600"
            trigger="click"
            trigger-keys="['Enter']"
            :popper-style="{ color: '#000', borderRadius: '8px', padding: 0 }"
          >
            <template #reference>
              <BaseInput v-model="search" showIcon class="w-[600px]" placeholder="Tìm kiếm" @change="handleSearch" />
            </template>
            <div v-for="item in listSuggest" :key="item">
              <p v-html="item" class="cursor-pointer px-4 py-2 hover:font-bold" @click="clickSearch(item)"></p>
            </div>
          </ElPopover>

          <div class="ml-10 flex w-10 cursor-pointer items-center justify-center space-x-2">
            <!-- <BaseIcon name="support" size="24" />
            <span class="text-xs font-bold">Trung tâm hỗ trợ</span> -->
          </div>
          <div class="flex cursor-pointer items-center justify-center space-x-2" @click="router.push({ name: 'Blogs' })">
            <BaseIcon name="note" size="24" />
            <span class="text-xs font-bold">Tạp chí làm đẹp</span>
          </div>
          <!-- <div class="flex cursor-pointer items-center justify-center space-x-2">
            <ElPopover
              class="box-item"
              placement="bottom"
              :width="200"
              trigger="click"
              :popper-style="{ color: '#000', borderRadius: '8px', padding: 0 }"
              :offset="24"
            >
              <template #reference>
                <BaseIcon name="three-dot" size="24" />
              </template>
              <div>
                <div class="flex cursor-pointer space-x-2 border-b border-solid border-[#00000059] px-4 py-5">
                  <BaseIcon name="support" size="24" />
                  <span class="text-sm hover:font-bold">Trung tâm hỗ trợ</span>
                </div>
                <div class="flex cursor-pointer space-x-2 px-4 py-5">
                  <BaseIcon name="search-order" size="24" />
                  <span class="text-sm hover:font-bold">Tra cứu đơn hàng</span>
                </div>
              </div>
            </ElPopover>
          </div> -->
          <div class="h-6 border-l border-solid border-[#00000059]"></div>
          <div class="flex space-x-6">
            <div
              v-if="!isLoggedIn"
              class="flex cursor-pointer items-center justify-center space-x-2"
              @click="setOpenDialog('dialog-login')"
            >
              <BaseIcon name="customer" size="24" />
              <span class="text-xs font-bold">Đăng nhập</span>
            </div>
            <div v-else class="flex cursor-pointer items-center justify-center space-x-2">
              <ElPopover
                class="box-item"
                placement="bottom"
                :width="360"
                trigger="click"
                :popper-style="{ color: '#000', borderRadius: '8px', padding: 0 }"
                :offset="16"
              >
                <template #reference>
                  <div class="flex cursor-pointer items-center justify-center space-x-2">
                    <BaseIcon name="customer" size="24" />
                    <span class="text-sm font-bold">
                      {{ userInfo?.name ? userInfo.name.split(' ')[userInfo.name.split(' ').length - 1] : '' }}
                    </span>
                  </div>
                </template>
                <div class="flex cursor-pointer border-b border-solid border-[var(--border-primary)] p-4 font-bold">
                  <span class="mr-1 text-sm">{{ getGreeting() }},</span>
                  <span class="text-sm">{{ userInfo.name }}</span>
                </div>

                <div
                  v-if="isAdmin"
                  class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
                  @click="router.push({ name: 'Dashboards' })"
                >
                  <BaseIcon name="dashboard" size="24" class="text-[#707073]" />
                  <p class="flex flex-col">
                    <span class="text-sm">Quản lý</span>
                    <span class="text-[10px]">Thống kê, quản lý hệ thống</span>
                  </p>
                </div>
                <div
                  class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
                  @click="router.push({ name: 'Profile', params: { userId: userInfo.id } })"
                >
                  <BaseIcon name="info-account" size="28" class="text-[#707073]" />
                  <p class="flex flex-col">
                    <span class="text-sm">Thông tin tài khoản</span>
                    <span class="text-[10px]">Tài khoản, Đơn hàng, Địa chỉ giao nhận, Đổi mật khẩu</span>
                  </p>
                </div>
                <div
                  class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
                  @click="router.push(`/profile/${userInfo.id}?blockActive=order&tabActive=ALL`)"
                >
                  <BaseIcon name="search-order" size="28" class="text-[#707073]" />
                  <p class="flex flex-col">
                    <span class="text-sm">Lịch sử đặt hàng</span>
                    <span class="text-[10px]">Tra cứu đơn hàng đã đặt trước đó</span>
                  </p>
                </div>
                <div
                  class="flex cursor-pointer gap-2 hover:font-bold"
                  :class="[isAdmin ? 'px-4 pt-2 pb-4' : 'p-4']"
                  @click="logout"
                >
                  <BaseIcon name="logout" class="text-[#707073]" />
                  <span class="text-sm">Đăng xuất</span>
                </div>
              </ElPopover>
            </div>
            <div class="flex cursor-pointer items-center justify-center">
              <BaseIcon name="heart" size="24" />
            </div>
            <div class="relative flex cursor-pointer items-center justify-center" @click="drawer = true">
              <BaseIcon name="cart" size="24" />
              <p
                class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-center text-xs font-bold text-white"
              >
                {{ totalProductInCart }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div v-else class="container my-6 space-y-6">
    <div class="flex items-center justify-between">
      <BaseIcon name="menu-bar" @click="drawerMenuMb = true" />
      <img
        src="/images/logo.png"
        alt=""
        class="flex h-10 cursor-pointer justify-center"
        loading="lazy"
        @click="
          () => {
            router.replace({ name: 'Home' })
            drawerMenuMb = false
          }
        "
      />

      <div class="flex items-center justify-center space-x-3">
        <BaseIcon name="heart" size="24" />
        <div class="relative flex cursor-pointer items-center justify-center" @click="drawer = true">
          <BaseIcon name="cart" size="24" />
          <p
            class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-center text-xs font-bold text-white"
          >
            {{ totalProductInCart }}
          </p>
        </div>
      </div>
    </div>
    <BaseInput
      v-model="search"
      showIcon
      :class="isDesktop ? 'w-[400px]' : 'w-full'"
      placeholder="Tìm kiếm"
      @change="handleSearch"
    />
  </div>
  <DialogLogin />
  <DialogRegister />
  <CartView :drawer="drawer" @close="handleCloseCart" />

  <ElDrawer :model-value="drawerMenuMb" :show-close="false" size="100%" footer-class="border-t border-gray-200" body-class="!p-0">
    <template #header>
      <div class="flex items-center justify-between">
        <img
          src="/images/logo.png"
          alt=""
          class="flex h-8 cursor-pointer justify-center"
          loading="lazy"
          @click="router.replace({ name: 'Home' })"
        />
        <BaseIcon name="x-close" class="cursor-pointer" @click="drawerMenuMb = false" />
      </div>
    </template>

    <div v-if="!isLoggedIn" class="border-b border-solid border-[var(--border-primary)]" @click="setOpenDialog('dialog-login')">
      <div class="flex cursor-pointer gap-2 p-4">
        <BaseIcon name="login" class="text-[#707073]" />
        <span class="text-sm">Đăng nhập</span>
      </div>
    </div>

    <div class="flex cursor-pointer border-b border-solid border-[var(--border-primary)] p-4 font-bold">
      <span class="mr-1 text-sm">{{ getGreeting() }},</span>
      <span class="text-sm">{{ userInfo.name }}</span>
    </div>

    <div
      v-if="isAdmin"
      class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
      @click="
        () => {
          router.push({ name: 'Dashboards' })
          drawerMenuMb = false
        }
      "
    >
      <BaseIcon name="dashboard" size="24" class="text-[#707073]" />
      <p class="flex flex-col">
        <span class="text-sm">Quản lý</span>
        <span class="text-[10px]">Thống kê, quản lý hệ thống</span>
      </p>
    </div>
    <div
      v-if="isLoggedIn"
      class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
      @click="
        () => {
          router.push({ name: 'Profile', params: { userId: userInfo.id } })
          drawerMenuMb = false
        }
      "
    >
      <BaseIcon name="info-account" size="28" class="text-[#707073]" />
      <p class="flex flex-col">
        <span class="text-sm">Thông tin tài khoản</span>
        <span class="text-[10px]">Tài khoản, Đơn hàng, Địa chỉ giao nhận, Đổi mật khẩu</span>
      </p>
    </div>
    <div
      class="flex cursor-pointer items-center justify-start gap-2 border-b border-solid border-[var(--border-primary)] px-4 py-2 hover:font-bold"
      @click="
        () => {
          router.push(`/profile/${userInfo.id}?blockActive=order&tabActive=ALL`)
          drawerMenuMb = false
        }
      "
    >
      <BaseIcon name="search-order" size="28" class="text-[#707073]" />
      <p class="flex flex-col">
        <span class="text-sm">Lịch sử đặt hàng</span>
        <span class="text-[10px]">Tra cứu đơn hàng đã đặt trước đó</span>
      </p>
    </div>
    <div
      v-if="isLoggedIn"
      class="flex cursor-pointer gap-2 hover:font-bold"
      :class="[isAdmin ? 'px-4 pt-2 pb-4' : 'p-4']"
      @click="logout"
    >
      <BaseIcon name="logout" class="text-[#707073]" />
      <span class="text-sm">Đăng xuất</span>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { LIST_SUGGEST } from '@/constant'
  import { apiAdmin } from '@/services'
  import { debounce } from 'lodash-es'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  import CartView from '../cart/CartView.vue'
  import DialogLogin from '../dialog/DialogLogin.vue'
  import DialogRegister from '../dialog/DialogRegister.vue'

  const { queryProduct, isDesktop, totalProductInCart } = storeToRefs(useBaseStore())
  const { getListProducts, getCart } = useBaseStore()

  const router = useRouter()
  const { setOpenDialog } = useBaseStore()
  const { logout } = useAuthStore()
  const { isLoggedIn, userInfo, isAdmin } = storeToRefs(useAuthStore())

  const search = ref('')
  const listSuggest = ref<string[]>(LIST_SUGGEST)
  const drawer = ref(false)
  const drawerMenuMb = ref(false)
  const handleSearch = debounce(async () => {
    listSuggest.value = [...LIST_SUGGEST]

    queryProduct.value.value = search.value.trim()
    const [_, rs] = await Promise.all([getListProducts(), apiAdmin.suggestSearch(search.value.trim())])

    if (rs.length === 0) {
      listSuggest.value = LIST_SUGGEST
    } else {
      listSuggest.value = rs
    }
  }, 500)
  const clickSearch = async (keyword: string) => {
    search.value = htmlToText(keyword)
    queryProduct.value.value = htmlToText(keyword)
    getListProducts()
  }
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅 Chào buổi sáng'
    if (hour < 18) return '☀️ Chào buổi chiều'
    return '🌙 Chào buổi tối'
  }

  if (isLoggedIn.value) {
    getCart()
  }

  const handleCloseCart = () => {
    drawer.value = false
  }

  const htmlToText = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }
</script>

<style scoped lang="scss">
  .header-top {
    background: linear-gradient(90deg, rgb(255, 212, 0) 0%, rgb(199, 49, 48) 50.52%, rgb(102, 54, 149) 99.61%);
  }
  .separator {
    width: 2px;
    min-width: 2px;
    height: 2px;
    border-radius: 50%;
    background: rgb(255, 255, 255);
  }
  :deep(.p-inputtext:enabled:focus) {
    border: 1px solid var(--color-text-primary);
  }
  .search {
    :deep(.el-select) {
      .el-select__wrapper {
        border-radius: 100px !important;
      }
    }
  }
</style>
