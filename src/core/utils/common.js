import { hasOwn } from '@core/utils/object'
import { isObject } from '@core/utils/type'

export function noop() {}

/**
 * Is def
 * @param v
 * @return {boolean}
 */
export const isDef = (v) => v !== undefined

/**
 * Clone deep
 * @param obj
 */
export const cloneDeep = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep)
  } else if (obj && typeof obj === 'object') {
    const cloned = {}
    const keys = Object.keys(obj)
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      cloned[key] = cloneDeep(obj[key])
    }
    return cloned
  } else {
    return obj
  }
}

/**
 * Is vnode
 * @param node
 * @returns {boolean}
 */
export function isVNode(node) {
  return isObject(node) && hasOwn(node, 'componentOptions')
}

/**
 * Delay
 * @param ms
 * @returns {Promise<*>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get byte of value
 * @param val
 * @return {number}
 */
export const byteLength = (val) => {
  const raw = JSON.stringify(val)
  const strLen = raw.length

  try {
    let length = strLen

    for (let i = strLen - 1; i >= 0; i--) {
      const code = raw.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) {
        length++
      } else if (code > 0x7ff && code <= 0xffff) {
        length += 2
      }

      if (code >= 0xdc00 && code <= 0xdfff) {
        i--
      }
    }

    return length
  } catch (e) {
    return strLen
  }
}

export const isUndefined = (val) => typeof val === 'undefined'

export function validateNumber(value) {
  // return true if valid number
  const reg = new RegExp(/^\d+$/)
  return reg.test(value)
}

export function validatePhoneNumber(value) {
  /* eslint-disable-next-line */
  const reg = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
  return reg.test(value)
}

export function validateEmail(mail) {
  /* eslint-disable-next-line */
  const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  return reg.test(mail)
}

/**
 * Is valid domain
 * @param domain
 */
export const isValidDomain = (domain) => {
  const regex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  )
  return regex.test(domain)
}

/**
 * Clean url
 * @param url
 */
export const cleanDomain = (url) =>
  url.replace(/(http|https):\/\//, '').replace(/www\./, '')

export const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => results[index])
}

export const roundNumberToTwoDecimalPlaces = (v, n) => {
  return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n)
}
