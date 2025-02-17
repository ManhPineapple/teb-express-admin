import api from '../api'

export const FETCH_LIST_TRANSACTIONS = 'fetchListTransactions'
export const COUNT_LIST_TRANSACTIONS = 'countListTransactions'
export const CHANGE_STATUS_TRANSACTION = 'changeStatusTransaction'

export const state = {
  transactions: [],
  count: 0,
  count_status: [],
}

export const mutations = {
  [FETCH_LIST_TRANSACTIONS]: (state, payload) => {
    state.transactions = payload
  },
  [COUNT_LIST_TRANSACTIONS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.all
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_TRANSACTIONS]({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchTransactionLogs(payload),
      api.countTransactionLogs(payload),
    ])
    if (!list.transactions || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
      commit(FETCH_LIST_TRANSACTIONS, [])
      commit(COUNT_LIST_TRANSACTIONS, 0)
      return result
    }
    commit(FETCH_LIST_TRANSACTIONS, list.transactions)
    commit(COUNT_LIST_TRANSACTIONS, count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CHANGE_STATUS_TRANSACTION]({ commit }, payload) {
    let result = { success: true }
    const res = await api.changeStatusTransaction(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },
}
