export interface IValueSummary {
  category: number
  totalBrand: number
  totalOrder: number
  totalProduct: number
  totalRevenue: number
  totalUser: number
}
export interface ISummary {
  title: string
  icon: string
  color: string
  value: number
  isCurrency?: boolean
  showPrefix?: boolean
  fixIcon?: boolean
}

export interface IChart {
  time: string
  value: number
}
