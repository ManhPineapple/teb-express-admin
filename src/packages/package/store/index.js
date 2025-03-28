import api from '../api'

/**
 * Type
 */
export const FETCH_PACKAGE_DETAIL = 'fetchPackage'

export const FETCH_LIST_PACKAGES = 'fetchListPackages'
export const COUNT_LIST_PACKAGES = 'countListPackages'
export const FETCH_LIST_PRODUCTS = 'fetchListProducts'
export const COUNT_LIST_PRODUCTS = 'countListProducts'
export const FETCH_LIST_SERVICE = 'fetchListService'
export const IMPORT_PACKAGE = 'importPackage'
export const UPDATE_PACKAGE = 'updatePackage'
export const PROCESS_PACKAGE = 'processPackage'
export const CANCEL_PACKAGES = 'cancelPackages'
export const FETCH_LIST_PACKAGES_RETURN = 'fetchListPackagesReturn'
export const COUNT_LIST_PACKAGES_RETURN = 'countListPackagesReturn'
export const CREATE_EVENT_TRACKING = 'createEventTracking'
export const FETCH_CUSTOMER_SHIPMENT = 'fetchCustomerShipment'
export const COUNT_CUSTOMER_SHIPMENT = 'countCustomerShipment'
export const FETCH_DETAIL_CUSTOMER_SHIPMENT = 'fetchDetailCustomerShipment'

export const EXPORT_PACKAGE = 'exportPackage'
export const OCR_TIKTOK_LABEL = 'ocrTiktokLabel'
export const EXPORT_PACKAGE_AU = 'exportPackageAu'
export const GET_SERVICE = 'getService'
export const RESHIP_PACKAGE = 'reshipPackage'
export const RESHIP_PACKAGE_ESTIMATE_COST = 'reshipPackageEstimateCost'
export const IMPORT_TRACKING = 'importTracking'
export const CONFIRM_ADDRESS = 'confirmAddress'

/**
 * State
 */
export const state = {
  package_detail: {
    package: {},
    deliver_logs: [],
    price: 0.0,
    extra_fee: [],
    audit_logs: [],
  },
  packages: [],
  countPackages: 0,
  returnPackages: [],
  countReturnPackages: 0,
  count_status: [],
  products: [],
  service: [],
  countProducts: 0,
  customerShipments: [],
  customerShipment: {},
  customerShipmentPkgs: [],
  countCustomerShipments: 0,
}
/**
 * Getters
 */
export const getters = {
  [GET_SERVICE](state) {
    let sv = state.service.map((item) => {
      return { id: item.id, name: item.name }
    })
    return sv
  },
}
/**
 * Mutation
 */
export const mutations = {
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package_detail = payload
    state.package_detail.deliver_logs = payload.deliver_logs || []
  },
  [FETCH_LIST_PACKAGES]: (state, payload) => {
    state.packages = payload
  },
  [FETCH_LIST_PRODUCTS]: (state, payload) => {
    state.products = payload
  },
  [COUNT_LIST_PRODUCTS]: (state, payload) => {
    state.countProducts = payload.count
  },
  [FETCH_LIST_SERVICE]: (state, payload) => {
    state.service = payload
  },
  [COUNT_LIST_PACKAGES]: (state, payload) => {
    state.countPackages = payload.count
    state.count_status = payload.status_count
  },
  [FETCH_LIST_PACKAGES_RETURN]: (state, payload) => {
    state.returnPackages = payload
  },
  [COUNT_LIST_PACKAGES_RETURN]: (state, payload) => {
    state.countReturnPackages = payload.count
  },
  [FETCH_CUSTOMER_SHIPMENT]: (state, payload) => {
    state.customerShipments = payload.shipments
  },
  [COUNT_CUSTOMER_SHIPMENT]: (state, payload) => {
    state.countCustomerShipments = payload.count
  },
  [FETCH_DETAIL_CUSTOMER_SHIPMENT]: (state, payload) => {
    state.customerShipment = payload.shipment
    state.customerShipmentPkgs = payload.packages
    state.customerShipment.total_amount = payload.total_amount
  },
}

