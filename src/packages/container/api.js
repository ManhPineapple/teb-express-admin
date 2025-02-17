import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  fetchListContainers(payload) {
    return http.get(`/containers?${buildQueryString(payload)}`)
  },
  countListContainers(payload) {
    return http.get(`/containers/count?${buildQueryString(payload)}`)
  },
  fetchListContainerBoxes() {
    return http.get(`/containers/box`)
  },
  createContainer(payload) {
    return http.post(`/containers`, payload)
  },
  updateContainer(payload) {
    return http.put(`/containers/${payload.id}`, payload)
  },
  detailContainer(payload) {
    return http.get(`/containers/${payload.code}?${buildQueryString(payload)}`)
  },

  appendPackage(payload) {
    return http.post(`/containers/append`, payload)
  },

  removePackage(payload) {
    return http.put(`/containers/remove`, payload)
  },

  closeContainer(payload) {
    return http.put(`/containers/close/${payload.id}`, payload)
  },

  historyContainer(payload) {
    return http.get(`/containers/history/${payload.id}`)
  },

  cancelContainer(payload) {
    return http.put(`/containers/cancel/${payload.id}`, payload)
  },

  openContainer(payload) {
    return http.put(`/containers/open/${payload.id}`)
  },

  downloadLabel(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },

  createContainerEvent(payload) {
    return http.post('/containers/events', payload)
  },
  importContainerEvent(payload) {
    return http.post('/containers/events/import', payload)
  },
}
