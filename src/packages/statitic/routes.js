export const routes = [
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      title: 'Thống kê',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/Statitic'),
  },
  {
    path: '/statistic-claims',
    name: 'statistic-claims',
    meta: {
      title: 'Khiếu nại',
    },
    component: () => import(/* webpackChunkName: "package" */ './views/Claim'),
  },
]
