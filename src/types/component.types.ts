export interface ISelect {
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  filterMethod?: (value: string) => any
  remote?: boolean
  remoteMethod?: (value: string) => any
  popperClass?: string
  reserveKeyword?: boolean
  showPrefix?: boolean
  remoteShowSuffix?: boolean
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  defaultFirstOption?: boolean
  persistent?: boolean
  fitInputWidth?: boolean
  validateEvent?: boolean
  offset?: number
  showArrow?: boolean
  name?: string
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
}
export interface ITab {
  id?: number
  title: string
  tabValue: string | number
  routerName?: string
  [x: string]: any
}

export interface IQuery {
  pageIndex: number
  pageSize: number
  total: number
  [x: string]: any
}

export interface ITable<T> {
  isLoading?: boolean
  emptyText?: string
  data: T[]
  query?: IQuery
  label?: string
  showPagination?: boolean
}
