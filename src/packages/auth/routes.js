import { lazyLoadView, noAuthRequired } from '@core/router/helpers'

export const routes = [
  {
    path: '/sign-in',
    name: 'sign-in',
    meta: {
      title: 'Sign In',
      layout: 'full-page',
      class: 'page-login-v3',
      ...noAuthRequired(),
    },
    component: () =>
      lazyLoadView(import(/* webpackChunkName: "auth" */ './views/SignIn.vue')),
  },
  // {
  //   path: '/sign-up',
  //   name: 'sign-up',
  //   meta: {
  //     title: 'Sign Up',
  //     layout: 'full-page',
  //     class: 'page-login-v3',
  //     ...noAuthRequired(),
  //   },
  //   component: () =>
  //     lazyLoadView(import(/* webpackChunkName: "auth" */ './views/SignUp.vue')),
  // },
  // {
  //   path: '/forgot',
  //   name: 'forgot',
  //   meta: {
  //     title: 'Forgot',
  //     layout: 'full-page',
  //     class: 'page-login-v3',
  //     ...noAuthRequired(),
  //   },
  //   component: () =>
  //     lazyLoadView(import(/* webpackChunkName: "auth" */ './views/Forgot.vue')),
  // },
  // {
  //   path: '/verify-email',
  //   name: 'verify-email',
  //   meta: {
  //     title: 'Verify Email',
  //     layout: 'full-page',
  //     class: 'page-login-v3',
  //     ...noAuthRequired(),
  //   },
  //   component: () =>
  //     lazyLoadView(
  //       import(/* webpackChunkName: "auth" */ './views/VerifyEmail.vue')
  //     ),
  // },
  // {
  //   path: '/reset-password',
  //   name: 'reset-password',
  //   meta: {
  //     title: 'Reset Password',
  //     layout: 'full-page',
  //     class: 'page-login-v3',
  //     ...noAuthRequired(),
  //   },
  //   component: () =>
  //     lazyLoadView(
  //       import(/* webpackChunkName: "auth" */ './views/ResetPassword.vue')
  //     ),
  // },
]
