export const routes = [{
    path: '/transactions',
    name: 'list-transaction',
    meta: {
        title: 'Topup',
    },
    component: () =>
        import (
            /* webpackChunkName: "transaction" */
            './views/ListTransactions.vue'
        ),
}, ]