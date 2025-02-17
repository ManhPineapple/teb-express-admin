<template>
  <div class="setting user-detail pages">
    <div class="page-content" v-if="user != null">
      <CustomerStatistic :user_id="userID" />
      <div class="user-info mb-24 row">
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Mã khách hàng:</p>
                <p>Họ và tên:</p>
                <p>Email:</p>
                <p v-if="showPhoneNumber">Số điện thoại:</p>
                <p>Loại tài khoản:</p>
                <p>MST:</p>
              </div>
              <div class="right">
                <p>U{{ user.id }}</p>
                <p>
                  <p-tooltip
                    v-if="user.full_name"
                    :label="user.full_name"
                    size="large"
                    position="top"
                    type="dark"
                    :active="user.full_name.length > 20"
                  >
                    {{ truncate(user.full_name, 20) }}
                  </p-tooltip>
                  <span class="full-text">{{ user.full_name }}</span>
                </p>
                <p>
                  <p-tooltip
                    v-if="user.email"
                    :label="user.email"
                    size="large"
                    position="top"
                    type="dark"
                    :active="user.email.length > 20"
                  >
                    {{ truncate(user.email, 20) }}
                  </p-tooltip>
                  <span class="full-text">{{ user.email }}</span>
                </p>
                <p v-if="showPhoneNumber">{{ user.phone_number || 'N/A' }}</p>
                <p>{{ types[user.class] }}</p>
                <p>{{ user.tax_code || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Số dư:</p>
                <p>Tiền chờ xử lý:</p>
                <p>Kiểu thanh toán:</p>
                <p>Công nợ:</p>
                <p>Công nợ cho phép:</p>
                <p>Thời gian cho phép:</p>
              </div>
              <div class="right">
                <p>{{ (user.balance > 0 ? user.balance : 0) | formatPrice }}</p>
                <p>{{ user.holding_money | formatPrice }}</p>
                <p>{{
                  user.user_info && user.user_info.debt_max_amount > 0
                    ? 'Trả sau'
                    : 'Trả trước'
                }}</p>
                <p>{{
                  (user.balance > 0 ? 0 : Math.abs(user.balance)) | formatPrice
                }}</p>
                <p>{{
                  (user.user_info ? user.user_info.debt_max_amount : 0)
                    | formatPrice
                }}</p>
                <p>{{
                  user.user_info && user.user_info.debt_max_day > 0
                    ? `${user.user_info.debt_max_day} ngày`
                    : 'N/A'
                }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Kích thước hàng:</p>
                <p>Loại hàng:</p>
                <p>Quy mô:</p>
                <br v-if="user.package == 1" />
                <p>Địa chỉ kho:</p>
              </div>
              <div class="right">
                <p>{{ user.volume || 'N/A' }}</p>
                <p>{{ user.item_type || 'N/A' }}</p>
                <p>{{ getPackage(user.package) || 'N/A' }}</p>
                <p>{{ user.warehouse_address || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="multi-page">
        <div class="tab">
          <a
            href="javascript:void(0)"
            @click="setTab('packages')"
            :class="{ deactive: !isPackages, active: isPackages }"
            >Đơn hàng</a
          >
          <a
            v-if="current_user.role != roleSupportLeader"
            href="javascript:void(0)"
            @click="setTab('return')"
            :class="{ deactive: !isReturn, active: isReturn }"
            >Đơn hàng trả về</a
          >
          <a
            href="javascript:void(0)"
            @click="setTab('claim')"
            :class="{ deactive: !isClaim, active: isClaim }"
            >Khiếu nại</a
          >
          <a
            href="javascript:void(0)"
            @click="setTab('product')"
            :class="{ deactive: !isProduct, active: isProduct }"
            >Danh sách sản phẩm</a
          >
          <a
            v-if="current_user.role != roleSupportLeader"
            href="javascript:void(0)"
            @click="setTab('bill')"
            :class="{ deactive: !isBill, active: isBill }"
            >Hóa đơn</a
          >
          <a
            v-if="current_user.role != roleSupportLeader"
            href="javascript:void(0)"
            @click="setTab('topup')"
            :class="{ deactive: !isTopup, active: isTopup }"
            >Thanh toán</a
          >
        </div>
        <list-packages
          v-if="isPackages"
          :user_id="userID"
          :searchBy="searchBy"
        ></list-packages>
        <list-packages-return
          v-if="isReturn"
          :user_id="userID"
          :searchBy="searchBy"
        ></list-packages-return>
        <list-claim
          v-if="isClaim"
          :user_id="userID"
          :searchBy="searchByClaim"
        ></list-claim>
        <bill-list
          v-if="isBill || isTopup"
          :user_id="userID"
          :email="user.email"
          :tab="tab"
          :searchBy="searchByBill"
        ></bill-list>
        <list-product v-if="isProduct" :user_id="userID"></list-product>
      </div>
    </div>
    <empty-search-result v-else></empty-search-result>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  CUSTOMER_STATUS_TAB,
  OPTIONS_PACKAGES,
  MAP_USER_CLASS_TEXT,
} from '../constants'
import api from '@/packages/shared/api'
import { GET_USER } from '../../../packages/shared/store'
import ListPackages from '../../package/views/ListPackages.vue'
import ListPackagesReturn from '../../package/views/ListPackagesReturn.vue'
import ListClaim from '../../claim/views/ListClaim.vue'
import BillList from '../../bill/views/List.vue'
import ListProduct from './ListProduct.vue'
import { ROLE_SUPPORT_LEADER } from '@core/constants'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import CustomerStatistic from '../../statitic/views/Customer.vue'

export default {
  name: 'UserDetail',
  mixins: [mixinRoute, mixinTable],
  components: {
    ListPackages,
    ListPackagesReturn,
    ListClaim,
    BillList,
    ListProduct,
    EmptySearchResult,
    CustomerStatistic,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 2,
      },
      isFetching: false,
      statusUser: CUSTOMER_STATUS_TAB,
      userID: 0,
      user: {},
      tab: 'packages',
      searchBy: {
        code: 'LionBay tracking',
        order_number: 'Mã đơn hàng',
        recipient: 'Người nhận',
        tracking: 'Last mile tracking',
      },
      searchByBill: {
        bill_code: 'Hóa đơn',
        order_number: 'Đơn hàng',
        tracking: 'Lionbay/ Last mile tracking',
      },
      searchByClaim: {
        code: 'Mã tracking',
        recipient: 'Người xử lý',
        id: 'Mã khiếu nại',
      },
      mapPackage: OPTIONS_PACKAGES,
      roleSupportLeader: ROLE_SUPPORT_LEADER,
    }
  },
  created() {
    this.userID = parseInt(this.$route.params.id, 10)
    this.init()
  },
  computed: {
    ...mapState('shared', {
      current_user: (state) => state.user,
    }),
    types() {
      return MAP_USER_CLASS_TEXT
    },
    isPackages() {
      return this.tab === 'packages'
    },
    isReturn() {
      return this.tab === 'return'
    },
    isClaim() {
      return this.tab === 'claim'
    },
    isProduct() {
      return this.tab === 'product'
    },
    isBill() {
      return this.tab === 'bill'
    },
    isTopup() {
      return this.tab === 'topup'
    },
    isStatistic() {
      return this.tab === 'statistic'
    },
    showPhoneNumber() {
      return this.$isAdmin()
    },
  },
  methods: {
    truncate,
    ...mapActions('shared', [GET_USER]),

    async init() {
      this.isFetching = true

      let response = await api.fetchUsersByRole(
        Object.assign({}, { user_id: this.userID, role: 'customer' })
      )
      if (response && response.errorMessage) {
        this.$toast.error(response.errorMessage)
        this.user = null
        return
      }

      this.user = response.users[0]
      this.isFetching = false
    },
    setTab(tab) {
      this.tab = tab
    },
    getPackage(i) {
      let a = this.mapPackage.find((pkg) => pkg.id == i)
      return a ? a.value : 'N/A'
    },
  },
  watch: {
    tab: {
      handler: function () {},
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