/**
 * Action
 */

export const actions = {
  async fetchPackage({ commit }, payload) {
    const res = await api.fetchPackage(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_PACKAGE_DETAIL, res)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListPackages({ commit }, payload) {
    let result = { success: true }
    let list = await api.fetchListPackages(payload)
    if (!list.packages) {
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_PACKAGES, list.packages)
    return result
  },

  async countListPackages({ commit }, payload) {
    let result = { success: true }
    let count = await api.countListPackages(payload)
    if (!count) {
      count = { count: 0 }
      result = {
        success: false,
        message: count.errorMessage || '',
      }
    }
    commit(COUNT_LIST_PACKAGES, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListPackagesReturn({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListPackagesReturn(payload),
      api.countListPackagesReturn(payload),
    ])
    if (list.error || list.errorMessage || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_PACKAGES_RETURN, list.packages || [])
    commit(COUNT_LIST_PACKAGES_RETURN, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListProducts({ commit }, payload) {
    let result = { error: false }
    let [list, count] = await Promise.all([
      api.fetchListProduct(payload),
      api.countListProduct(payload),
    ])
    if (!list.products || !count) {
      count = { count: 0 }
      result = {
        error: true,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_PRODUCTS, list.products)
    commit(COUNT_LIST_PRODUCTS, count)

    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListService({ commit }, payload) {
    const res = await api.fetchListService()

    if (!res.services) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_LIST_SERVICE, res.services)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async updatePackage({ commit }, payload) {
    const res = await api.updatePackage(payload)
    if (!res || !res.package) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async [IMPORT_PACKAGE]({ commit }, payload) {
    const response = await api.importPackage(payload)

    if (
      response &&
      typeof response.errors !== 'undefined' &&
      typeof response.total !== 'undefined' &&
      (response.errors.length || response.total > 0)
    ) {
      return {
        success: true,
        ...response,
      }
    }

    return {
      success: false,
      message: response.errorMessage || '',
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
    }

    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [OCR_TIKTOK_LABEL]({ commit }, payload) {
    let result = { success: true }
    const response = await api.ocrPackage(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_PACKAGE_AU]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportPackageAu(payload)

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

  // eslint-disable-next-line no-unused-vars
  async processPackage({ commit }, payload) {
    let result = { success: true }
    const res = await api.processPackage(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async cancelPackages({ commit }, payload) {
    let result = { success: true }
    const res = await api.cancelPackages(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [RESHIP_PACKAGE]({ commit }, payload) {
    const res = await api.reshipPackage(payload)
    if (!res || res.error || res.message) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [RESHIP_PACKAGE_ESTIMATE_COST]({ commit }, payload) {
    const res = await api.reshipPackageEstimateCost(payload)
    if (!res || res.error || res.message) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false, ...res }
  },

  // eslint-disable-next-line no-unused-vars
  async [CREATE_EVENT_TRACKING]({ commit }, payload) {
    const res = await api.createEventTracking(payload)
    if (!res || res.error || res.message) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false, ...res }
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_CUSTOMER_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchCustomerShipment(payload),
      api.countCustomerShipment(payload),
    ])
    if (list.error || !count) {
      result = {
        success: false,
        message: list.errorMessage || count.errorMessage || '',
      }
    }
    commit(COUNT_CUSTOMER_SHIPMENT, count)
    commit(FETCH_CUSTOMER_SHIPMENT, list)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_DETAIL_CUSTOMER_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.fetchDetailCustomerShipment(payload)
    if (!response.shipment) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    commit(FETCH_DETAIL_CUSTOMER_SHIPMENT, response)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [IMPORT_TRACKING]({ commit }, payload) {
    let result = { success: true }
    let res = await api.importTracking(payload)
    if (!res || res.error || res.message) {
      return { success: false, message: res.errorMessage }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CONFIRM_ADDRESS]({ commit }, payload) {
    let result = { success: true }
    let res = await api.confirmAddress(payload)
    if (!res || res.error || res.message) {
      return { success: false, message: res.errorMessage }
    }
    return result
  },
}
