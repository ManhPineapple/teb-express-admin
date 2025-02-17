import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  fetchTransactionLogs(payload) {
    return http.get(`/transactions?${buildQueryString(payload)}`)
  },
  countTransactionLogs(payload) {
    return http.get(`/transactions/count?${buildQueryString(payload)}`)
  },
  changeStatusTransaction(payload) {
    return http.put(`/transactions/status`, payload)
  },
}
