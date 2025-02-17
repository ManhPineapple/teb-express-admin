import md5 from 'crypto-js/md5'
import { buildQueryString } from '@core/utils/url'

export const getAvatarUrl = (
  email,
  options = { s: '100', r: 'x', d: 'mp' }
) => {
  return `https://www.gravatar.com/avatar/${md5(email)}?${buildQueryString(
    options
  )}`
}
