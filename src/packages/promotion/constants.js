export const PROMOTION_STATUS_ACTIVE = 1
export const PROMOTION_STATUS_DEACTIVATE = 2
export const PROMOTION_STATUS_DRAFT = 3

export const PROMOTION_TYPE_SYSTEM = 1
export const PROMOTION_TYPE_MARKETING = 2
export const PROMOTION_INSURED_ID = 83

export const MAP_PROMOTION_STATUS_TEXT = {
  [PROMOTION_STATUS_ACTIVE]: 'Active',
  [PROMOTION_STATUS_DEACTIVATE]: 'Disable',
  [PROMOTION_STATUS_DRAFT]: 'Chờ phê duyệt',
}

export const MAP_PROMOTION_STATUS_CLASS = {
  [PROMOTION_STATUS_ACTIVE]: 'text-success',
  [PROMOTION_STATUS_DEACTIVATE]: 'text-danger',
  [PROMOTION_STATUS_DRAFT]: 'text-warning',
}

export const PROMOTION_STATUS_TABS = [
  {
    value: PROMOTION_STATUS_ACTIVE,
    text: 'Active',
  },
  {
    value: PROMOTION_STATUS_DEACTIVATE,
    text: 'Disable',
  },
  {
    value: PROMOTION_STATUS_DRAFT,
    text: 'Chờ phê duyệt',
  },
]
