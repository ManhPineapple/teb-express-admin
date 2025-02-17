export const ShipmentWaitingClose = 1
export const ShipmentClosed = 2
export const ShipmentCanceled = 3
export const ShipmentDelivered = 4
export const ShipmentIntransit = 5
export const WareHouseStatusActive = 1
export const WareHouseTypeInternational = 1

export const WAREHOUSE_STATUS_ACTIVE = 1
export const WAREHOUSE_TYPE_INTERNATIONAL = 1
export const WAREHOUSE_TYPE_INTERNAL = 2

export const DEFAULT_ACCOUNT_UPS = 1
export const OPTION_ACCOUNT_UPS2 = 2

export const DEFAULT_ACCOUNT_FEDEX = 1
export const OPTION_ACCOUNT_FEDEX = 2

export const SHIPMENT_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: ShipmentWaitingClose,
    text: 'Đang xử lý',
  },
  {
    value: ShipmentClosed,
    text: 'Đã đóng ',
  },
  {
    value: ShipmentIntransit,
    text: 'Đang giao',
  },
  {
    value: ShipmentDelivered,
    text: 'Đã giao',
  },
  {
    value: ShipmentCanceled,
    text: 'Đã hủy',
  },
]
export const MAP_NAME_STATUS_SHIPMENT = {
  [ShipmentWaitingClose]: {
    text: 'Đang xử lý',
    className: 'await',
  },
  [ShipmentClosed]: {
    text: 'Đã đóng ',
    className: 'success',
  },

  [ShipmentCanceled]: {
    text: 'Đã hủy',
    className: 'danger',
  },
  [ShipmentDelivered]: {
    text: 'Đã giao',
    className: 'info',
  },
  [ShipmentIntransit]: {
    text: 'Đang giao',
    className: 'primary',
  },
}
