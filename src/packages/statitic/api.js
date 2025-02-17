import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * list senders
   * @param payload
   * @return {*}
   */
  fetchCustomerStatistic({ customer_id, ...options }) {
    return http.get(
      `/users/customers/${customer_id}/statistic?${buildQueryString(options)}`
    )
  },
}
