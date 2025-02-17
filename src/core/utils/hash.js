/**
 * Generate guid
 * @return {*}
 */
export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(6)
      .substring(1)
  }

  return s4() + s4()
}

/**
 * base64 encode
 * @param val
 */
export const base64Encode = (val) => btoa(encodeURI(val))

/**
 * base64 decode
 * @param val
 */
export const base64Decode = (val) => decodeURI(atob(val))

/**
 * create a uuid
 * @returns string
 */
export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
