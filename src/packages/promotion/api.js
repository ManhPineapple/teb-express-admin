import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  fetchPromotion(payload) {
    return http.get(`/promotions?${buildQueryString(payload)}`)
  },

  countPromotion(payload) {
    return http.get(`/promotions/count?${buildQueryString(payload)}`)
  },

  updatePromotion(id, payload) {
    return http.put(`/promotions/${id}`, payload)
  },

  appendUserToPromotion(payload) {
    return http.put('/promotions/append', payload)
  },

  createPromotion(payload) {
    return http.post('/promotions', payload)
  },

  fetchPromotionUsers(id) {
    return http.get(`/promotions/${id}/users`)
  },
}
