<template>
  <div class="site-menubar" @mouseover="onHover()" @mouseleave="onOut()">
    <div class="site-menubar-header">
      <div class="logo-header">
        <img src="../../../../public/img/logo.png" />
      </div>
    </div>
    <div class="site-menubar-body">
      <ul class="site-menu">
        <li
          v-for="(menu, i) in availableMenus"
          class="site-menu-item"
          :class="{
            active: isActive(menu.route) || childrenNameRoute(menu),
          }"
          :key="i"
        >
          <router-link :to="handelRouter(menu)">
            <span class="site-menu-icon">
              <p-svg :name="menu.icon"></p-svg>
            </span>
            <span class="site-menu-title" @click="menu.isOpen = !menu.isOpen">{{
              menu.title
            }}</span>
            <div class="icon-sub" @click="menu.isOpen = !menu.isOpen">
              <p-svg
                :class="{ 'is-active': menu.isOpen }"
                name="up-white"
              ></p-svg>
            </div>
          </router-link>
          <div
            class="site-menu-sub"
            :class="{
              'has-sub': menu.isOpen,
            }"
            v-if="menu.sub"
          >
            <div
              class="site-menu-sub-item"
              v-for="(sub, j) in availableMenuSub(menu.sub)"
              :key="j"
              :class="{
                active: isContainAlias(sub.alias),
              }"
            >
              <router-link :to="sub.route" class="animsition-link">
                <span
                  :class="{
                    active: isContainAlias(sub.alias),
                  }"
                  class="site-menu-sub-title"
                  >{{ sub.title }}</span
                >
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { isObject } from '@core/utils/type'

