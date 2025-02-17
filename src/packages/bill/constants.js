export const EditFeeBill = 8
export const ExtraFeeBill = 7
export const BILLING_STATUS_AWAITING_PAYMENT = 1
export const BILLING_STATUS_UNPAID = 2
export const BILLING_STATUS_PAID = 3
export const BILLING_STATUS_CANCELED = 4

export const BILL_STATUS_TAB = [
  {
    value: BILLING_STATUS_AWAITING_PAYMENT,
    text: 'Chờ trả tiền',
  },
  {
    value: BILLING_STATUS_PAID,
    text: 'Đã trả tiền',
  },
  {
    value: BILLING_STATUS_CANCELED,
    text: 'Đã huỷ',
  },
]

export const BILL_MAP_NAME_STATUS = {
  [BILLING_STATUS_AWAITING_PAYMENT]: {
    value: 'Tạo mới',
    class: 'badge-primary',
  },
  [BILLING_STATUS_UNPAID]: {
    value: 'Chờ lấy',
    class: 'badge-success',
  },
  [BILLING_STATUS_PAID]: {
    value: 'Đã lấy',
    class: 'badge-success',
  },
  [BILLING_STATUS_CANCELED]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
}
