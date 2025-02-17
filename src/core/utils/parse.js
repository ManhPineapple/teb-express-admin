/**
 * Parse to json
 * @param value
 * @param defaultValue
 * @return {{}}
 */
export const parseToJson = (value, defaultValue = {}) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return defaultValue
  }
}
