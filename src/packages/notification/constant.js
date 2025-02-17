export const NOTIFY_EMAIL_NOT_SEND = 0
export const NOTIFY_EMAIL_SENT = 1

export const NOTIFY_NOT_PROCESSED = 0

export const NOTIFY_TYPE_ORDER_UPDATE = 1
export const NOTIFY_TYPE_FINANCE_UPDATE = 2
export const NOTIFY_TYPE_ANNOUNCEMENT = 3
export const NOTIFY_TYPE_SERVICE_UPDATE = 4
export const NOTIFY_TYPE_PROMOTION = 5
export const NOTIFY_TYPE_EXPORT_FILE = 6

export const NOTIFY_TYPE = [
  {
    text: 'Order updates',
    value: NOTIFY_TYPE_ORDER_UPDATE,
  },
  {
    text: 'Finance updates',
    value: NOTIFY_TYPE_FINANCE_UPDATE,
  },
  {
    text: 'Announcements',
    value: NOTIFY_TYPE_ANNOUNCEMENT,
  },
  {
    text: 'Service Updates',
    value: NOTIFY_TYPE_SERVICE_UPDATE,
  },
  {
    text: 'Promotions',
    value: NOTIFY_TYPE_PROMOTION,
  },
]
