export const GENDER = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'ORTHER' }
]

export const LIST_MENU = [
  {
    label: 'Thống kê',
    value: 'DASHBOARD',
    icon: 'menu-dashboard',
    routerName: 'Dashboards'
  },
  {
    label: 'Sản phẩm',
    value: 'PRODUCTS',
    icon: 'menu-products',
    routerName: 'Products'
  },
  {
    label: 'Đơn hàng',
    value: 'ORDERS',
    icon: 'menu-orders',
    routerName: 'Orders'
  },
  {
    label: 'Kho hàng',
    value: 'WAREHOUSE',
    icon: 'menu-warehouse',
    routerName: 'Warehouse'
  },
  {
    label: 'Người dùng',
    value: 'USERS',
    icon: 'menu-users',
    routerName: 'Users'
  }
]

export const MAX_SIZE_IMAGE_UPLOAD = 5 * 1024 * 1024

export const COLORS_TEXT_EDITOR = [
  '#000000',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466'
]

export const DEFAULT_QUERY_PAGINATION = {
  pageIndex: 1,
  pageSize: 10,
  total: 0
}

export const ORDER_BY_PRODUCT = [
  {
    label: 'Thời gian tạo',
    value: 1
  },
  {
    label: 'Giá sản phẩm',
    value: 2
  },
  {
    label: 'Tên',
    value: 3
  },
  {
    label: 'Số lượt mua',
    value: 4
  },
  {
    label: 'Lượt đánh giá',
    value: 5
  }
]

export const LIST_SUGGEST = ['<p>Son</p>', '<p>Phấn má</p>', '<p>Kem dưỡng da</p>', '<p>Kem chống nắng</p>']

export const LIST_PRICE = [
  {
    label: 'Dưới 500.000đ',
    value: '500000'
  },
  {
    label: '500.000đ - 1.000.000đ',
    value: '500000 - 1000000'
  },
  {
    label: '1.000.000đ - 1.500.000đ',
    value: '1000000 - 1500000'
  },
  {
    label: '1.500.000đ - 2.000.000đ',
    value: '1500000 - 2000000'
  },
  {
    label: 'Trên 2.000.000đ',
    value: '2000000'
  }
]
export const ORDER_STATUS = [
  {
    label: 'Đang chuẩn bị hàng',
    value: '2'
  },
  {
    label: 'Đang giao hàng',
    value: '3'
  },
  {
    label: 'Đã giao hàng',
    value: '4'
  },
  {
    label: 'Đã hoàn hàng',
    value: '6'
  },
  {
    label: 'Chờ thanh toán',
    value: '7'
  }
]

export const ORDER_BY_USER = [
  {
    label: 'Thời gian tạo',
    value: 1
  },
  {
    label: 'Số lượng đơn hàng',
    value: 2
  },
  {
    label: 'Tên',
    value: 3
  },
  {
    label: 'Tổng tiền mua hàng',
    value: 4
  }
]

export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000
export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000
export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
