import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  fetchListNotifyEmail(payload) {
    return http.get(`/notifies/email?${buildQueryString(payload)}`)
  },
  fetchDetailNotifyEmail(payload) {
    return http.get(`/notifies/email/${payload.id}`)
  },
  countNotifyEmail(payload) {
    return http.get(`/notifies/email/count?${buildQueryString(payload)}`)
  },
  createNotifyEmail(payload) {
    return http.post(`/notifies/email`, payload)
  },
  sendNotifyEmail(payload) {
    return http.put(`/notifies/email/send`, payload)
  },
  fetchNotifyCustomer(payload) {
    return http.get(`/notifies/customer?${buildQueryString(payload)}`)
  },
  countNotifyCustomer(payload) {
    return http.get(`/notifies/customer/count?${buildQueryString(payload)}`)
  },
  createNotifyCustomer(payload) {
    return http.post(`/notifies/customer`, payload)
  },
  fetchDetailNotifyCustomer(payload) {
    return http.get(`/notifies/customer/${payload.id}`)
  },
  sendNotifyCustomer(payload) {
    return http.put(`/notifies/customer/send`, payload)
  },
}
