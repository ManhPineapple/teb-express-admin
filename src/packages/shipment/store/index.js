import api from '../api'

export const FETCH_SHIPMENT_DETAIL = 'fetchShipmentDetail'
export const APPEND_SHIPMENT = 'appendShipment'
export const APPEND_CONTAINERS_SHIPMENT = 'appendContainersShipment'
export const CANCEL_CONTAINER = 'cancelContainer'
export const CANCEL_SHIPMENT = 'cancelShipment'
export const CLOSE_SHIPMENT = 'closeShipment'
export const INTRANSIT_SHIPMENT = 'intransitShipment'
export const FETCH_LIST_SHIPMENT = 'fetchListShipments'
export const COUNT_LIST_SHIPMENTS = 'countListShipments'
export const CREATE_SHIPMENT = 'createShipment'
export const EXPORT_SHIPMENT = 'exportShipment'
export const DOWNLOAD_SHIPMENT_LABEL_ZIP = 'downloadShipmentLabelZip'
export const EXPORT_CUSTOMS_FORM = 'exportCustomsForm'

export const state = {
  shipment: {},
  containers: [],
  manifest: [],
  container_count: 0,
  shipments: [],
  count: 0,
  count_status: [],
}

export const mutations = {
  [FETCH_SHIPMENT_DETAIL]: (state, payload) => {
    state.shipment = payload.shipment
    state.containers = payload.containers
    state.manifest = payload.shipment.manifest
    state.container_count = payload.count_container
  },
  [FETCH_LIST_SHIPMENT]: (state, payload) => {
    state.shipments = payload
  },
  [COUNT_LIST_SHIPMENTS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.count_status
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_SHIPMENT_DETAIL]({ commit }, payload) {
    let result = { success: true }
    let response = await api.fetchShipment(payload)
    if (!response.shipment) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    commit(FETCH_SHIPMENT_DETAIL, response)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [APPEND_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.appendShipment(payload)
    if (!response.container || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
      return result
    }
    result.container = response.container
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [APPEND_CONTAINERS_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.appendContainersShipment(payload)
    if (!response.success || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
      return result
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CANCEL_CONTAINER]({ commit }, payload) {
    let result = { success: true }
    let response = await api.cancelContainer(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CANCEL_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.cancelShipment(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CLOSE_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.closeShipment(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [INTRANSIT_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.intransitShipment(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_SHIPMENT]({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListShipments(payload),
      api.countListShipments(payload),
    ])

    if (!list.shipments || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }
    commit(FETCH_LIST_SHIPMENT, list.shipments)
    commit(COUNT_LIST_SHIPMENTS, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async createShipment({ commit }, payload) {
    let result = { success: true }

    let response = await api.createShipment(payload)
    if (!response || !response.shipment) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportShipment(payload)

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
  async [EXPORT_CUSTOMS_FORM]({ commit }, payload) {
    const response = await api.exportCustomsForm(payload)
    let result
    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result = {
        success: true,
        shipmentId: response.shipmen_id,
        containers: response.containers,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [DOWNLOAD_SHIPMENT_LABEL_ZIP]({ commit }, payload) {
    let result = { success: true }
    let response = await api.downloadShipmentLabelZip(payload)
    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.url
    }
    return result
  },
}
