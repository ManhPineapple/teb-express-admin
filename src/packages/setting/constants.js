import {
  ROLE_ADMIN,
  ROLE_ACCOUNTANT,
  ROLE_WAREHOUSE,
  ROLE_SUPPORT,
  ROLE_HUB,
  ROLE_SUPPORT_LEADER,
  USER_ROLE_MARKETING,
  ROLER_BUSSINESS_MANAGER,
  ROLER_SHIP_PARTNER,
  ROLE_SALE,
  ROLE_SALE_OPERATION,
} from '@core/constants'

export const USER_STATUS_DEACTIVE = 0
export const USER_STATUS_ACTIVE = 1
export const USER_STATUS_INACTIVE = 2
export const CANCEL_MAX_AMOUNT = '200'

export const SETTING_STATUS_ENABLE = 1
export const SETTING_STATUS_DISABLE = 0

export const PipEmailTypeNotPass = 2
export const PipEmailTypePass = 1
export const PipEmailTurnFirst = 1
export const PipEmailTurnLast = 2

export const HUB_TYPE = 1
export const WAREHOUSE_TYPE = 2

export const USER_STATUS_TAB = {
  'Không hoạt động': 0,
  'Hoạt động': 1,
}

export const CUSTOMER_STATUS_TAB = {
  'Tài khoản mở': 1,
  'Chờ kích hoạt': 2,
  'Tài khoản đóng': 0,
}

export const COUPON_TYPE_MONEY = 1
export const COUPON_TYPE_DISCOUNT_MONEY = 2
export const COUPON_TYPE_DISCOUNT_PERCENT = 3

export const TYPE_COUPON = {
  [COUPON_TYPE_MONEY]: 'Tặng tiền',
  [COUPON_TYPE_DISCOUNT_MONEY]: 'Giảm giá',
  [COUPON_TYPE_DISCOUNT_PERCENT]: 'Giảm giá',
}

export const ROLE = [
  {
    key: ROLE_ADMIN,
    name: 'Admin',
  },
  {
    key: ROLE_ACCOUNTANT,
    name: 'Kế toán',
  },
  {
    key: ROLE_WAREHOUSE,
    name: 'Kho',
  },
  {
    key: ROLE_SUPPORT,
    name: 'Support',
  },
  {
    key: ROLE_SUPPORT_LEADER,
    name: 'Support Leader',
  },
  {
    key: ROLE_HUB,
    name: 'Hub',
  },
  {
    key: USER_ROLE_MARKETING,
    name: 'Marketing',
  },
  {
    key: ROLER_BUSSINESS_MANAGER,
    name: 'Business Manager',
  },
  {
    key: ROLER_SHIP_PARTNER,
    name: 'Ship Partner',
  },
  {
    key: ROLE_SALE,
    name: 'Sale',
  },
  {
    key: ROLE_SALE_OPERATION,
    name: 'Sale Operation',
  },
]

export const USER_CLASS_PUBLIC = 1
export const USER_CLASS_PRIORITY = 2
export const USER_CLASS_PARTNER = 3

export const MAP_USER_CLASS_ICON = {
  [USER_CLASS_PUBLIC]: 'public-class',
  [USER_CLASS_PRIORITY]: 'priority-class',
  [USER_CLASS_PARTNER]: 'partner-class',
}

export const MAP_USER_CLASS_TEXT = {
  [USER_CLASS_PUBLIC]: 'Public',
  [USER_CLASS_PRIORITY]: 'Priority',
  [USER_CLASS_PARTNER]: 'Partner',
}

export const DEBT_LIMIT = [
  { id: 1, value: 2000 },
  { id: 2, value: 4000 },
  { id: 3, value: 5000 },
  { id: 4, value: 8000 },
  { id: 5, value: 10000 },
]
export const DAY_LIMIT = [
  { id: 1, value: 7 },
  { id: 2, value: 15 },
  { id: 3, value: 30 },
  { id: 4, value: 90 },
  { id: 5, value: 180 },
]

export const OPTIONS_PACKAGES = [
  { id: 1, value: 'Không có nhu cầu thường xuyên' },
  { id: 2, value: '< 150 đơn' },
  { id: 3, value: '150 - 900 đơn' },
  { id: 4, value: '900 - 3000 đơn' },
  { id: 5, value: '3000 - 6000 đơn' },
  { id: 6, value: '> 6000 đơn' },
]

export const SERVICE_CODE_FBA = 'FBA'

export const CARRIER_CODE_IBBLUE = 'IBBLUE'
export const CARRIER_CODE_SHIPPO = 'SHIPPO'
export const CARRIER_CODE_SHIPSAVING = 'SHIPSAVING'
