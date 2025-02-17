/**
 * Get value of an object property/path even if it's nested
 */
export function getValueByPath(obj, path) {
  return path.split('.').reduce((o, i) => o[i], obj)
}
