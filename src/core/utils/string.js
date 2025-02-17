/**
 * Convert string to slug
 * @param str
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Capitalize
 * @param val
 * @returns {*}
 */
export const capitalize = (val) => {
  if (!val) {
    return ''
  }

  val = val.toString()
  return val.charAt(0).toUpperCase() + val.slice(1)
}

/**
 * Convert slug to title
 * @param slug
 */
export const convertSlugToTitle = (slug) => capitalize(slug.replace(/_/gi, ' '))

/**
 * Float to string
 * @param numeric
 * @param decimals
 * @return {string}
 */
export const floatToString = (numeric, decimals) => {
  const amount = numeric.toFixed(decimals).toString()

  if (amount.match(/^\.\d+/)) {
    return `0${amount}`
  }

  return amount
}

/**
 * Export convert string to toUnderscore
 * @param str
 */
export const toUnderscore = (str) => {
  return str.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`)
}

/**
 * Pluralize word
 * @param word
 * @param count
 * @param suffix
 * @return {string}
 */
export const pluralize = (word, count = 1, suffix = 's') => {
  return count <= 1 ? word : `${word}${suffix}`
}

/**
 * Truncate text if text length longer than a value
 * @param str
 * @param limit
 */
export const truncate = (str, limit) => {
  if (str.length > limit) return str.substring(0, limit) + '...'
  else return str
}
