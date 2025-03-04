import { RESPONSE_TYPE_BLOB } from '@core/constants/http'
import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * fetch package
   * @param payload
   * @return {*}
   */
  fetchPackage(payload) {
    return http.get(`/packages/${payload}`)
  },

  fetchPackageByCode(payload) {
    return http.get(`/packages/code/${payload}`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchListService() {
    return http.get(`/services`)
  },
  fetchListPackageInWareHouse(payload) {
    return http.get(
      `/warehouses/packages-in-warehouse?${buildQueryString(payload)}`
    )
  },
  countListPackageInWareHouse(payload) {
    return http.get(
      `/warehouses/packages-in-warehouse/count?${buildQueryString(payload)}`
    )
  },
  importPackage(payload) {
    const formData = new FormData()

    formData.append('file', payload.file)
    return http.post('/packages/import', formData)
  },
  exportPackage(payload) {
    return http.post('/packages', payload, { base_path: '/v1/export/shipment' })
  },
  updatePackage(payload) {
    return http.put(`/packages/${payload.id}`, payload)
  },
  processPackage(payload) {
    return http.post(`/packages/process`, payload)
  },
  fetchBarcodeFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
  cancelPackages(payload) {
    return http.put(`/packages/cancel`, payload)
  },
  returnPackage(payload) {
    return http.post(`/warehouses/packages/return`, payload)
  },
  exportWarehousePackage(payload) {
    return http.post('/packages-in-warehouse', payload, {
      base_path: 'v1/export/shipment',
    })
  },
  exportWarehousePackageWrong(payload) {
    return http.post('/packages/list/wrong-weight', payload, {
      base_path: 'v1/export/shipment',
    })
  },
  createLabelsPdf(payload) {
    const formdata = new FormData()
    formdata.append('file', payload.file)
    return http.post('/warehouses/pdf-labels', formdata)
  },
  cancelLabel(payload) {
    return http.put(`/warehouses/cancel-label`, payload)
  },

  /**
   * Lấy thông tin đơn hàng theo mã vận đơn
   * @param code mã vận đơn
   * @return Promise
   */
  getPackage(code) {
    return http.get(`/warehouses/packages/${code}`)
  },

  /**
   * Tạo label đơn hàng
   * @param payload
   * @return Promise
   */
  createLabel(payload) {
    return http.post(`/warehouses/packages/labels/${payload.id}`, payload)
  },

  /**
   * Lấy thông tin checkin request
   * @return Promise
   */
  getCheckin() {
    return http.get(`/checkins`)
  },

  /**
   * Đóng checkin request
   * @param payload
   * @return Promise
   */
  closeCheckin(payload) {
    return http.put(`/checkins/close`, payload)
  },
  // duyet don va tao label
  acceptAndLabel(payload) {
    return http.post(`/warehouses/packages/${payload.id}/accept`, payload)
  },
  checkIn(code) {
    return http.get(`/warehouses/packages/${code}/check-in`)
  },
  checkRelabel(payload) {
    return http.post(
      `/warehouses/packages/${payload.id}/check-relabel`,
      payload
    )
  },
}
