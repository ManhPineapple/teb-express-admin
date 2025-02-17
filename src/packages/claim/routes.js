export const routes = [
  {
    path: '/claims',
    name: 'list-claim',
    meta: {
      title: 'Khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "claim" */ './views/ListClaim.vue'),
  },
  {
    path: '/claims-process',
    name: 'list-claim-process',
    meta: {
      title: 'Xét duyệt khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "claim" */ './views/ListConfirm.vue'),
  },
  {
    path: '/claims/:id',
    name: 'claim-detail',
    meta: {
      title: 'Chi tiết khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "claim" */ './views/ClaimDetail.vue'),
  },
]
