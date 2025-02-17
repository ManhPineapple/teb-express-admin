export const routes = [
  {
    path: '/shipments/:id',
    name: 'shipment-detail',
    meta: {
      title: 'Chi tiết lô hàng',
    },
    component: () =>
      import(/* webpackChunkName: "shipment" */ './views/ShipmentDetail.vue'),
  },
  {
    path: '/shipments',
    name: 'list-shipment',
    meta: {
      title: 'Quản lý lô hàng',
    },
    component: () =>
      import(/* webpackChunkName: "shipment" */ './views/ListShipment'),
  },
]
