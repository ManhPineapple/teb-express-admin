import Storage from '@core/helpers/storage'
import { isEmpty } from '@core/utils/object'

const key = 'auth'

const AuthService = {
  user: {},
  store: {},

  /**
   * Init
   */
  init() {
    const user = this.getStorage()

    if (user && !isEmpty(user)) {
      this.set(user, false)
    }
  },

  /**
   * Set
   * @param user
   * @param storage
   */
  set(user, storage = true) {
    this.user = user || {}

    if (storage) {
      this.storage(user)
    }
  },

  /**
   * Get id
   * @returns {number}
   */
  getId() {
    return parseInt(this.user.id, 10) || 0
  },

  /**
   * Get email
   * @returns {string}
   */
  getEmail() {
    return this.user.email
  },

  /**
   * Get access token
   * @returns {string}
   */
  getAccessToken() {
    return this.user.accessToken
  },

  /**
   * Is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.user.id > 0
  },

  /**
   * Get data from storage
   * @returns {*|{}}
   */
  getStorage() {
    return Storage.get(key, {})
  },

  /**
   * Storage data
   * @param data
   */
  storage(data) {
    Storage.set(key, data)
  },

  /**
   * Storage access token
   * @param accessToken
   */
  storageAccessToken(accessToken) {
    const user = Object.assign({}, AuthService.user, { accessToken })
    AuthService.user = user
    AuthService.storage(user)
  },

  /**
   * Clear storage
   */
  clear() {
    Storage.remove(key)
  },
}

export const getUserId = () => AuthService.getId()

export default AuthService
