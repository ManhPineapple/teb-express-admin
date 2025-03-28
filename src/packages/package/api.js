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

  processPackageCn(payload) {
    return http.post(`/packages/process_cn`, payload)
  },

  /**
   * fetch list product
   * @param payload
   * @return {*}
   */
  fetchListProduct(payload) {
    return http.get(`/products?${buildQueryString(payload)}`)
  },
  countListProduct(payload) {
    return http.get(`/products/count?${buildQueryString(payload)}`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchListService() {
    return http.get(`/services`)
  },
  fetchListPackages(payload) {
    return http.get(`/packages?${buildQueryString(payload)}`)
  },
  countListPackages(payload) {
    return http.get(`/packages/count?${buildQueryString(payload)}`)
  },
  importPackage(payload) {
    const formData = new FormData()

    formData.append('file', payload.file)
    return http.post('/packages/import', formData)
  },
  exportPackage(payload) {
    return http.post('/packages/list', payload, {
      base_path: 'v1/export/shipment',
    })
  },
  exportPackageAu(payload) {
    return http.post('/packages/au', payload, {
      base_path: 'v1/export/shipment',
    })
  },
  ocrPackage(payload) {
    return http.post(`/packages/ocr`, payload)
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
  reshipPackage(payload) {
    return http.post(`/packages/${payload.id}/reship`, payload)
  },
  fetchFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
  fetchListPackagesReturn(payload) {
    return http.get(`/packages/returned?${buildQueryString(payload)}`)
  },
  countListPackagesReturn(payload) {
    return http.get(`/packages/returned/count?${buildQueryString(payload)}`)
  },
  reshipPackageEstimateCost(payload) {
    return http.post(`/packages/${payload.id}/reship/estimate-cost`, payload)
  },
  createEventTracking(payload) {
    return http.post(`/packages/tracking`, payload)
  },
  fetchCustomerShipment(payload) {
    return http.get(`/shipments/customer?${buildQueryString(payload)}`)
  },
  countCustomerShipment(payload) {
    return http.get(`/shipments/customer/count?${buildQueryString(payload)}`)
  },
  fetchDetailCustomerShipment(payload) {
    return http.get(`/shipments/customer/${payload.id}`)
  },
  importTracking(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    return http.post('/packages/import/tracking', formData)
  },
  confirmAddress(payload) {
    return http.post('/address/validate', payload, {
      base_path: '/v1/packages',
    })
  },
  getCNInvoiceImage(url) {
    return http.get(
      '/uploads/file-export/download?type=export_packages&url=' + url,
      {
        type: 'blob',
      }
    )
  },
}
