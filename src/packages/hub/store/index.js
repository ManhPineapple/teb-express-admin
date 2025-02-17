import { SERVER_ERROR_MESSAGE } from '@/core/constants/http'
import api from '../api'

export const HUB_SEARCH_ITEMS = 'searchItems'
export const HUB_COUNT_SEARCH_ITEMS = 'countSearchItems'
export const HUB_RETURN = 'return'
export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'
export const GET_CONTAINER_IMPORT = 'getContainerImport'
export const FETCH_LIST_CONTAINER_IMPORTED = 'fetchListContainerImported'
export const COUNT_LIST_CONTAINER_IMPORTED = 'countListContainerImported'
export const COUNT_PACKAGE_CONTAINER_IMPORT = 'countPackageContainerImport'
export const SCAN_CONTAINER_IMPORT = 'scanContainerImport'
export const FETCH_LIST_IMPORTED = 'fetchListImported'
export const REMOVE_CONTAINER_IMPORT = 'removeContainerImport'
export const COUNT_LIST_IMPORTED = 'countListImported'
export const GET_IMPORT_HUB_DETAIL = 'getImportHubDetail'
export const SCAN_EXPORT_HUB = 'scanExportHub'
export const HUB_SCAN_RETURN = 'hubScanReturn'
export const REMOVE_SCAN_RETURN_ITEM = 'hubRemoveScanReturnItem'

export const state = {
  items: [],
  count: 0,
  package: {},
  container: {},
  countPackages: 0,
  containers: [],
  listImported: [],
  coutListImported: 0,
  importHubDetail: {},
}

export const mutations = {
  [HUB_SEARCH_ITEMS]: (state, items) => {
    state.items = items
  },
  [HUB_COUNT_SEARCH_ITEMS]: (state, count) => {
    state.count = count
  },
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package = payload
  },
  [GET_CONTAINER_IMPORT]: (state, payload) => {
    state.container = payload
  },
  [FETCH_LIST_CONTAINER_IMPORTED]: (state, payload) => {
    state.containers = payload
  },
  [COUNT_LIST_CONTAINER_IMPORTED]: (state, payload) => {
    state.count = payload
  },
  [COUNT_PACKAGE_CONTAINER_IMPORT]: (state, payload) => {
    state.countPackages = payload
  },
  [FETCH_LIST_IMPORTED]: (state, payload) => {
    state.listImported = payload
  },
  [COUNT_LIST_IMPORTED]: (state, payload) => {
    state.coutListImported = payload
  },
  [GET_IMPORT_HUB_DETAIL]: (state, payload) => {
    state.importHubDetail = payload
  },
}

export const actions = {
  async [HUB_SEARCH_ITEMS]({ commit }, payload) {
    commit(HUB_SEARCH_ITEMS, [])

    const res = await api.search(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    commit(HUB_SEARCH_ITEMS, res.items)
    return { error: false }
  },

  async [HUB_COUNT_SEARCH_ITEMS]({ commit }, payload) {
    commit(HUB_COUNT_SEARCH_ITEMS, 0)

    const res = await api.countSearch(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    commit(HUB_COUNT_SEARCH_ITEMS, res.count)
    return { error: false }
  },

  // eslint-disable-next-line
  async [HUB_RETURN]({ commit }, payload) {
    const res = await api.return(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    return { error: false }
  },

  // eslint-disable-next-line
  async [HUB_SCAN_RETURN]({ commit }, payload) {
    const res = await api.scanReturn(payload)
    if (!res || res.error || !res.package) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    return { error: false, package: res.package }
  },

  // eslint-disable-next-line
  async [REMOVE_SCAN_RETURN_ITEM]({ commit }, payload) {
    const res = await api.removeScanReturnItem(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }
    return { error: false }
  },

  async [FETCH_PACKAGE_DETAIL]({ commit }, packageId) {
    commit(FETCH_PACKAGE_DETAIL, {})

    const res = await api.fetchPackageDetail(packageId)
    if (!res || res.error) {
      return {
        error: true,
        message: res.errorMessage || SERVER_ERROR_MESSAGE,
        package: {},
      }
    }

    commit(FETCH_PACKAGE_DETAIL, res.package)
    return { error: false, package: res.package }
  },

  // eslint-disable-next-line no-unused-vars
  async [GET_CONTAINER_IMPORT]({ commit }, payload) {
    let result = { success: true }

    let response = await api.getContainerImport(payload)
    if (
      (!response || !response.container) &&
      (!response || !response.package)
    ) {
      result = {
        success: false,
        message: response.errorMessage,
      }
      return result
    }

    result = {
      success: true,
      type: response.container ? 'container' : 'package',
    }
    commit(
      GET_IMPORT_HUB_DETAIL,
      response.container ? response.container : response.package
    )

    commit(
      GET_CONTAINER_IMPORT,
      response.container ? response.container : response.package
    )
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_CONTAINER_IMPORTED]({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListContainerImported(payload),
      api.countListContainerImported(payload),
    ])

    if (!list.containers || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }

    commit(FETCH_LIST_CONTAINER_IMPORTED, list.containers)
    commit(COUNT_LIST_CONTAINER_IMPORTED, count.count)

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [SCAN_CONTAINER_IMPORT]({ commit }, payload) {
    let result = { success: true }

    let response = await api.scanContainerImport(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [REMOVE_CONTAINER_IMPORT]({ commit }, payload) {
    let result = { success: true }

    let response = await api.removeContainerImport(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_IMPORTED]({ commit }, payload) {
    let result = { success: true }

    let res = await api.fetchListImported(payload)
    if (!res || res.error) {
      res.count = 0
      res.codes = []
      result = { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_IMPORTED, res.codes)
    commit(COUNT_LIST_IMPORTED, res.count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [GET_IMPORT_HUB_DETAIL]({ commit }, payload) {
    let result = { success: true }

    let response = await api.getImportHubDetail(payload)
    if (
      (!response || !response.container) &&
      (!response || !response.package)
    ) {
      result = {
        success: false,
        message: response.errorMessage,
      }
      return result
    }
    result = {
      success: true,
      type: response.container ? 'container' : 'package',
    }
    commit(
      GET_IMPORT_HUB_DETAIL,
      response.container ? response.container : response.package
    )
    if (response.container_count > 0) {
      commit(COUNT_PACKAGE_CONTAINER_IMPORT, response.container_count)
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [SCAN_EXPORT_HUB]({ commit }, payload) {
    let result = { success: true }

    let response = await api.scanExportHub(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
