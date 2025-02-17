export const routes = [
  {
    path: '/containers',
    name: 'list-container',
    meta: {
      title: 'Quản lý kiện hàng',
    },
    component: () =>
      import(/* webpackChunkName: "container" */ './views/ListContainers.vue'),
  },
  {
    path: '/containers/:code',
    name: 'container-detail',
    meta: {
      title: 'Chi tiết kiện hàng',
    },
    component: () =>
      import(/* webpackChunkName: "container" */ './views/ContainerDetail.vue'),
  },
]
