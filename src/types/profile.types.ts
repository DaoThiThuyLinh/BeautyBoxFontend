export interface IDefaultAddress {
  name: string
  commune: string
  district: string
  province: string
  detailAddress: string
  recipientName: string
  recipientPhoneNumber: string
  isDefault: boolean
}

export interface IAddress extends IDefaultAddress {
  id: string
}
