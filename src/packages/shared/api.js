import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  getUser() {
    return http.get(`/users`)
  },
  updateProfile(payload) {
    return http.put('/users/profile', payload)
  },
  fetchUsersByRole(payload) {
    return http.get(`/users/role?${buildQueryString(payload)}`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchService(payload) {
    return http.get(`/services/${payload}`)
  },

  /**
   * fetch estimate cost
   * @param payload
   * @return {*}
   */
  fetchEstimateCost(payload) {
    return http.get(`/warehouses/estimate-cost-warehouses/${payload}`)
  },

  /**
   * fetch warehouses
   * @param payload
   * @return {*}
   */
  fetchWareHouses(payload) {
    return http.get(`/warehouses/warehouses?${buildQueryString(payload)}`)
  },

  fetchNotifications(payload) {
    return http.get(`/users/notifications?${buildQueryString(payload)}`)
  },
  countNotifications(payload) {
    return http.get(`/users/notifications/count?${buildQueryString(payload)}`)
  },
  readNotifications() {
    return http.put(`/users/notifications/read/all`)
  },
  readNotification(payload) {
    return http.get(`/users/notifications/read/${payload}`)
  },
  getConfigs() {
    return http.get(`/configs`)
  },
}
