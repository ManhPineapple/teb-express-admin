import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * fetch list product
   * @param payload
   * @return {*}
   */

  fetchShipment(payload) {
    return http.get(`/shipments/${payload.id}?${buildQueryString(payload)}`)
  },
  appendShipment(payload) {
    return http.put(`/shipments/append`, payload)
  },
  appendContainersShipment(payload) {
    return http.put(`/shipments/append/containers`, payload)
  },
  cancelContainer(payload) {
    return http.put(`/shipments/cancel-container/`, payload)
  },
  cancelShipment(payload) {
    return http.put(`/shipments/cancel/${payload.id}`)
  },
  closeShipment(payload) {
    return http.put(`/shipments/close`, payload)
  },
  intransitShipment(payload) {
    return http.put(`/shipments/intransit/${payload.id}`)
  },
  fetchListShipments(payload) {
    return http.get(`/shipments?${buildQueryString(payload)}`)
  },
  countListShipments(payload) {
    return http.get(`/shipments/count?${buildQueryString(payload)}`)
  },
  createShipment(payload) {
    return http.post(`/shipments/create`, payload)
  },
  exportShipment(payload) {
    return http.post('/shipments', payload, {
      base_path: 'v1/export/shipment',
    })
  },
  downloadShipmentLabelZip(payload) {
    return http.get(`/shipments/zip/${payload.id}`)
  },
  exportCustomsForm(payload) {
    return http.get(`/shipments/deep-detail/${payload.id}`)
  },
}
