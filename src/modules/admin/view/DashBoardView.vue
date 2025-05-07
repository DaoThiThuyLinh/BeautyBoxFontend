<template>
  <div class="space-y-6">
    <DashboardSummary :summaries="dataSummary" :is-loading="isLoading" />
    <div class="rounded-lg bg-[var(--color-dashboard-bg-light)] p-4">
      <div class="flex items-center justify-between max-sm:block">
        <h2 class="text-2xl font-semibold max-sm:mb-4 max-sm:text-base">Thống kê doanh thu</h2>
        <div class="w-[500px] max-sm:hidden max-sm:w-full">
          <ElDatePicker
            v-model="datePickerRevenue"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="From date"
            end-placeholder="To date"
            :shortcuts="shortcuts"
            class="date-picker !w-full"
            @change="getChartRevenueData"
          />
        </div>
        <div class="mb-6 hidden h-full w-full items-center justify-between max-sm:flex">
          <ElDatePicker
            v-model="datePickerRevenue[0]"
            type="date"
            placeholder="From date"
            class="filter-date h-full flex-1"
            :disabled-date="(time: string) => disableDatePicker(time, 'FROM', datePickerRevenue[1])"
            @change="getChartRevenueData"
          />
          <span class="mx-3 text-[#DBDBDB]">-</span>
          <ElDatePicker
            v-model="datePickerRevenue[1]"
            type="date"
            placeholder="To date"
            class="filter-date h-full flex-1"
            :disabled-date="(time: string) => disableDatePicker(time, 'TO', datePickerRevenue[0])"
            @change="getChartRevenueData"
          />
        </div>
      </div>
      <div id="chart" v-loading="isGetChartRevenue" class="min-h-[400px]">
        <ApexChart
          :options="getChartOptions(chartRevenue)"
          type="line"
          height="400"
          :series="getChartSeries(chartRevenue, 'Doanh thu')"
        ></ApexChart>
      </div>
    </div>
    <div class="rounded-lg bg-[var(--color-dashboard-bg-light)] p-4">
      <div class="flex items-center justify-between max-sm:block">
        <h2 class="text-2xl font-semibold max-sm:mb-4 max-sm:text-base">Thống kê đơn hàng</h2>
        <div class="w-[500px] max-sm:hidden max-sm:w-full">
          <ElDatePicker
            v-model="datePickerOrder"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="From date"
            end-placeholder="To date"
            :shortcuts="shortcuts"
            class="date-picker !w-full"
            @change="getDataChartOrder"
          />
        </div>
        <div class="mb-6 hidden h-full w-full items-center justify-between max-sm:flex">
          <ElDatePicker
            v-model="datePickerOrder[0]"
            type="date"
            placeholder="From date"
            class="filter-date h-full flex-1"
            :disabled-date="(time: string) => disableDatePicker(time, 'FROM', datePickerOrder[1])"
            @change="getDataChartOrder"
          />
          <span class="mx-3 text-[#DBDBDB]">-</span>
          <ElDatePicker
            v-model="datePickerOrder[1]"
            type="date"
            placeholder="To date"
            class="filter-date h-full flex-1"
            :disabled-date="(time: string) => disableDatePicker(time, 'TO', datePickerOrder[0])"
            @change="getDataChartOrder"
          />
        </div>
      </div>
      <div id="chart" v-loading="isGetChartOrder" class="min-h-[400px]">
        <ApexChart
          :options="getChartOptions(chartOrder)"
          type="line"
          height="400"
          :series="getChartSeries(chartOrder, 'Đơn hàng')"
        ></ApexChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ONE_MONTH_MS, ONE_WEEK_MS, ONE_YEAR_MS } from '@/constant'
  import { apiAdmin } from '@/services'
  import { ElDatePicker } from 'element-plus'
  import { computed, onMounted, ref } from 'vue'
  import ApexChart from 'vue3-apexcharts'

  import type { IChart, ISummary, IValueSummary } from '@/types/dashboard.types'

  import { convertUTCTime } from '@/utils/convertUTCTime'
  import disableDatePicker from '@/utils/disableDatePicker'
  import formatAbbreviateNumber from '@/utils/formatAbbreviateNumber'

  import DashboardSummary from '../components/DashboardSummary.vue'

  const isLoading = ref(false)
  const isGetChartRevenue = ref(false)
  const isGetChartOrder = ref(false)
  const valueSummaries = ref<IValueSummary>({} as IValueSummary)
  const chartRevenue = ref<IChart[]>([])
  const chartOrder = ref<IChart[]>([])
  const datePickerRevenue = ref<[Date, Date]>(getThisWeekRange())
  const datePickerOrder = ref<[Date, Date]>(getThisWeekRange())
  onMounted(() => {
    Promise.all([getSummariesDashbord(), getChartRevenueData(), getDataChartOrder()])
  })
  const shortcuts = [
    {
      text: 'Tuần này',
      value: () => {
        const now = new Date()
        // Lấy ngày đầu tuần (thứ 2)
        const day = now.getDay() || 7 // Chuyển chủ nhật (0) thành 7
        const start = new Date(now)
        start.setDate(now.getDate() - day + 1) // Lùi về thứ 2
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tuần (chủ nhật)
        const end = new Date(start)
        end.setDate(start.getDate() + 6) // Thứ 2 + 6 ngày = Chủ nhật
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Tuần trước',
      value: () => {
        const now = new Date()
        const day = now.getDay() || 7

        // Ngày cuối tuần trước = ngày trước thứ 2 tuần này
        const end = new Date(now)
        end.setDate(now.getDate() - day) // Lùi về chủ nhật tuần trước
        end.setHours(23, 59, 59, 999)

        // Ngày đầu tuần trước = 6 ngày trước ngày cuối tuần trước
        const start = new Date(end)
        start.setDate(end.getDate() - 6) // Lùi về thứ 2 tuần trước
        start.setHours(0, 0, 0, 0)

        return [start, end]
      }
    },
    {
      text: 'Tháng này',
      value: () => {
        const now = new Date()

        // Ngày đầu tháng
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tháng
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Tháng trước',
      value: () => {
        const now = new Date()

        // Ngày đầu tháng trước
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối tháng trước
        const end = new Date(now.getFullYear(), now.getMonth(), 0)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Năm nay',
      value: () => {
        const now = new Date()

        // Ngày đầu năm
        const start = new Date(now.getFullYear(), 0, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối năm
        const end = new Date(now.getFullYear(), 11, 31)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    },
    {
      text: 'Năm trước',
      value: () => {
        const year = new Date().getFullYear() - 1

        // Ngày đầu năm trước
        const start = new Date(year, 0, 1)
        start.setHours(0, 0, 0, 0)

        // Ngày cuối năm trước
        const end = new Date(year, 11, 31)
        end.setHours(23, 59, 59, 999)

        return [start, end]
      }
    }
  ]

  const dataSummary = computed((): ISummary[] => {
    return [
      {
        title: 'Doanh thu',
        icon: 'dolar',
        color: '#DD7D00',
        isCurrency: true,
        value: valueSummaries.value.totalRevenue
      },
      {
        title: 'Tổng số đơn hàng',
        icon: 'menu-orders',
        color: '#0151FC',
        value: valueSummaries.value.totalOrder
      },
      {
        title: 'Tổng số sản phẩm',
        icon: 'menu-products',
        color: '#ff8201',
        value: valueSummaries.value.totalProduct
      },
      {
        title: 'Tổng số thương hiệu',
        icon: 'start-brand',
        color: '#FFBB33',
        value: valueSummaries.value.totalBrand
      },
      {
        title: 'Tổng số thể loại',
        icon: 'category',
        color: '#0151FC',
        value: valueSummaries.value.category
      },
      {
        title: 'Tổng số người dùng',
        icon: 'user',
        color: '#129961',
        value: valueSummaries.value.totalUser
      }
    ]
  })

  function getThisWeekRange(): [Date, Date] {
    const now = new Date()
    const day = now.getDay() || 7

    const start = new Date(now)
    start.setDate(now.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    return [start, end]
  }

  const getSummariesDashbord = async () => {
    isLoading.value = true
    try {
      const { data } = await apiAdmin.getSummariesDashbord()
      valueSummaries.value = data
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const getChartRevenueData = async () => {
    isGetChartRevenue.value = true
    try {
      const duration = (datePickerRevenue.value[1]?.getTime?.() ?? 0) - (datePickerRevenue.value[0]?.getTime?.() ?? 0)
      const groupTime = duration > ONE_YEAR_MS ? '5' : duration > ONE_MONTH_MS ? '3' : duration > ONE_WEEK_MS ? '2' : '1'
      const _paramas = {
        groupTime,
        fromDate: convertUTCTime(datePickerRevenue.value[0], 'FROM'),
        toDate: convertUTCTime(datePickerRevenue.value[1], 'TO')
      }

      const { data } = await apiAdmin.getChartRevenueData(_paramas)
      chartRevenue.value = data
    } catch (error) {
      console.log(error)
    }
    isGetChartRevenue.value = false
  }

  const getDataChartOrder = async () => {
    isGetChartOrder.value = true
    try {
      const duration = (datePickerOrder.value[1]?.getTime?.() ?? 0) - (datePickerOrder.value[0]?.getTime?.() ?? 0)
      const groupTime = duration > ONE_YEAR_MS ? '5' : duration > ONE_MONTH_MS ? '3' : duration > ONE_WEEK_MS ? '2' : '1'
      const _paramas = {
        groupTime,
        fromDate: convertUTCTime(datePickerOrder.value[0], 'FROM'),
        toDate: convertUTCTime(datePickerOrder.value[1], 'TO')
      }

      const { data } = await apiAdmin.getDataChartOrder(_paramas)
      chartOrder.value = data
    } catch (error) {
      console.log(error)
    }
    isGetChartOrder.value = false
  }

  const getChartSeries = (chartData: IChart[], seriesName: string) => {
    return [
      {
        name: seriesName,
        data: chartData.map(item => item.value)
      }
    ]
  }

  const getChartOptions = (chartData: IChart[]) => {
    return {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif',
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      colors: ['#FF8A00', '#FF8A00'],
      stroke: {
        width: [3, 2],
        curve: 'smooth',
        dashArray: [0, 5]
      },
      xaxis: {
        categories: chartData.map(item => item.time),
        labels: {
          style: {
            colors: '#888',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 4,
        labels: {
          formatter: (value: number) => {
            if (value === 0) return '0'
            return formatAbbreviateNumber(value)
          },
          style: {
            colors: '#888',
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
        enabled: true,
        shared: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const value = series[seriesIndex][dataPointIndex]
          const name = w.globals.seriesNames[seriesIndex]

          return `
          <div class="custom-tooltip">
            <div class="tooltip-title">${name}</div>
            <div class="tooltip-value">${formatAbbreviateNumber(value)}</div>
          </div>
        `
        },
        marker: {
          show: true
        },
        x: {
          show: false
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetY: -10,
        markers: {
          width: 8,
          height: 8,
          strokeWidth: 0,
          radius: 12
        },
        itemMargin: {
          horizontal: 10
        }
      },
      markers: {
        size: [4, 0],
        strokeWidth: 0,
        hover: {
          size: 6
        }
      }
    }
  }
</script>

<style scoped>
  :deep(.date-picker.el-date-editor) {
    height: 40px;
    border-radius: 8px;
  }
  :deep(.custom-tooltip) {
    background: white;
    border-radius: 6px;
    padding: 10px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
  }

  :deep(.tooltip-title) {
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
  }

  :deep(.tooltip-value) {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  :deep(.apexcharts-legend-text) {
    color: #888 !important;
    font-size: 14px !important;
  }
</style>
