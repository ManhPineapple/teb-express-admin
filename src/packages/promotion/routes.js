export const routes = [
  {
    path: '/promotions',
    name: 'list-promotion',
    meta: {
      title: 'Promotion',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/Promotion.vue'),
  },
]
