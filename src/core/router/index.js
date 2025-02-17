import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import store from '@core/store'
import routes from './routes'
import middleware from './middleware'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  routes,
  mode: 'history',
  base: '/',
  linkExactActiveClass: 'nav-item active',
})

middleware(router, store)

// beforeResolve hook
router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }
  } catch (error) {
    return
  }

  next()
})

export default router
