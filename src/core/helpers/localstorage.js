import addDays from 'date-fns/addDays'
import getTime from 'date-fns/getTime'
import { isEmpty } from '@core/utils/object'
import { DEFAULT_STORAGE_LIFE_TIME } from '@core/constants/storage'

/**
 * Append subfix expire
 * @param key
 * @returns {string}
 */
const getExpireKey = (key) => `${key}_expire`

/**
 * Verify localstorage not expired
 * @param key
 * @returns {boolean}
 */
const isNotExpired = (key) => {
  const expire = parseInt(window.localStorage.getItem(getExpireKey(key)), 10)
  return expire && expire >= getTime(getTime(new Date()))
}

const LocalStorage = {
  /**
   * Set
   * @param key
   * @param val
   * @param expires
   */
  set(key, val, expires = null) {
    let duration

    if (expires) {
      duration = new Date(expires)
    } else {
      duration = addDays(new Date(), DEFAULT_STORAGE_LIFE_TIME)
    }

    window.localStorage.setItem(key, val)
    window.localStorage.setItem(
      getExpireKey(key),
      duration.getTime().toString()
    )
  },

  /**
   * Get
   * @param key
   * @return {*}
   */
  get(key) {
    if (isNotExpired(key)) {
      return window.localStorage.getItem(key)
    } else {
      LocalStorage.remove(key)
    }

    return null
  },

  /**
   * Get all
   * @param callback
   * @return {Array}
   */
  each(callback) {
    const values = window.localStorage

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
    window.localStorage.removeItem(key)
    window.localStorage.removeItem(getExpireKey(key))
  },

  /**
   * Has
   * @param key
   * @return {boolean}
   */
  has(key) {
    return LocalStorage.get(key) !== null
  },

  /**
   * Clear all
   */
  clearAll() {
    LocalStorage.each((key) => {
      LocalStorage.remove(key)
    })
  },
}

export default LocalStorage
