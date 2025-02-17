export const routes = [
  {
    path: '/bills',
    name: 'bill-list',
    meta: {
      title: 'Hóa đơn',
    },
    component: () => import(/* webpackChunkName: "bills" */ './views/List.vue'),
  },
  {
    path: '/bills/:code',
    name: 'bill-detail',
    meta: {
      title: 'Chi tiết hóa đơn',
    },
    component: () =>
      import(/* webpackChunkName: "bills" */ './views/BillDetail.vue'),
  },
]
