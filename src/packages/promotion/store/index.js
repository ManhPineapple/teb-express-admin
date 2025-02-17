import api from '../api'

export const FETCH_PROMOTIONS = 'fetchPromotions'
export const COUNT_PROMOTIONS = 'countPromotions'
export const UPDATE_PROMOTION = 'updatePromotion'
export const APPEND_USER_TO_PROMOTION = 'appendUserToPromotion'

export const state = {
  promotions: [],
  count: 0,
}
export const mutations = {
  [FETCH_PROMOTIONS]: (state, payload) => {
    state.promotions = payload
  },
  [COUNT_PROMOTIONS]: (state, payload) => {
    state.count = payload
  },
}

export const actions = {
  async fetchPromotions({ commit }, payload) {
    const [res, count] = await Promise.all([
      api.fetchPromotion(payload),
      api.countPromotion(payload),
    ])
    if (!res || res.error || count.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_PROMOTIONS, res.promotions)
    commit(COUNT_PROMOTIONS, count.count)

    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async updatePromotion({ commit }, payload) {
    const form = new FormData()
    form.append('status', payload.status)

    if (payload.file_price) {
      form.append('file_price', payload.file_price)
    }

    if (payload.file_weight) {
      form.append('file_weight', payload.file_weight)
    }

    if (payload.description) {
      form.append('description', payload.description)
    }

    const res = await api.updatePromotion(payload.id, form)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  // eslint-disable-next-line
  async appendUserToPromotion({ commit }, payload) {
    const res = await api.appendUserToPromotion(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
}
