export const routes = [
  // {
  //   path: '/hubs/search',
  //   name: 'hubs-search',
  //   meta: {
  //     title: 'Tra cứu đơn',
  //   },
  //   component: () => import(/* webpackChunkName: "hub" */ './views/Search.vue'),
  // },
  // {
  //   path: '/hub/import',
  //   name: 'scan-import-hub',
  //   meta: {
  //     title: 'Quét nhập hub',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "sign-in" */ './views/ScanImportHub'),
  // },
  // {
  //   path: '/hub/export',
  //   name: 'scan-export-hub',
  //   meta: {
  //     title: 'Quét xuất hub',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "sign-in" */ './views/ScanExportHub'),
  // },
  {
    path: '/hub/return',
    name: 'hub-return',
    meta: {
      title: 'Quét hàng return',
    },
    component: () =>
      import(/* webpackChunkName: "sign-in" */ './views/PackageReturn'),
  },
  // {
  //   path: '/hub/reship',
  //   name: 'hub-reship',
  //   meta: {
  //     title: 'Hàng reship',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "sign-in" */ './views/PackageReship'),
  // },
]
