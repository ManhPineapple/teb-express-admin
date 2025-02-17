import api from '../api'
import { SERVICE_CODE_FBA } from '../constants'

/**
 * Type
 */
export const LIST_USER = 'listUser'
export const COUNT_USER = 'countUser'
export const LIST_APPRAISER = 'listAppraiser'
export const CREATE_USER = 'createUser'
export const APPRAI = 'apprai'
export const UPDATE_STATUS_USER = 'updateStatusUser'
export const UPDATE_ROLE_USER = 'updateRoleUser'
export const EXPORT_PACKAGE = 'exportPackage'
export const FETCH_SERVICES = 'fetchServicers'
export const FETCH_RATE_EXCHANGE = 'fetchRateExchange'
export const UPDATE_RATE_EXCHANGE = 'updateRateExchange'
export const SWICTH_TYPE = 'swicthType'
export const SWICTH_SERVICE = 'swicthService'
export const UPDATE_PRICES = 'updatePrices'
export const UPDATE_PRICE = 'updatePrice'
export const DISCARD_UPDATE_PRICE = 'discard_update_price'
export const UPDATE_USER_INFO = 'updateUserInfo'
export const UPDATE_USER = 'updateUser'

export const FETCH_LIST_CHECK_PRICE_LOGS = 'fetchListCheckPriceLogs'
export const FETCH_COUNT_CHECK_PRICE_LOGS = 'fetchCountCheckPriceLogs'
export const FETCH_CARRIER_SERVICE = 'fetchCarrierService'
export const UPDATE_CARRIER_SERVICE = 'updateCarrierService'

export const FETCH_CUSTOMER_SALER = 'fetchCustomerSaler'
export const FETCH_DETAIL_SALER = 'fetchDetailSaler'
export const FETCH_REVENUE_SALER = 'fetchRevenueSaler'
export const FETCH_MONTH_REVENUE_SALER = 'fetchMonthRevenueSaler'
export const FETCH_LIST_SALES = 'fetchListSales'
export const FETCH_COUNT_SALES = 'fetchCountSales'

export const INVITE_CUSTOMER = 'inviteCustomer'

export const CREATE_COUPON = 'createCoupon'
export const GET_LIST_COUPON = 'getListCoupon'
export const COUNT_LIST_COUPON = 'countListCoupon'
export const GET_DETAIL_COUPON = 'getDetailCoupon'
export const ADD_USER_COUPON = 'addUserCoupon'

export const FETCH_SETTING_POINT = 'fetchSettingPoint'
export const COUNT_SETTING_POINT = 'countSettingPoint'
export const CREATE_SETTING_POINT = 'createSettingPoint'
export const UPDATE_SETTING_POINT = 'updateSettingPoin'
export const SAVE_REFERAL_RATE = 'saveReferalRate'
export const FETCH_REFERAL_RATE = 'fetchReferalRate'
export const SAVE_SETTING_KPI = 'saveSettingKpi'
export const FETCH_SETING_KPI = 'fetchSettingKpi'

import {
  USER_CLASS_PUBLIC,
  USER_CLASS_PRIORITY,
  USER_CLASS_PARTNER,
  MAP_USER_CLASS_TEXT,
} from '../constants'

/**
 * State
 */
export const state = {
  user: {},
  users: [],
  appraisers: [],
  count_user: 0,
  services: [],
  allPrices: [],
  types: [
    {
      text: 'Public',
      value: USER_CLASS_PUBLIC,
      active: true,
    },
    {
      text: 'Priority',
      value: USER_CLASS_PRIORITY,
      active: false,
    },
    {
      text: 'Partner',
      value: USER_CLASS_PARTNER,
      active: false,
    },
  ],
  filter: {
    user_class: USER_CLASS_PUBLIC,
    service: 0,
  },
  rate_exchange: 0,
  user_info: {},
  check_price_logs: [],
  count_check_price_logs: 0,
  carrier_service: {},
  saler: {},
  customers: [],
  totalRevenue: 0,
  topCustomers: [],
  sales: [],
  count_sales: 0,
  coupons: [],
  countCoupons: 0,
  settingPoint: [],
  countSettingPoint: 0,
}

