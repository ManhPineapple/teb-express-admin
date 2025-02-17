import cookie from './cookie'

const affiliateKey = 'ref'

const Affiliate = {
  /**
   * Set reference code
   * @param code
   */
  setRef(code) {
    cookie.set(affiliateKey, code)
  },

  /**
   * Check has reference code
   * @return {boolean}
   */
  hasRef() {
    return cookie.has(affiliateKey)
  },

  /**
   * Get reference code
   * @return {*}
   */
  getRef() {
    return cookie.get(affiliateKey)
  },
}

export default Affiliate
