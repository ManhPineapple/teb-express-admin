export const routes = [
  {
    path: '/warehouse',
    name: 'list-package-in-warehouse',
    meta: {
      title: 'Tra cứu đơn',
    },
    component: () =>
      import(
        /* webpackChunkName: "warehouse" */ './views/ListPackageInWarehouse'
      ),
  },
  {
    path: '/warehouse/check-package',
    name: 'check-package',
    meta: {
      title: 'Quét in label',
    },
    component: () =>
      import(/* webpackChunkName: "warehouse" */ './views/CheckPackage'),
  },
  {
    path: '/warehouse/check-in',
    name: 'check-in',
    meta: {
      title: 'Quét nhận hàng',
    },
    component: () =>
      import(/* webpackChunkName: "warehouse" */ './views/ScanInWarehouse'),
  },
  {
    path: '/warehouse/scan-in',
    name: 'scan-in',
    meta: {
      title: 'Quét nhận hàng',
    },
    component: () =>
      import(/* webpackChunkName: "warehouse" */ './views/ScanIn'),
  },
]