/**
 * Mutation
 */
export const mutations = {
  [LIST_USER]: (state, payload) => {
    state.users = payload
  },
  [COUNT_USER]: (state, payload) => {
    state.count_user = payload
  },
  [LIST_APPRAISER]: (state, payload) => {
    state.appraisers = payload
  },
  [FETCH_RATE_EXCHANGE]: (state, payload) => {
    state.rate_exchange = payload
  },
  [FETCH_SERVICES]: (state, payload) => {
    state.services = payload
    state.allPrices.length = 0
    for (const service of state.services) {
      if (!service.prices) {
        continue
      }

      for (const { id, user_class, weight, price } of service.prices) {
        state.allPrices.push({
          id,
          price,
          new_price: price,
          weight,
          user_class,
          service_id: service.id,
          service_name: service.name,
          service_code: service.code,
          type_name: MAP_USER_CLASS_TEXT[parseInt(user_class)],
        })
      }
    }

    state.types = state.types.map((item) => {
      item.active = item.value == state.filter.user_class
      return item
    })

    state.filter.service = state.services.length ? state.services[0].id : 0
  },
  [SWICTH_TYPE]: (state, payload) => {
    state.filter.user_class = payload
    state.types = state.types.map((item) => {
      item.active = item.value == payload
      return item
    })
  },
  [SWICTH_SERVICE]: (state, payload) => {
    state.filter.service = payload
  },
  [UPDATE_PRICE]: (state, { id, price }) => {
    const item = state.allPrices.find((v) => v.id == id)
    if (!item) return

    if (item.new_price != price) {
      item.new_price = price
    }
  },
  [DISCARD_UPDATE_PRICE]: (state) => {
    state.allPrices = state.allPrices.map((item) => {
      if (item.price != item.new_price) {
        item.new_price = item.price
      }

      return item
    })
  },
  [UPDATE_PRICES]: (state) => {
    state.allPrices = state.allPrices.map((item) => {
      if (item.price != item.new_price) {
        item.price = item.new_price
      }

      return item
    })
  },
  [UPDATE_USER_INFO]: (state, payload) => {
    state.user_info = payload
  },
  [FETCH_LIST_CHECK_PRICE_LOGS]: (state, payload) => {
    state.check_price_logs = payload
  },
  [FETCH_COUNT_CHECK_PRICE_LOGS]: (state, payload) => {
    state.count_check_price_logs = payload
  },
  [FETCH_CARRIER_SERVICE]: (state, payload) => {
    state.carrier_service = payload
  },
  [FETCH_DETAIL_SALER]: (state, payload) => {
    state.saler = payload.sale
  },
  [FETCH_REVENUE_SALER]: (state, payload) => {
    state.totalRevenue = payload.total_revenue
    state.topCustomers = payload.top_customers
  },
  [FETCH_LIST_SALES]: (state, payload) => {
    state.sales = payload
  },
  [FETCH_COUNT_SALES]: (state, payload) => {
    state.count_sales = payload
  },
  [GET_LIST_COUPON]: (state, payload) => {
    state.coupons = payload
  },
  [COUNT_LIST_COUPON]: (state, payload) => {
    state.countCoupons = payload
  },
  [FETCH_SETTING_POINT]: (state, payload) => {
    state.settingPoint = payload
  },
  [COUNT_SETTING_POINT]: (state, payload) => {
    state.countSettingPoint = payload
  },
}

export const getters = {
  hasChangePrice: (state) => {
    return state.allPrices.some(({ price, new_price }) => price != new_price)
  },
  prices: (state) => {
    const prices = state.allPrices.filter(
      ({ user_class, service_id }) =>
        state.filter.user_class == user_class &&
        state.filter.service == service_id
    )

    prices.sort((a, b) => a.weight < b.weight)

    const display = []
    for (const key in prices) {
      if (!Object.hasOwnProperty.call(prices, key)) continue

      const item = Object.assign({}, prices[key])

      let preweight = key > 0 ? prices[key - 1].weight || 0 : 0
      item.weight_text =
        preweight == 0 ? `<${item.weight}` : `${preweight}-${item.weight}`
      if (item.service_code != SERVICE_CODE_FBA) {
        display.push(item)
      } else if (preweight != 0) {
        display.push(item)
      }
    }

    return display
  },
}

