import isPlain from 'is-plain-object'
import { isObject } from '@core/utils/type'

/**
 * Merge target object with value
 * @param target
 * @param path
 * @param value
 * @returns {*}
 */
export const merge = (target, path, value) => {
  if (isPlain(target[path]) && isPlain(value)) {
    target[path] = Object.assign({}, target[path], value)
  } else {
    target[path] = value
  }

  return target
}

/**
 * Is diff two object
 * @param object1
 * @param object2
 * @returns {boolean}
 */
export const isObjectDiff = (object1, object2) => {
  return JSON.stringify(object1) !== JSON.stringify(object2)
}

/**
 * Has own property
 *
 * @param obj
 * @param key
 * @returns {boolean}
 */
export const hasOwn = (obj, key) => {
  return obj && isObject(obj) && key in obj
}

/**
 * Is empty
 * @param obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}
