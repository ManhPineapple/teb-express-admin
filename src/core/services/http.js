import isEmpty from 'lodash/isEmpty'
import HttpError from '@core/errors/http-handler'
import { isString } from '@core/utils/type'
import AuthService from '@core/services/auth'

import {
  SERVER_ERROR_MESSAGE,
  RESPONSE_TYPE_BLOB,
  RESPONSE_TYPE_JSON,
} from '@core/constants/http'

/**
 * Responsible for all HTTP requests.
 */
export const http = {
  // eslint-disable-next-line
  async request(method, url, data, options = {}) {
    try {
      let baseURL = process.env.VUE_APP_BASE_API_ENDPOINT

      if (typeof options.base_path !== 'undefined') {
        baseURL = `${process.env.VUE_APP_BASE_API}/${options.base_path}`
      }

      const apiUrl = url.indexOf('http') === 0 ? url : `${baseURL}${url}`

      const type = isString(options)
        ? options
        : options.type || RESPONSE_TYPE_JSON

      const init = {
        method: method.toUpperCase(),
        headers: Object.assign({}, options.headers || {}),
      }
      if (options.token) {
        init.headers['Authorization'] = options.token
      } else if (AuthService.isAuthenticated()) {
        init.headers['Authorization'] = `Bearer ${AuthService.getAccessToken()}`
      }

      if (!isEmpty(data)) {
        init.body = JSON.stringify(data)
      }

      if (data instanceof ArrayBuffer || data instanceof FormData) {
        init.body = data
      }

      let response

      response = await fetch(apiUrl, init)

      if (!response.ok) {
        HttpError.handle(response)
        let data = {}
        try {
          data = await response.json()
        } catch (error) {
          data = {}
        }

        data.errorMessage = data.message || data.error || SERVER_ERROR_MESSAGE
        return Object.assign(
          {
            success: false,
            error: true,
            requestError: true,
            statusCode: response.status,
          },
          data
        )
      }

      if (type === RESPONSE_TYPE_JSON) {
        return await response.json()
      }

      if (type === RESPONSE_TYPE_BLOB) {
        return await response.blob()
      }

      return await response.text()
    } catch (e) {
      return {
        success: false,
        error: true,
        requestError: true,
        errorMessage: SERVER_ERROR_MESSAGE,
      }
    }
  },
  get(url, options) {
    return this.request('get', url, {}, options)
  },
  post(url, data, options) {
    return this.request('post', url, data, options)
  },
  put(url, data, options) {
    return this.request('put', url, data, options)
  },
  delete(url, data = {}, options) {
    return this.request('delete', url, data, options)
  },
}

export default http
