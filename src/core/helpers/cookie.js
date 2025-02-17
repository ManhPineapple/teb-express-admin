import CookieJs from 'js-cookie'
import { byteLength } from '@core/utils'
import { isEmpty } from '@core/utils/object'
import log from '@core/helpers/log'
import {
  DEFAULT_STORAGE_LIFE_TIME,
  MAX_COOKIE_BYTES,
} from '@core/constants/storage'

const Cookie = {
  /**
   * Set
   * @param key
   * @param val
   * @param expires
   */
  set(key, val, expires = null) {
    if (byteLength(val) > MAX_COOKIE_BYTES) {
      log(`Cookie "${key}" is too big. Bytes: ${byteLength(val)}, Val: ${val}`)
      return
    }

    let duration

    if (expires) {
      duration = new Date(expires)
    } else {
      duration = DEFAULT_STORAGE_LIFE_TIME
    }

    CookieJs.set(key, val, { expires: duration })
  },

  /**
   * Get
   * @param key
   * @return {*}
   */
  get(key) {
    return CookieJs.get(key)
  },

  /**
   * Get all
   * @param callback
   * @return {Array}
   */
  each(callback) {
    const values = CookieJs.get()

    if (values && !isEmpty(values)) {
      Object.entries(values).forEach((item) => {
        const [key, value] = item
        callback(key, value)
      })
    }
  },

  /**
   * Remove
   * @param key
   */
  remove(key) {
    CookieJs.remove(key)
  },

  /**
   * Has
   * @param key
   * @return {boolean}
   */
  has(key) {
    return typeof Cookie.get(key) !== 'undefined'
  },

  /**
   * Clear all
   */
  clearAll() {
    Cookie.each((key) => {
      Cookie.remove(key)
    })
  },
}

export default Cookie