export default {
  name: 'Sidebar',
  props: {
    shop: {
      type: Object,
      default: () => {},
    },
    shops: {
      type: Array,
      default: () => [],
    },
    isSidebarOpen: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    validShops() {
      return this.shop && this.shops ? this.shops : []
    },
    shopName() {
      return this.shop.name
    },
    availableMenus() {
      return this.menus.filter((menu) => menu.disable !== true)
    },
  },
  data() {
    return {
      hoverIndex: -1,
      chooseShop: {
        icon: 'shopping-bag',
      },
      isActiveSub: false,
      activeSubIndex: 0,
      isactive: false,
      activeItem: '',
      menus: [
        {
          title: 'Quản lý đơn hàng',
          icon: 'OrderInactive',
          iconActive: 'OrderActive',
          route: { name: 'packages' },
          class: '',
          isOpen: false,
          disable: this.$isHub(),
          sub: [
            {
              route: '/packages',
              title: ' Đơn hàng',
              alias: ['/packages', '/packages/:id'],
              disable: this.$isMarketing(),
            },
            // {
            //   route: '/packages/return',
            //   title: ' Đơn hàng trả về',
            //   alias: ['/packages/return'],
            //   disable:
            //     this.$isSupportLeader() ||
            //     this.$isWarehouse() ||
            //     this.$isMarketing(),
            // },
            {
              route: '/packages/fba',
              title: 'Đơn hàng FBA',
              alias: ['/packages/fba', '/packages/fba/:id'],
              disable: this.$isMarketing(),
            },
            {
              route: '/packages/alert',
              title: 'Đơn hàng bị chậm',
              alias: ['/packages/alert'],
              disable:
                this.$isSupportLeader() ||
                this.$isWarehouse() ||
                this.$isAccountant() ||
                this.$isMarketing(),
            },
            // {
            //   route: '/claims',
            //   title: 'Khiếu nại',
            //   alias: ['/claims', '/claims/:id'],
            //   disable:
            //     this.$isWarehouse() ||
            //     this.$isMarketing() ||
            //     this.$isShipPartner() ||
            //     this.$isSaleOperation(),
            // },
            // {
            //   route: '/coupons',
            //   title: 'Coupon',
            //   alias: ['/coupons'],
            //   disable:
            //     this.$isAccountant() ||
            //     this.$isWarehouse() ||
            //     this.$isHub() ||
            //     this.$isMarketing() ||
            //     this.$isSupportLeader() ||
            //     this.$isMarketing() ||
            //     this.$isSupport() ||
            //     this.$isSale() ||
            //     this.$isSaleOperation() ||
            //     this.$isBusinessManager() ||
            //     this.$isShipPartner(),
            // },
          ],
        },
        {
          title: 'Quản lý tài chính',
          icon: 'OrderInactive',
          iconActive: 'OrderActive',
          route: { name: 'finances' },
          class: '',
          isOpen: false,
          disable:
            this.$isWarehouse() ||
            this.$isHub() ||
            this.$isMarketing() ||
            this.$isSupportLeader() ||
            this.$isShipPartner() ||
            this.$isSaleOperation(),
          sub: [
            {
              route: '/debt',
              title: 'Công nợ',
              alias: ['/debt'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/bills',
              title: 'Hóa đơn',
              alias: ['/bills', '/bills/:code'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/transactions',
              title: 'Topup',
              alias: ['/transactions', '/transactions/:id'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/prices',
              title: 'Bảng giá',
              alias: ['/prices'],
              disable:
                this.$isSupportLeader() ||
                this.$isSupport() ||
                this.$isSale() ||
                this.$isBusinessManager(),
            },
            {
              route: '/promotions',
              title: 'Promotion',
              alias: ['/promotions'],
              disable:
                this.$isAccountant() ||
                this.$isWarehouse() ||
                this.$isHub() ||
                this.$isShipPartner() ||
                this.$isSaleOperation() ||
                this.$isBusinessManager(),
            },
            // {
            //   route: '/claims-process',
            //   title: 'Xét duyệt khiếu nại',
            //   alias: ['/claims-process'],
            //   disable: !this.$isAdmin() && !this.$isAccountant(),
            // },
          ],
        },
        // {
        //   title: 'Thống kê ',
        //   icon: 'analytic',
        //   iconActive: 'analyticActive',
        //   route: { name: 'statistic' },
        //   class: '',
        //   isOpen: false,
        //   disable:
        //     this.$isAccountant() ||
        //     this.$isSupport() ||
        //     this.$isSale() ||
        //     this.$isHub() ||
        //     this.$isSupportLeader() ||
        //     this.$isWarehouse() ||
        //     this.$isMarketing() ||
        //     this.$isShipPartner() ||
        //     this.$isSaleOperation() ||
        //     this.$isBusinessManager(),
        //   sub: [
        //     {
        //       route: '/statistics',
        //       title: ' Tài chính',
        //       alias: ['/statistics'],
        //       disable:
        //         this.$isAccountant() ||
        //         this.$isSupport() ||
        //         this.$isSale() ||
        //         this.$isHub() ||
        //         this.$isSupportLeader() ||
        //         this.$isWarehouse() ||
        //         this.$isShipPartner() ||
        //         this.$isBusinessManager(),
        //     },
        //     {
        //       route: '/statistic-claims',
        //       title: 'Khiếu nại',
        //       alias: ['/statistic-claims'],
        //       disable:
        //         this.$isAccountant() ||
        //         this.$isSupport() ||
        //         this.$isSale() ||
        //         this.$isHub() ||
        //         this.$isSupportLeader() ||
        //         this.$isWarehouse() ||
        //         this.$isShipPartner() ||
        //         this.$isBusinessManager(),
        //     },
        //   ],
        // },
        {
          title: 'Kho',
          icon: 'warehouse',
          iconActive: 'warehouseActive',
          route: '/bill',
          class: '',
          isOpen: false,
          disable:
            this.$isSupport() ||
            this.$isSale() ||
            this.$isHub() ||
            this.$isMarketing() ||
            this.$isBusinessManager(),
          sub: [
            {
              route: '/warehouse',
              title: 'Tra cứu đơn',
              alias: ['/warehouse'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isSale() ||
                this.$isHub() ||
                this.$isBusinessManager(),
            },
            {
              route: '/warehouse/scan-in',
              title: 'Quét nhận hàng',
              alias: ['/warehouse/scan-in'],
              disable:
                this.$isSupportLeader() ||
                this.$isBusinessManager() ||
                this.$isShipPartner() ||
                this.$isSaleOperation(),
            },
            {
              route: '/warehouse/check-package',
              title: 'Dán nhãn',
              alias: ['/warehouse/check-package'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isSale() ||
                this.$isHub() ||
                this.$isSupportLeader() ||
                this.$isBusinessManager() ||
                this.$isShipPartner() ||
                this.$isSaleOperation(),
            },
            {
              route: '/containers',
              title: 'Tạo kiện hàng',
              alias: ['/containers', '/containers/:code'],
              disable: this.$isBusinessManager(),
            },
            {
              route: '/shipments',
              title: 'Tạo lô hàng',
              alias: ['/shipments', '/shipments/:id'],
              disable: this.$isBusinessManager(),
            },
          ],
        },
        {
          title: 'Hub',
          icon: 'warehouse',
          iconActive: 'warehouseActive',
          route: '#',
          class: '',
          isOpen: false,
          disable:
            this.$isSupport() ||
            this.$isSale() ||
            this.$isAccountant() ||
            this.$isWarehouse() ||
            this.$isSupportLeader() ||
            this.$isMarketing() ||
            this.$isBusinessManager() ||
            this.$isShipPartner() ||
            this.$isSaleOperation(),
          sub: [
            {
              route: '/hub/return',
              title: 'Hàng return',
              alias: ['/hub/return'],
              disable:
                this.$isSupport() ||
                this.$isSale() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse() ||
                this.$isBusinessManager(),
            },
          ],
        },

        {
          title: 'Quản trị',
          icon: 'setting',
          iconActive: 'SettingActive',
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          disable:
            this.$isWarehouse() ||
            this.$isHub() ||
            this.$isMarketing() ||
            this.$isSaleOperation() ||
            this.$isShipPartner(),
          sub: [
            {
              route: '/account',
              title: 'Tài khoản admin',
              alias: ['/account'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isSale() ||
                this.$isWarehouse() ||
                this.$isHub() ||
                this.$isSupportLeader() ||
                this.$isShipPartner(),
            },
            {
              route: '/user',
              title: 'Tài khoản khách hàng',
              alias: ['/user', '/user/:id'],
              disable: this.$isAccountant(),
            },
            // {
            //   route: '/sales',
            //   title: 'Quản lý sales',
            //   alias: ['/sales', '/sales/:id'],
            //   disable: !this.$isAdmin() && !this.$isBusinessManager(),
            // },
            // {
            //   route: '/notify',
            //   title: 'Thông báo',
            //   alias: ['/notify'],
            //   disable:
            //     this.$isAccountant() ||
            //     this.$isSupport() ||
            //     this.$isSale() ||
            //     this.$isWarehouse() ||
            //     this.$isHub() ||
            //     this.$isSupportLeader() ||
            //     this.$isShipPartner(),
            // },
            // {
            //   route: '/carrier-prices',
            //   title: 'So sánh giá',
            //   alias: ['/carrier-prices'],
            //   disable: !this.$isAdmin(),
            // },
            // {
            //   route: '/setting/point',
            //   title: 'Quản lý tích điểm',
            //   alias: ['/setting/point'],
            //   disable: !this.$isAdmin(),
            // },
            // {
            //   route: '/setting/referal',
            //   title: 'Cấu hình Referral',
            //   alias: ['/setting/referal'],
            //   disable: !this.$isAdmin(),
            // },
          ],
        },
      ],
    }
  },
  methods: {
    isActive(route) {
      if (isObject(route)) {
        return this.$route.name === route.name
      }

      return this.$route.path === route || this.$route.fullPath === route
    },

    isContainAlias(alias) {
      if (!this.$route.matched || !this.$route.matched.length || !alias) {
        return false
      }

      for (let item of this.$route.matched) {
        if (alias.includes(item.path)) {
          return true
        }
      }
      return false
    },

    childrenNameRoute(title) {
      let path = this.$route.matched.map((element) => element.path).toString()
      if (title.sub.length > 0) {
        return title.sub.some((element) => element.alias.includes(path))
      }
    },
    handelRouter(menu) {
      if (menu.sub) {
        return ''
      }
      return menu.route
    },

    availableMenuSub(sub) {
      return sub.filter((item) => item.disable !== true)
    },
    onHover() {
      this.$emit('onHoverSideBar')
    },
    onOut() {
      this.$emit('onOutSideBar')
      if (!this.isSidebarOpen) {
        this.menus = this.menus.map((obj) =>
          obj.isOpen == true ? { ...obj, isOpen: false } : obj
        )
      }
    },
    checkValidPath() {
      let validPath = true
      this.menus.map((route) => {
        let sub = route.sub.find((i) => {
          return i.route == this.$route.path
        })
        if (sub) {
          validPath = !sub.disable && !route.disable
        }
      })
      if (!validPath) {
        this.$router.push({ path: '/' })
      }
    },
  },
  watch: {
    isSidebarOpen: function (value) {
      if (!value) {
        this.menus = this.menus.map((obj) =>
          obj.isOpen == true ? { ...obj, isOpen: false } : obj
        )
      }
    },
    '$route.path': {
      handler: function () {
        this.checkValidPath()
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style lang="scss">
.animsition-link {
  position: relative;

  &:before {
    position: absolute;
    content: '';
    width: 210px;
    height: 36px;
    top: -7px;
    left: 0;
    margin-left: -18px;
  }
}
</style>
