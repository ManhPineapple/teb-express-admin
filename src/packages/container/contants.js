export const CONTAINER_WAITING_CLOSE = 1
export const CONTAINER_CLOSE = 2
export const CONTAINER_CANCEL = 3
export const CONTAINER_INTRANSIT = 5
export const CONTAINER_DELIVERIED = 4
export const CONTAINER_IMPORT_HUB = 6
export const CONTAINER_EXPORT_HUB = 7

export const CONTAINER_TYPE_UPS = 1
export const CONTAINER_TYPE_MANUAL = 2
export const CONTAINER_TYPE_FEDEX = 3

export const CONTAINER_ITEM_INACTIVE = 0
export const CONTAINER_ITEM_ACTIVE = 1
export const CONTAINER_ITEM_FAIL = 2

export const CONTAINER_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: CONTAINER_WAITING_CLOSE,
    text: 'Đang xử lý',
  },
  {
    value: CONTAINER_CLOSE,
    text: 'Đã đóng',
  },
  {
    value: CONTAINER_INTRANSIT,
    text: 'Đang giao',
  },
  {
    value: CONTAINER_DELIVERIED,
    text: 'Đã giao',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
  // {
  //   value: CONTAINER_IMPORT_HUB,
  //   text: 'Hub đã nhận',
  // },
  // {
  //   value: CONTAINER_EXPORT_HUB,
  //   text: 'Hub đã xuất',
  // },
]

export const MAP_TEXT_STATUS_CONTAINER = [
  {
    value: '',
    text: '-',
  },
  {
    value: CONTAINER_WAITING_CLOSE,
    text: 'Đang xử lý',
  },
  {
    value: CONTAINER_CLOSE,
    text: 'Đã đóng ',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
  {
    value: CONTAINER_DELIVERIED,
    text: 'Đã giao ',
  },
  {
    value: CONTAINER_INTRANSIT,
    text: 'Đang giao',
  },
  {
    value: CONTAINER_IMPORT_HUB,
    text: 'Đã giao ',
  },
  {
    value: CONTAINER_EXPORT_HUB,
    text: 'Đã giao ',
  },
]

export const MAP_NAME_STATUS_CONTAINER = {
  [CONTAINER_WAITING_CLOSE]: {
    text: 'Đang xử lý',
    className: 'await',
  },
  [CONTAINER_CLOSE]: {
    text: 'Đã đóng ',
    className: 'success',
  },
  [CONTAINER_DELIVERIED]: {
    text: 'Đã giao',
    className: 'info',
  },
  [CONTAINER_INTRANSIT]: {
    text: 'Đang giao',
    className: 'primary',
  },
  [CONTAINER_CANCEL]: {
    text: 'Đã hủy',
    className: 'danger',
  },
  [CONTAINER_IMPORT_HUB]: {
    text: 'Đã giao',
    className: 'info',
  },
  [CONTAINER_EXPORT_HUB]: {
    text: 'Đã giao',
    className: 'info',
  },
}

export const MAP_CONTAINER_TEXT_TYPES = {
  [CONTAINER_TYPE_UPS]: 'Label UPS',
  [CONTAINER_TYPE_MANUAL]: 'Label Ngoài',
  [CONTAINER_TYPE_FEDEX]: 'Label FedEx',
}
