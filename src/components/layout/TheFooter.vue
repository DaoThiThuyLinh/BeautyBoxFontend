<template>
  <footer class="container mb-14">
    <div
      class="background-gradient mb-14 rounded-2xl py-6"
      :class="[isDesktop ? 'flex items-center justify-between px-[100px]' : 'block px-6']"
    >
      <div class="max-sm:mb-4 max-sm:space-y-2">
        <h1 class="text-2xl font-bold text-white max-sm:text-center max-sm:text-lg">NHẬN BẢN TIN LÀM ĐẸP</h1>
        <p class="text-sm text-white max-sm:text-center max-sm:text-sm">
          Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn
        </p>
      </div>
      <BaseInput
        v-model="email"
        :show-icon="false"
        placeholder="Điền email của bạn"
        :show-suffix="true"
        class="input-email"
        :class="[isDesktop ? 'w-[400px]' : 'w-full']"
      >
        <template #suffix>
          <h1 class="mr-3 cursor-pointer text-base font-bold text-white max-sm:text-base">THEO DÕI</h1>
        </template>
      </BaseInput>
    </div>
    <div class="mb-15 flex items-start justify-between max-sm:block">
      <div class="flex flex-col space-y-[30px]">
        <img src="/images/logo.png" alt="" loading="lazy" class="w-[200px]" />
        <div class="flex space-x-4">
          <img src="/images/face-icon.png" alt="" loading="lazy" />
          <img src="/images/insta-icon.png" alt="" loading="lazy" />
          <img src="/images/tiktok-icon.png" alt="" loading="lazy" />
        </div>
        <img src="/images/verified.png" alt="" loading="lazy" class="w-[112px]" />
      </div>

      <div
        class="grid w-full max-w-[1042px] grid-cols-[1fr_1.5fr_1.2fr_1fr] gap-10 max-sm:mt-10 max-sm:w-full max-sm:grid-cols-2"
      >
        <div v-for="item in footer" :key="item.title" class="space-y-4">
          <p class="mb-4 font-bold">{{ item.title }}</p>
          <div v-for="list in item.list" :key="list" class="flex flex-col space-y-2">
            <p class="cursor-pointer text-sm hover:font-semibold">{{ list }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-solid border-[#0000000F]"></div>
    <div class="mt-10" :class="[isDesktop ? 'flex items-center justify-between' : 'space-y-6']">
      <p :class="isDesktop ? 'w-[500px]' : 'w-full'">
        ®beautybox.com.vn thuộc quyền sở hữu của Công ty CP TMDV Tổng Hợp Hoàn Vũ GPKD số 0309802418 cấp ngày 11/02/2010 tại Sở
        Kế hoạch & Đầu tư TP HCM | VP Miền Nam Lầu 1, G Tower 3 - 196A, Nguyễn Văn Hưởng, Phường Thảo Điền, Thành Phố Thủ Đức,
        TP.HCM--- Chi nhánh Công ty CP TMDV Tổng Hợp Hoàn Vũ tại Hà Nội GPKD chi nhánh số 0309802418-004 cấp ngày 22/11/2017 |
        Tầng 4 tháp 2, Times Tower, 35 Lê Văn Lương, Phường Nhân Chính, Q. Thanh Xuân, TP.Hà Nội, Việt Nam.
      </p>
      <div class="flex flex-col space-y-3">
        <p class="text-sm font-semibold">PHƯƠNG THỨC THANH TOÁN</p>
        <div class="justify- flex items-center space-x-4">
          <img src="/images/visa-icon.png" alt="" loading="lazy" />
          <img src="/images/bosch-icon.png" alt="" loading="lazy" />
          <img src="/images/napas-icon.png" alt="" loading="lazy" />
          <img src="/images/cod-icon.png" alt="" loading="lazy" />
          <img src="/images/momo-icon.png" alt="" loading="lazy" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())

  const email = ref('')
  const footer = [
    {
      title: 'Về Beauty Box',
      list: ['Câu chuyện thương hiệu', 'Về chúng tôi', 'Liên hệ']
    },
    {
      title: 'Chính sách',
      list: [
        'Chính sách và quy định chung',
        'Chính sách và giao nhận thanh toán',
        'Chính sách đổi trả sản phẩm',
        'Chính sách bảo mật thông tin cá nhân',
        'Điều khoản sử dụng'
      ]
    },
    {
      title: 'My Beauty Box',
      list: ['Quyền lợi thành viên', 'Thông tin thành viên', 'Theo dõi đơn hàng', 'Hướng dẫn mua hàng online']
    },
    {
      title: 'Đối tác - Liên kết',
      list: ['THE FACE SHOP Vietnam']
    }
  ]
</script>

<style scoped lang="scss">
  .background-gradient {
    background: linear-gradient(90deg, rgb(255, 212, 0) 0%, rgb(199, 49, 48) 50.52%, rgb(102, 54, 149) 99.61%);
    .input-email {
      :deep(.el-input) {
        .el-input__wrapper {
          background-color: transparent !important;
          background: rgba(255, 255, 255, 0.2) !important;
          box-shadow: none !important;
          .el-input__inner {
            color: white;
            padding-left: 12px;
            &::placeholder {
              color: white;
            }
          }
          .el-input__inner {
            height: 45px;
          }
        }
        .el-input__wrapper.is-focus {
          box-shadow: 0 0 0 2px var(--color-shadow) !important;
        }
      }
    }
  }
</style>
