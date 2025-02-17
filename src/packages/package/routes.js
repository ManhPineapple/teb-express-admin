export const routes = [
  {
    path: '/packages',
    name: 'list-package',
    meta: {
      title: 'Quản lý vận đơn',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/ListPackages.vue'),
  },
  {
    path: '/packages/return',
    name: 'list-package-return',
    meta: {
      title: 'Quản lý đơn hàng trả về',
    },
    component: () =>
      import(
        /* webpackChunkName: "package" */ './views/ListPackagesReturn.vue'
      ),
  },
  {
    path: '/packages/alert',
    name: 'package-alert',
    meta: {
      title: 'Quản lý vận đơn chậm',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/ListAlertPackages'),
  },
  {
    path: '/packages/fba',
    name: 'package-fba',
    meta: {
      title: 'Quản lý đơn hàng FBA',
    },
    component: () =>
      import(/* webpackChunkName: "fba-package" */ './views/ListFbaPackage'),
  },
  {
    path: '/packages/fba/:id',
    name: 'package-fba-detail',
    meta: {
      title: 'Chi tiết đơn hàng FBA',
    },
    component: () =>
      import(
        /* webpackChunkName: "fba-package-detail" */ './views/FbaPackageDetail'
      ),
  },
  {
    path: '/packages/:id',
    name: 'package-detail',
    meta: {
      title: 'Chi tiết đơn hàng',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/PackageDetail'),
  },
]
