import LocalStorage from '@core/helpers/localstorage'
import Cookie from '@core/helpers/cookie'

const getKey = (key) => `shipping_$_$_${key}`
const isSupportStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const store = isSupportStorage ? LocalStorage : Cookie

const Storage = {
  /**
   * Set storage value
   * @param key
   * @param value
   * @param expireSeconds
   */
  set(key, value, expireSeconds = null) {
    value = JSON.stringify(value)

    if (expireSeconds) {
      store.set(getKey(key), value, new Date().getTime() + expireSeconds * 1000)
    } else {
      store.set(getKey(key), value)
    }
  },

  /**
   * Get storage value
   * @param key
   * @param defaultVal
   * @return {null}
   */
  get(key, defaultVal = null) {
    const value = store.get(getKey(key))

    try {
      return JSON.parse(value)
    } catch (e) {
      return defaultVal
    }
  },

  /**
   * Get keys by prefix
   * @param prefix
   */
  getKeysByPrefix(prefix) {
    const keys = []

    store.each((value, key) => {
      if (key && key.indexOf(prefix) === 0) {
        keys.push(key)
      }
    })

    return keys
  },

  /**
   * Remove by key
   * @param key
   */
  remove(key) {
    store.remove(getKey(key))
  },

  /**
   * Get expire duration of days
   * @param days
   * @return {number} the expire seconds of days
   */
  getDayDuration(days) {
    const oneDaySeconds = 60 * 60 * 24

    return days * oneDaySeconds
  },

  /**
   * Get expire duration of minutes
   * @param minute
   * @return {number} the expire seconds of minutes
   */
  getMinuteDuration(minute) {
    return minute * 60
  },

  /**
   * Remove by prefix
   * @param {string} prefix
   */
  removeByPrefix(prefix) {
    const keys = this.getKeysByPrefix(prefix)

    if (Array.isArray(keys) && keys.length) {
      keys.forEach((key) => this.remove(key))
    }
  },

  /**
   * Has storage by key
   * @param key
   * @return {boolean}
   */
  has(key) {
    if (typeof store.has === 'undefined') {
      return typeof this.get(getKey(key)) !== 'undefined'
    }

    return store.get(getKey(key))
  },

  /**
   * Clear all
   */
  clearAll() {
    store.clearAll()
  },
}

export default Storage
