import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  search(filters) {
    return http.get(`/hubs/search?${buildQueryString(filters)}`)
  },

  countSearch(filters) {
    return http.get(`/hubs/search/count?${buildQueryString(filters)}`)
  },

  return(payload) {
    return http.post(`/hubs/return/${payload.package_id}`, payload)
  },

  fetchFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },

  fetchPackageDetail(package_id) {
    return http.get(`/hubs/packages/${package_id}`)
  },

  getContainerImport(payload) {
    return http.get(`/hubs/import/${payload.code}`)
  },
  fetchListContainerImported(payload) {
    return http.get(`/hubs/import?${buildQueryString(payload)}`)
  },
  countListContainerImported(payload) {
    return http.get(`/hubs/import/count?${buildQueryString(payload)}`)
  },
  scanContainerImport(payload) {
    return http.post(`/hubs/import/scan`, payload)
  },
  removeContainerImport(payload) {
    return http.post(`/hubs/import/remove`, payload)
  },
  fetchListImported(payload) {
    return http.get(`/hubs/list-import?${buildQueryString(payload)}`)
  },
  getImportHubDetail(payload) {
    return http.post(`/hubs/import-detail/${payload.code}`, payload.codes)
  },
  scanExportHub(payload) {
    return http.post(`/hubs/export/scan`, payload)
  },
  scanReturn(payload) {
    return http.post(`/hubs/package/return`, payload)
  },
  removeScanReturnItem(payload) {
    return http.delete(`/hubs/package/return/${payload.id}`)
  },
}