/**
 * Actions
 */
export const actions = {
  // eslint-disable-next-line no-unused-vars
  async updateStatusUser({ commit }, payload) {
    const res = await api.updateStatusUser(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async updateRoleUser({ commit }, payload) {
    const res = await api.updateRoleUser(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  async listUser({ commit }, payload) {
    let success = true
    let message = ''

    let [list, count] = await Promise.all([
      api.listUsers(payload),
      api.countUsers(payload),
    ])
    if (!list || list.error || !count) {
      success = false
      message = list.errorMessage || ''
      list = []
      count = 0
    }

    commit(LIST_USER, list.users)
    commit(COUNT_USER, count.count)
    return { success, message }
  },

  /**
   * Create sender
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line no-unused-vars
  async listAppraiser({ commit }, payload) {
    let success = true
    let message = ''

    let list = await api.listUsers(payload)

    if (!list || list.error) {
      success = false
      message = list.errorMessage || ''
      list = []
    }

    commit(LIST_APPRAISER, list.users)
    return { success, message }
  },

  /**
   * Create sender
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async createUser({ commit }, payload) {
    const response = await api.createUser(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errors || response.error,
    }
  },

  /**
   * Apprai
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async apprai({ commit }, payload) {
    const response = await api.apprai(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errors || response.error,
    }
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_PACKAGE]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportPackage(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.download
      result.is_queue = response.is_queue
    }

    return result
  },
  [SWICTH_TYPE]({ commit }, payload) {
    commit(SWICTH_TYPE, payload)
  },
  [SWICTH_SERVICE]({ commit }, payload) {
    commit(SWICTH_SERVICE, payload)
  },
  async [FETCH_SERVICES]({ commit }) {
    commit(FETCH_SERVICES, [])

    const res = await api.fetchServices({ has_price: 'yes' })
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_SERVICES, res.services || [])
    return { error: false }
  },
  async [UPDATE_PRICES]({ commit, state }) {
    const prices = state.allPrices
      .filter(({ price, new_price }) => price != new_price)
      .map(({ id, new_price }) => ({
        price_id: id,
        price: parseFloat(new_price),
      }))

    if (!prices.length) {
      return { error: true, message: 'Không có thay đồi gì cả' }
    }

    const res = await api.updatePrices({ prices: prices })
    if (!res || res.error) {
      commit(DISCARD_UPDATE_PRICE)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(UPDATE_PRICES)
    return { error: false }
  },

  // eslint-disable-next-line
  async [UPDATE_USER_INFO]({ commit }, payload) {
    const res = await api.updateUserInfo(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(UPDATE_USER_INFO, res.user_info)
    return { error: false }
  },

  async [FETCH_RATE_EXCHANGE]({ commit }) {
    const res = await api.fetchRateExchange()
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_RATE_EXCHANGE, res.rate_exchange.price)
    return { error: false }
  },

  // eslint-disable-next-line
  async [UPDATE_RATE_EXCHANGE]({ commit }, payload) {
    const res = await api.updateRateExchange(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  // eslint-disable-next-line
  async [UPDATE_CARRIER_SERVICE]({ commit }, payload) {
    const res = await api.updateCarrierService(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  async [FETCH_CARRIER_SERVICE]({ commit }, payload) {
    const res = await api.fetchCarrierService(payload)
    if (!res || res.error) {
      commit(FETCH_CARRIER_SERVICE, {})
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_CARRIER_SERVICE, res)
    return { error: false }
  },

  async [FETCH_LIST_CHECK_PRICE_LOGS]({ commit }, payload) {
    const res = await api.fetchListCheckPriceLogs(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_CHECK_PRICE_LOGS, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_CHECK_PRICE_LOGS, res.logs)
    return { error: false }
  },

  async [FETCH_COUNT_CHECK_PRICE_LOGS]({ commit }, payload) {
    const res = await api.fetchCountCheckPriceLogs(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_CHECK_PRICE_LOGS, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_COUNT_CHECK_PRICE_LOGS, res.count)
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_CUSTOMER_SALER]({ commit }, payload) {
    const res = await api.fetchCustomerSaler(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, ...res }
  },
  async [FETCH_REVENUE_SALER]({ commit }, payload) {
    const res = await api.fetchRevenueSaler(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_REVENUE_SALER, res)
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_MONTH_REVENUE_SALER]({ commit }, payload) {
    const res = await api.fetchMonthRevenueSaler(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, month_revenue: res.month_revenue || [] }
  },

  async [FETCH_DETAIL_SALER]({ commit }, payload) {
    const res = await api.fetchDetailSaler(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_DETAIL_SALER, res)
    return {
      error: false,
      customer_count: res.customer_count,
    }
  },
  async [FETCH_LIST_SALES]({ commit }, payload) {
    const res = await api.fetchListSales(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_SALES, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_SALES, res.sales)
    return { error: false }
  },
  async [FETCH_COUNT_SALES]({ commit }, payload) {
    const res = await api.fetchCountSales(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_SALES, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_COUNT_SALES, res.count)
    return { error: false }
  },
  // eslint-disable-next-line
  async [UPDATE_USER]({ commit }, payload) {
    const res = await api.updateUser(payload)

    if (res && res.success) {
      return { success: true }
    }

    return {
      success: false,
      message: res.errors || res.error,
    }
  },

  // eslint-disable-next-line
  async [INVITE_CUSTOMER]({ commit }, payload) {
    const res = await api.invitesCustomer(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  // eslint-disable-next-line
  async [CREATE_COUPON]({ commit }, payload) {
    const res = await api.createCoupon(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  async [GET_LIST_COUPON]({ commit }, payload) {
    let success = true
    let message = ''

    let [list, count] = await Promise.all([
      api.getListCoupon(payload),
      api.countListCoupon(payload),
    ])
    if (!list || list.error || !count) {
      success = false
      message = list.errorMessage || ''
      list = []
      count = 0
    }

    commit(GET_LIST_COUPON, list.coupons || [])
    commit(COUNT_LIST_COUPON, count.count)
    return { success, message }
  },
  // eslint-disable-next-line
  async [GET_DETAIL_COUPON]({ commit }, payload) {
    const res = await api.fetchDetailCoupon(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, ...res }
  },
  // eslint-disable-next-line
  async [ADD_USER_COUPON]({ commit }, payload) {
    const id = payload.coupon_id
    delete payload.coupon_id
    const res = await api.saveUserCoupon(payload, id)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, ...res }
  },
  // eslint-disable-next-line
  async [FETCH_SETTING_POINT]({ commit }, payload) {
    let success = true
    let message = ''

    let [list, count] = await Promise.all([
      api.fetchListSettingPoint(payload),
      api.countListSettingPoint(payload),
    ])
    if (!list || list.error || !count) {
      success = false
      message = list.errorMessage || ''
      list = []
      count = 0
    }

    commit(FETCH_SETTING_POINT, list.settings || [])
    commit(COUNT_SETTING_POINT, count.count)
    return { success, message }
  },

  // eslint-disable-next-line
  async [CREATE_SETTING_POINT]({ commit }, payload) {
    const res = await api.createSettingPoint(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },
  // eslint-disable-next-line
  async [UPDATE_SETTING_POINT]({ commit }, payload) {
    const res = await api.updateSettingPoint(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  // eslint-disable-next-line
  async [SAVE_REFERAL_RATE]({ commit }, payload) {
    const res = await api.saveReferalRate(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },
  // eslint-disable-next-line
  async [FETCH_REFERAL_RATE]({ commit }, payload) {
    const res = await api.fetchReferalRate(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false, ...res }
  },

  // eslint-disable-next-line
  async [SAVE_SETTING_KPI]({ commit }, payload) {
    const res = await api.saveSettingKpi(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false, ...res }
  },

  // eslint-disable-next-line
  async [FETCH_SETING_KPI]({ commit }, payload) {
    const res = await api.fetchSettingKpi(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false, ...res }
  },
}
