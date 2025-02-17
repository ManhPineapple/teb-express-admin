import http from '@core/services/http'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'
import { buildQueryString } from '@core/utils/url'
export default {
  /**
   * upload file claim
   * @param payload
   * @return {*}
   */
  uploadFileTicket(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    return http.post(`/tickets/file`, formData)
  },

  /**
   * get list claim
   * @param payload
   * @return {*}
   */
  fetchClaim(payload) {
    return http.get(`/tickets?${buildQueryString(payload)}`)
  },

  /**
   * count list claim
   * @param payload
   * @return {*}
   */
  countClaim(payload) {
    return http.get(`/tickets/count?${buildQueryString(payload)}`)
  },

  /**
   * count list claim by status
   * @param payload
   * @return {*}
   */
  countClaimByStatus(payload) {
    return http.get(`/tickets/count-by-status?${buildQueryString(payload)}`)
  },
  /**
   * count list claim
   * @param payload
   * @return {*}
   */
  createClaim(payload) {
    return http.post(`/tickets`, payload)
  },
  fetchTicket(payload) {
    return http.get(`/tickets/${payload}`)
  },
  updateTicket({ id, ...body }) {
    return http.put(`/tickets/${id}`, body)
  },
  cancelTicket(payload) {
    return http.put(`/tickets/${payload.id}/cancel`)
  },
  updateFileTicket(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    return http.post(`/tickets/file`, formData)
  },
  fetchMessageTickets(payload) {
    return http.get(
      `/tickets/${payload.ticket_id}/messages?${buildQueryString(payload)}`
    )
  },
  countMessage(payload) {
    return http.get(
      `/tickets/${payload.ticket_id}/messages/count?${buildQueryString(
        payload
      )}`
    )
  },
  fetchTicketFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
  reply(id, payload) {
    return http.post(`/tickets/${id}/messages`, payload)
  },
  processClaim({ id, ...payload }) {
    return http.post(`/tickets/${id}/process`, payload)
  },
  confirmClaim({ id, ...payload }) {
    return http.post(`/tickets/${id}/confirm`, payload)
  },
}
