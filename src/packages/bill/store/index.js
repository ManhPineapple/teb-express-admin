import api from '../api'
export const FETCH_BILL_DETAIL = 'fetchBillDetail'
export const FETCH_BILL_EXTRA = 'fetchBillExtra'
export const COUNT_FEE_CREATE = 'countFeeCreate'
export const FETCH_FEE_CREATE = 'fetchFeeCreate'
export const COUNT_FEE_EXTRA = 'countFeeExtra'
export const FETCH_FEE_EXTRA = 'fetchFeeExtra'
export const FETCH_FEE_EXTRA_TYPES = 'fetchFeeExtraTypes'
export const BILL_FETCH = 'billFetch'
export const BILL_COUNT = 'billCount'
export const CANCEL_EXTRA_FEE = 'cancelExtraFee'
export const CREATE_EXTRA_FEE = 'createExtraFee'
export const EXPORT_BILL = 'exportBill'

export const state = {
  bill: {},
  feeEdit: [],
  feeCreate: [],
  feeExtra: [],
  countEdit: 0,
  countCreate: 0,
  countExtra: 0,
  bills: [],
  count: 0,
  extraFeeTypes: [],
}

export const mutations = {
  [FETCH_BILL_DETAIL]: (state, payload) => {
    state.bill = payload
  },
  [COUNT_FEE_CREATE]: (state, payload) => {
    state.countCreate = payload
  },
  [FETCH_FEE_CREATE]: (state, payload) => {
    state.feeCreate = payload
  },
  [COUNT_FEE_EXTRA]: (state, payload) => {
    state.countExtra = payload
  },
  [FETCH_FEE_EXTRA]: (state, payload) => {
    state.feeExtra = payload
  },
  [BILL_FETCH]: (state, payload) => {
    state.bills = payload
  },
  [BILL_COUNT]: (state, payload) => {
    state.count = payload
  },
  [FETCH_FEE_EXTRA_TYPES]: (state, payload) => {
    state.extraFeeTypes = payload
  },
}

export const actions = {
  async fetchBillDetail({ commit }, payload) {
    const res = await api.fetchBillDetail(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    commit(FETCH_FEE_CREATE, res.bill.package)
    commit(FETCH_BILL_DETAIL, res.bill)
    commit(COUNT_FEE_CREATE, res.count_package)

    return {
      success: true,
      total: res.total_fee,
      total_unpaid: res.total_unpaid,
    }
  },
  async fetchBillExtra({ commit }, payload) {
    const res = await api.fetchExtraFee(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_FEE_EXTRA, res.fees)
    commit(COUNT_FEE_EXTRA, res.count)

    return { success: true }
  },
  async fetchFeeExtraTypes({ commit }) {
    const res = await api.fetchExtraFeeTypes()
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_FEE_EXTRA_TYPES, res.extra_fee_types)
    return { success: true }
  },
  // eslint-disable-next-line no-unused-vars
  async cancelExtraFee({ commit }, payload) {
    const res = await api.cancelExtraFee(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    return { success: true }
  },

  async [BILL_FETCH]({ commit }, payload) {
    const res = await api.billList(payload)
    if (!res || res.error) {
      commit(BILL_FETCH, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(BILL_FETCH, res.bills || [])
    return { error: false }
  },

  async [BILL_COUNT]({ commit }, payload) {
    const res = await api.billCount(payload)
    if (!res || res.error) {
      commit(BILL_COUNT, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(BILL_COUNT, res.count || 0)
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [CREATE_EXTRA_FEE]({ commit }, payload) {
    const res = await api.createExtraFee(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    return { success: true }
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_BILL]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportBill(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.download
    }

    return result
  },
}
