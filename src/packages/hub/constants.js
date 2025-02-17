export const MAXIMUM_SIZE = 5 * 2 ** 20

export const HUB_ITEM_FILTER_STATUS_PENDING = 10
export const HUB_ITEM_FILTER_STATUS_IN = 20
export const HUB_ITEM_FILTER_STATUS_EXPORT = 30
export const HUB_ITEM_FILTER_STATUS_RETURN = 40
export const HUB_ITEM_FILTER_STATUS_RESHIP = 50

export const HUB_ITEM_FILTER_STATUS_PENDING_TEXT = 'pending'
export const HUB_ITEM_FILTER_STATUS_IN_TEXT = 'in_hub'
export const HUB_ITEM_FILTER_STATUS_EXPORT_TEXT = 'export_hub'
export const HUB_ITEM_FILTER_STATUS_RETURN_TEXT = 'return'
export const HUB_ITEM_FILTER_STATUS_RESHIP_TEXT = 'reship'

export const HUB_TAB = [
  {
    value: HUB_ITEM_FILTER_STATUS_PENDING_TEXT,
    text: 'Lô hàng sắp đến',
  },

  {
    value: HUB_ITEM_FILTER_STATUS_IN_TEXT,
    text: 'Đơn/kiện trong hub',
  },
  {
    value: HUB_ITEM_FILTER_STATUS_EXPORT_TEXT,
    text: 'Đơn/kiện xuất hub',
  },
]

export const HUB_TAB_SLUG = {
  [HUB_ITEM_FILTER_STATUS_PENDING]: 'pending',
  [HUB_ITEM_FILTER_STATUS_IN]: 'in_hub',
  [HUB_ITEM_FILTER_STATUS_EXPORT]: 'export_hub',
  [HUB_ITEM_FILTER_STATUS_RETURN]: 'return',
  [HUB_ITEM_FILTER_STATUS_RESHIP]: 'reship',
}

export const HUB_TAB_IDS = {
  pending: HUB_ITEM_FILTER_STATUS_PENDING,
  in_hub: HUB_ITEM_FILTER_STATUS_IN,
  export_hub: HUB_ITEM_FILTER_STATUS_EXPORT,
  return: HUB_ITEM_FILTER_STATUS_RETURN,
  reship: HUB_ITEM_FILTER_STATUS_RESHIP,
}

export const EXPORT_HUB_TAB = [
  {
    value: 'container',
    text: 'Kiện hàng',
  },
  {
    value: 'package',
    text: 'Đơn hàng',
  },
]
export const ALLOW_MIME_TYPE_FILE_RETURN = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/vnd.ms-excel',
  'application/csv',
  'application/x-csv',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

export const REGEX_ALLOW_FILE_RETURN_EXTENSION =
  /(\.jpg|\.jpeg|\.png|\.csv|\.xlsx)$/i
