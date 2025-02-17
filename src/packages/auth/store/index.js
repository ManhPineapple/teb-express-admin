import {
  ROLE_ADMIN,
  ROLE_ACCOUNTANT,
  ROLE_WAREHOUSE,
  ROLE_SUPPORT,
  ROLE_HUB,
  ROLE_SUPPORT_LEADER,
  USER_ROLE_MARKETING,
  ROLER_BUSSINESS_MANAGER,
  ROLER_SHIP_PARTNER,
  ROLE_SALE,
  ROLE_SALE_OPERATION,
} from '@core/constants'
import api from '../api'
import AuthService from '@core/services/auth'
import { HTTP_STATUS_FORBIDDEN } from '@core/constants/http'
/**
 * Type
 */
export const AUTHENTICATE = 'authenticate'
export const GET_USER = 'getUser'
export const VERIFY_EMAIL = 'verifyEmail'
export const RESEND_EMAIL = 'resendEmail'
export const CURRENT_USER = 'currentUser'
/**
 * State
 */
export const state = {
  user: {},
}

/**
 * Actions
 */
export const actions = {
  /**
   * Init
   * @param commit
   */
  init({ commit }) {
    AuthService.init()

    if (AuthService.isAuthenticated()) {
      handleAuthenticated(commit, Object.assign({}, AuthService.user))
    }
  },

  /**
   * Sign in
   * @param commit
   * @param payload
   * @returns {Promise<{success: boolean}>}
   */
  async signIn({ commit }, payload) {
    let response

    response = await api.signIn(payload)
    if (response && response.access_token) {
      const data = Object.assign({}, response.user, {
        access_token: response.access_token,
      })
      handleAuthenticated(commit, transformerAuthenticate(data))

      return {
        success: true,
        permission: data.role === ROLE_ADMIN,
        user: data,
      }
    }

    if (
      response &&
      response.user &&
      response.statusCode == HTTP_STATUS_FORBIDDEN
    ) {
      commit(CURRENT_USER, response.user)
      return {
        success: false,
        message: response.errorMessage || '',
        userInActive: true,
      }
    }

    return {
      success: false,
      message: response.errorMessage || '',
      number_incorrect: response.number_incorrect_password || 0,
    }
  },

  /**
   * Sign up
   * @param commit
   * @param payload
   * @returns {Promise<{success: boolean}>}
   */
  // eslint-disable-next-line
  async signUp({ commit }, payload) {
    const response = await api.signUp(payload)

    if (response && response.user && response.user.id) {
      commit(CURRENT_USER, response.user)
      return {
        success: true,
      }
    }

    return response
  },

  /**
   * Sign out
   * @param commit
   */
  signOut({ commit }) {
    AuthService.set({})
    commit(AUTHENTICATE, {})
    AuthService.clear()
  },

  // eslint-disable-next-line
  async forgotPassword({ commit }, payload) {
    const response = await api.forgot(payload)
    if (response.success) {
      return {
        success: true,
        message:
          'Instructions to reset your password have been sent to you. Please check your email.',
      }
    }

    return response
  },
  // eslint-disable-next-line
  async resetPassword({ commit }, payload) {
    const response = await api.resetPass(payload)
    if (response.success) {
      return {
        success: true,
      }
    }

    return response
  },

  async verifyEmail({ commit }, payload) {
    let response
    response = await api.verifyEmail(payload)

    if (response && response.access_token) {
      const data = Object.assign({}, response.user, {
        access_token: response.access_token,
      })
      handleAuthenticated(commit, transformerAuthenticate(data))

      return {
        success: true,
        permission: data.role === ROLE_ADMIN,
      }
    }
    return {
      success: false,
      message: response.errorMessage || '',
    }
  },
  // eslint-disable-next-line
  async resendEmail({ commit }, payload) {
    const response = await api.resendEmail(payload)

    if (response.success) {
      return { success: true }
    }

    return { success: false }
  },
}

/**
 * Mutations
 */
export const mutations = {
  [AUTHENTICATE](state, payload) {
    state.user = payload
  },
  [VERIFY_EMAIL](state, payload) {
    state.user_signUp = payload
    state.token = payload
  },
  [CURRENT_USER](state, payload) {
    state.user = payload
  },
}

/**
 * Getters
 */
export const getters = {
  [GET_USER](state) {
    if (state.user && state.user.id) {
      return Object.assign({}, state.user)
    }

    return { id: 0 }
  },
  currentRole(state) {
    return state.user.role
  },
  isAdmin(state) {
    return state.user.role === ROLE_ADMIN
  },
  isSupport(state) {
    return state.user.role === ROLE_SUPPORT
  },
  isAccountant(state) {
    return state.user.role === ROLE_ACCOUNTANT
  },
  isWarehouse(state) {
    return state.user.role === ROLE_WAREHOUSE
  },
  isSupportLeader() {
    return state.user.role === ROLE_SUPPORT_LEADER
  },
  isHub(state) {
    return state.user.role === ROLE_HUB
  },
  isMarketing(state) {
    return state.user.role === USER_ROLE_MARKETING
  },
  isBusinessManager(state) {
    return state.user.role === ROLER_BUSSINESS_MANAGER
  },
  isShipPartner(state) {
    return state.user.role === ROLER_SHIP_PARTNER
  },
  isSale(state) {
    return state.user.role === ROLE_SALE
  },
  isSaleOperation(state) {
    return state.user.role === ROLE_SALE_OPERATION
  },
}

/**
 * Handle after authenticated
 * @param commit
 * @param payload
 */
const handleAuthenticated = (commit, payload) => {
  // if (payload.role !== ROLE_ADMIN) {
  //   return
  // }

  AuthService.set(payload)
  commit(AUTHENTICATE, payload)
}

/**
 * transformer authenticate data to storage
 * @param response
 * @return {{name: *, id: *, avatar: *, accessToken: *, email: *}}
 */
const transformerAuthenticate = (response) => {
  return {
    id: response.id,
    accessToken: response.access_token,
    email: response.email,
    username: response.username,
    full_name: response.full_name,
    birthday: response.birthday,
    role: response.role,
  }
}
