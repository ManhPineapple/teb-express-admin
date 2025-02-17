<template>
  <div class="pages list__claim list__bill">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <div class="d-flex" style="flex: auto">
          <p-input
            id="search"
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            clearable
            v-model="filter.search"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
            v-if="filter.search_by != 'customer'"
          >
          </p-input>
          <user-resource
            id="search"
            v-else
            v-model="userInfo"
            class="user-resource is-fullwidth"
            :filter="{ role: 'customer' }"
            :search="filter.search"
            :label="`Tìm khách hàng`"
            :emitID="false"
            @input="handleSearch"
            :isTester="tester"
            :arr-status="this.search_status_filter"
          />
          <div class="">
            <select
              v-model="filter.search_by"
              class="form-control"
              style="width: auto"
            >
              <option :value="key" v-for="(value, key) in searchBy" :key="key">
                {{ value }}
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="
            user.role == ROLE_ADMIN ||
            user.role == ROLE_ACCOUNTANT ||
            user.role == ROLE_BU_MANAGER
          "
          class="ml-8"
        >
          <p-button type="info" @click="handleShowModalCreateExtraFee">
            Tạo phí phát sinh
          </p-button>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="list__bill-list">
                <status-tab
                  class="tab-type"
                  v-model="filter.tab"
                  :status="listTab"
                  :hasAll="false"
                />
                <status-tab
                  v-if="filter.tab == 'topup'"
                  class="mt-16 topup-type"
                  v-model="filter.type"
                  :status="listType"
                  :hasAll="false"
                />
                <vcl-table class="md-20 mt-16" v-if="isFetching"></vcl-table>
                <template v-else-if="bills.length > 0 && filter.tab == 'bill'">
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr class="list__claim-title">
                          <th width="100">MÃ HÓA ĐƠN</th>
                          <th>KHÁCH HÀNG</th>
                          <th>NGÀY TẠO</th>
                          <th>TỔNG HÓA ĐƠN</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in transBills" :key="item.id">
                          <td>
                            <router-link
                              class="text-no-underline"
                              :to="{
                                name: 'bill-detail',
                                params: { code: item.code },
                              }"
                            >
                              {{ item.code }}
                            </router-link>
                          </td>
                          <td>
                            {{ item.customer }}
                          </td>
                          <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                          <td> {{ item.total_amount | formatPrice }} </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mb-16"
                    v-if="count > 0"
                  >
                    <p-pagination
                      :total="count"
                      :perPage.sync="filter.limit"
                      :current.sync="filter.page"
                      size="sm"
                    ></p-pagination>
                  </div>
                </template>
                <template
                  v-else-if="transactions.length > 0 && filter.tab == 'topup'"
                >
                  <div class="table-responsive">
                    <table
                      class="table table-hover"
                      id="tbl-packages"
                      :class="{
                        responsive: this.filter.type == 2 || filter.type == 4,
                      }"
                    >
                      <thead>
                        <tr>
                          <template>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Khách hàng</th>
                            <th class="content">Nội dung</th>
                            <th>Hình thức</th>
                            <th>Giá trị</th>
                            <th>Người xác nhận</th>
                            <th v-if="filter.type == 1">Thao tác</th>
                          </template>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, i) in transactions" :key="i">
                          <td :title="item.created_at | date('dd/MM/yyyy')"
                            ><span>{{
                              item.created_at | date('dd/MM/yyyy')
                            }}</span></td
                          >
                          <td
                            ><span
                              v-status="item.status"
                              type="transaction"
                            ></span
                          ></td>
                          <td :title="item.user.full_name">
                            <span class="tool-tip">
                              {{ item.user.full_name }}</span
                            >
                          </td>
                          <td :title="getTitle(item)">
                            <span
                              class="tool-tip"
                              v-html="getDescription(item)"
                            ></span
                          ></td>
                          <td :title="getTextType(item)">
                            <span class="tool-tip">
                              {{ getTextType(item) }}
                            </span>
                          </td>
                          <td>
                            <div
                              :class="{ error: validateErrors[item.id] }"
                              v-if="showInputMoney(item)"
                            >
                              <span class="tooltip-notice">
                                <p-svg
                                  style="vertical-align: top"
                                  name="notice"
                                ></p-svg>
                                Vui lòng nhập số tiền!
                              </span>
                              <p-input
                                v-model="money[item.id]"
                                :ref="'money_' + item.id"
                                placeholder="Nhập số tiền ($)"
                                class="input-money"
                                type="text"
                                @blur="resetErrors"
                                @input="onChangeAmount($event, item)"
                              />
                            </div>
                            <span v-else style="white-space: nowrap"
                              >{{ item.type === typePay ? '-' : '+' }}
                              {{ Math.abs(item.amount) | formatPrice }}</span
                            >
                          </td>
                          <td>{{ item.admin ? item.admin.full_name : '' }}</td>
                          <td class="btn-action" v-if="filter.type == 1">
                            <div v-if="showBtn(item)" style="display: flex">
                              <p-button
                                @click="handleConfirm(successStatus, item)"
                                class="mr-2"
                                type="info"
                              >
                                Xác nhận
                              </p-button>
                              <p-button
                                @click="handleConfirm(failStatus, item)"
                                type="danger"
                              >
                                Từ chối
                              </p-button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mb-16"
                    v-if="count > 0"
                  >
                    <p-pagination
                      :total="count_transactions"
                      :perPage.sync="filter.limit"
                      :current.sync="filter.page"
                      size="sm"
                    ></p-pagination>
                  </div>
                </template>
                <EmptySearchResult v-else></EmptySearchResult>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-header jc-sb">
              <span>Khách hàng</span>
              <div
                class="icon"
                v-if="
                  (user.role == ROLE_ADMIN ||
                    user.role == ROLE_ACCOUNTANT ||
                    user.role == ROLE_BU_MANAGER) &&
                  userInfo
                "
              >
                <p-tooltip
                  :label="'Export công nợ'"
                  size="large"
                  position="top"
                  type="dark"
                  :active="true"
                >
                  <a href="#" @click.prevent="handleShowModalExport">
                    <p-svg name="download"></p-svg>
                  </a>
                </p-tooltip>

                <p-tooltip
                  :label="'Cài đặt'"
                  size="large"
                  position="top"
                  type="dark"
                  :active="true"
                  v-if="$isAdmin()"
                >
                  <a href="#" @click.prevent="handleShowModalSetting">
                    <p-svg name="setting_user"></p-svg>
                  </a>
                </p-tooltip>
              </div>
            </div>
            <div class="card-body">
              <div v-if="filter.search_by == 'customer' && userInfo">
                <div class="row">
                  <div class="col-5">Tên:</div>
                  <div class="col-7">{{ userInfo.full_name }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Email:</div>
                  <div class="col-7">{{ userInfo.email }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Loại tài khoản:</div>
                  <div class="col-7">{{ types[userInfo.class] }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Kiểu thanh toán:</div>
                  <div class="col-7">{{
                    userInfo.user_info && userInfo.user_info.debt_max_amount > 0
                      ? 'Trả sau'
                      : 'Trả trước'
                  }}</div>
                </div>
                <div class="row row-seperate"></div>
                <div class="row">
                  <div class="col-5">Số dư:</div>
                  <div class="col-7">{{
                    (userInfo.balance > 0 ? userInfo.balance : 0) | formatPrice
                  }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Công nợ:</div>
                  <div class="col-7">{{
                    (userInfo.balance > 0 ? 0 : Math.abs(userInfo.balance))
                      | formatPrice
                  }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Công nợ cho phép:</div>
                  <div class="col-7">{{
                    (userInfo.user_info
                      ? userInfo.user_info.debt_max_amount
                      : 0) | formatPrice
                  }}</div>
                </div>
                <div class="row">
                  <div class="col-5">Thời gian cho phép:</div>
                  <div class="col-7">
                    {{
                      userInfo.user_info && userInfo.user_info.debt_max_day > 0
                        ? `${userInfo.user_info.debt_max_day} ngày`
                        : '-'
                    }}
                    <br />
                    {{ debtDay }}
                  </div>
                </div>
              </div>
              <img v-else src="~@/assets/img/not-found.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-create-extra-fee
      :types="fee_types"
      :visible.sync="visibleCreateExtraFeeModal"
      :loading="isSubmitting"
      :email="email"
      @save="handleSubmitExtraFee"
    >
    </modal-create-extra-fee>
    <modal-confirm
      :visible.sync="visibleConfirmSuccess"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn về giao dịch này ?`"
      :title="`Xác nhận giao dịch`"
      @action="changeStatusTransactionHandle(successStatus)"
      :loading="isChangingStatus"
      :disabled="isChangingStatus"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmFail"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn giao dịch này không thành công ?`"
      :title="`Từ chối giao dịch`"
      @action="changeStatusTransactionHandle(failStatus)"
      :loading="isChangingStatus"
      :disabled="isChangingStatus"
    ></modal-confirm>
    <modal-edit-user
      v-if="isVisibleEditUser"
      :visible.sync="isVisibleEditUser"
      :current="userInfo"
      @success="updateSuccess"
    >
    </modal-edit-user>
    <modal-export
      :user="userInfo"
      :options="statusPackage"
      :visible.sync="visibleExportModal"
      :loading="isExporting"
      @save="handleExport"
    >
    </modal-export>
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  BILL_FETCH,
  BILL_COUNT,
  FETCH_FEE_EXTRA_TYPES,
  CREATE_EXTRA_FEE,
} from '../store'
import { mapActions, mapState } from 'vuex'
import ModalCreateExtraFee from '../components/ModalCreateExtraFee'
import {
  ROLE_ADMIN,
  ROLE_ACCOUNTANT,
  ROLER_BUSSINESS_MANAGER,
} from '@core/constants'
import {
  FETCH_LIST_TRANSACTIONS,
  CHANGE_STATUS_TRANSACTION,
} from '../../transaction/store'
import {
  USER_STATUS_ACTIVE,
  USER_STATUS_DEACTIVE,
} from '../../setting/constants'
import {
  TRANSACTION_TYPE,
  TransactionLogTypeTopup,
  TransactionLogTypePay,
  TransactionStatusProcess,
  TransactionStatusSuccess,
  TransactionStatusFailure,
  TransactionLogTypeRefund,
  TransactionLogTypePayoneer,
  TransactionLogTypePingPong,
} from '../../transaction/constants'
import { cloneDeep } from '../../../core/utils'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import { MAP_USER_CLASS_TEXT } from '../../setting/constants'
import ModalEditUser from '../../setting/components/ModalEdit'
import ModalExport from '../../setting/components/ModalExport'
import { PACKAGE_STATUS_TAB } from '../../package/constants'
import { EXPORT_PACKAGE } from '../../setting/store/index'
import mixinDownload from '@/packages/shared/mixins/download'
import { truncate } from '@core/utils/string'
import UserResource from '@/components/shared/resource/UsersActive'

export default {
  name: 'BillList',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    ModalCreateExtraFee,
    ModalConfirm,
    ModalEditUser,
    ModalExport,
    UserResource,
  },
  props: {
    user_id: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      default: '',
    },
    searchBy: {
      type: Object,
      default() {
        return {
          customer: 'khách hàng',
          bill_code: 'Hóa đơn',
          order_number: 'Đơn hàng',
          tracking: 'Ananbay/ Last mile tracking',
        }
      },
    },
    tab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 30,
        search_by: 'customer',
        status: '',
        tab: 'bill',
      },
      search_status_filter: `${USER_STATUS_ACTIVE},${USER_STATUS_DEACTIVE}`,
      isSubmitting: false,
      visibleCreateExtraFeeModal: false,
      isFetching: false,
      ROLE_ADMIN: ROLE_ADMIN,
      ROLE_ACCOUNTANT: ROLE_ACCOUNTANT,
      ROLE_BU_MANAGER: ROLER_BUSSINESS_MANAGER,
      listTab: [
        {
          value: 'bill',
          text: 'Hóa đơn',
        },
        {
          value: 'topup',
          text: 'Thanh toán',
        },
      ],
      typePay: TransactionLogTypePay,
      validateErrors: [],
      money: [],
      isChangingStatus: false,
      visibleConfirmSuccess: false,
      visibleConfirmFail: false,
      listType: [
        {
          value: 1,
          text: 'Nạp tiền',
        },
        {
          value: 2,
          text: 'Thanh toán',
        },
        {
          value: 4,
          text: 'Hoàn tiền',
        },
      ],
      userInfo: null,
      isVisibleEditUser: false,
      visibleExportModal: false,
      isExporting: false,
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
    }
  },
  created() {
    this.filter = { ...this.getRouteQuery() }
    this.filter.search_by = this.user_id > 0 ? 'bill_code' : 'customer'
    if (this.tab == 'bill' || this.tab == 'topup') {
      this.filter.tab = this.tab
    }
    if (this.filter.tab == 'topup') {
      this.initTopup()
    } else this.init()
  },
  computed: {
    ...mapState('bill', {
      count: (state) => state.count,
      bills: (state) => state.bills,
      fee_types: (state) => state.extraFeeTypes,
    }),
    ...mapState('transaction', {
      transactions: (state) => state.transactions,
      count_transactions: (state) => state.count,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    ...mapState('setting', {
      user_info: (state) => state.user_info,
    }),

    transBills() {
      return this.bills.map((item) => {
        let user = 'unknown'
        if (item.user) {
          const username = item.user.email || item.user.phone_number
          if (item.user.full_name) {
            user = `${item.user.full_name}-${username}`
          } else {
            user =
              item.user.email && item.user.phone_number
                ? `${item.user.email}-${item.user.phone_number}`
                : username
          }
        }

        return {
          code: item.code,
          customer: user,
          created_at: item.created_at,
          total_amount: item.shipping_fee + item.extra_fee,
        }
      })
    },
    debtDay() {
      var today = new Date().getTime()
      if (this.userInfo.user_info && this.userInfo.user_info.debt_max_day > 0) {
        var debt_day = ''
        var date
        var day_user = new Date(this.userInfo.user_info.debt_time).getTime()
        if (!day_user) {
          date = 0
        } else {
          var distance = today - day_user
          date = distance / (1000 * 60 * 60 * 24)
        }
        debt_day = this.userInfo.user_info.debt_max_day - date
        let text = `(Còn 0 ngày)`
        if (debt_day >= 1) {
          text = `(Còn ${Math.floor(debt_day)} ngày)`
        } else if (debt_day * 24 >= 1) {
          text = `(Còn ${Math.floor(debt_day * 24)} giờ)`
        } else if (debt_day * 24 * 60 >= 1) {
          text = `(Còn ${Math.floor(debt_day * 24 * 60)} phút)`
        }
        return text
      }
      return ''
    },
    searchPlaceholder() {
      const maptext = {
        bill_code: 'Tìm theo mã hoá đơn',
        order_number: 'Tìm theo mã đơn hàng',
        customer: 'Tìm theo email/số điện thoại',
        tracking: 'Tìm theo mã tracking',
      }

      return maptext[this.filter.search_by] || maptext['id']
    },
    transactionType() {
      return TRANSACTION_TYPE
    },
    successStatus() {
      return TransactionStatusSuccess
    },
    failStatus() {
      return TransactionStatusFailure
    },
    types() {
      return MAP_USER_CLASS_TEXT
    },
    statusPackage() {
      return PACKAGE_STATUS_TAB.filter((x) => x.value != 'alert')
    },
  },
  methods: {
    truncate,

    ...mapActions('bill', {
      fetchHandle: BILL_FETCH,
      countHandle: BILL_COUNT,
      fetchFeeType: FETCH_FEE_EXTRA_TYPES,
      createExtraFee: CREATE_EXTRA_FEE,
    }),
    ...mapActions('transaction', [
      FETCH_LIST_TRANSACTIONS,
      CHANGE_STATUS_TRANSACTION,
    ]),
    ...mapActions('setting', [EXPORT_PACKAGE]),

    async init() {
      this.filter.limit = this.filter.limit != 30 ? 30 : this.filter.limit
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      this.isFetching = true

      const res = await Promise.all([
        this.fetchHandle(this.filter),
        this.countHandle(this.filter),
        this.fetchFeeType(),
      ])

      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    async initTopup() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      let payload = cloneDeep(this.filter)
      const result = await this[FETCH_LIST_TRANSACTIONS](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
    },
    async handleSubmitExtraFee(payload) {
      this.isSubmitting = true
      const result = await this.createExtraFee(payload)
      this.isSubmitting = false
      this.visibleCreateExtraFeeModal = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }

      this.$toast.open({
        type: 'success',
        message: 'Tạo phí phát sinh thành công',
      })
      this.init()
    },
    handleSearch() {
      this.filter.page = 1
      if (this.filter.search_by == 'customer') {
        this.filter.search = this.userInfo ? this.userInfo.email : ''
      }
    },
    handleShowModalCreateExtraFee() {
      this.visibleCreateExtraFeeModal = true
    },
    getTitle(transaction) {
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `Nạp topup ${transaction.id}`
        case TransactionLogTypePay:
          return `Thanh toán hóa đơn ${transaction.bill.code}`
        case TransactionLogTypeRefund:
          return `Hoàn tiền hóa đơn ${transaction.bill.code}`
        default:
          return null
      }
    },
    getDescription(transaction) {
      let path = ''
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `Nạp topup <strong>#${transaction.id}</strong>`
        case TransactionLogTypePay:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { code: transaction.bill.code },
          }).href
          return `Thanh toán hóa đơn <a class="text-no-underline" href="${path}"><strong>#${transaction.bill.code}</strong></a>`
        case TransactionLogTypeRefund:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { code: transaction.bill.code },
          }).href
          return `Hoàn tiền  hóa đơn <a class="text-no-underline" href="${path}"><strong>#${transaction.bill.code}</strong></a>`
        case TransactionLogTypePayoneer:
          return `#${transaction.description}`
        case TransactionLogTypePingPong:
          return `#${transaction.description}`
        default:
          return null
      }
    },
    showInputMoney(transaction) {
      return (
        (transaction.type === TransactionLogTypePayoneer ||
          transaction.type === TransactionLogTypePingPong) &&
        transaction.status === TransactionStatusProcess &&
        transaction.amount <= 0
      )
    },
    getTextType(transaction) {
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return 'Chuyển khoản'
        case TransactionLogTypePayoneer:
          return `Payoneer`
        case TransactionLogTypePingPong:
          return `PingPong`
        default:
          return 'N/A'
      }
    },
    async changeStatusTransactionHandle(status) {
      this.isChangingStatus = true
      const payload = {
        id: this.selectedItem.id,
        status: status,
      }
      const result = await this[CHANGE_STATUS_TRANSACTION](payload)
      this.isChangingStatus = false
      this.visibleConfirmSuccess = false
      this.visibleConfirmFail = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      let msg = ''
      switch (status) {
        case TransactionStatusSuccess:
          msg = 'Xác nhận giao dịch thành công'
          break
        case TransactionStatusFailure:
          msg = 'Từ chối giao dịch thành công'
          break
        default:
          break
      }
      this.$toast.open({ message: msg, type: 'success' })
      await this.initTopup()
    },
    showBtn(transaction) {
      return (
        (transaction.type === TransactionLogTypeTopup ||
          transaction.type === TransactionLogTypePayoneer ||
          transaction.type === TransactionLogTypePingPong) &&
        transaction.status === TransactionStatusProcess &&
        (this.user.role == ROLE_ADMIN || this.user.role == ROLE_ACCOUNTANT)
      )
    },
    resetErrors() {
      this.validateErrors = []
    },
    checkValidateMoneyAmount() {
      this.resetErrors()
      return true
    },
    handleConfirm(status, item) {
      this.selectedItem = item
      this.resetErrors()
      let validAmount
      switch (status) {
        case TransactionStatusSuccess:
          validAmount = this.checkValidateMoneyAmount()
          if (!validAmount) {
            this.$nextTick(function () {
              this.$refs['money_' + this.selectedItem.id][0].focus()
            })
            break
          }
          this.visibleConfirmSuccess = true
          break
        case TransactionStatusFailure:
          this.visibleConfirmFail = true
          break
        default:
          break
      }
    },
    onChangeAmount(e, transaction) {
      let value = e.trim().replace(/[^\d.-]/g, '')

      let lastCharacter = value.substr(-1)
      if (lastCharacter === '.') {
        if (value.length === 1 || value.split('.').length > 2) {
          value = value.slice(0, -1)
        }
      } else {
        let valid = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(value)
        if (!valid) {
          value = value.slice(0, -1)
        }
      }
      value = value.replace(/,/g, '').replace(/^0+/, '')
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.money[transaction.id] = value
    },
    handleShowModalSetting() {
      if (!this.userInfo) return
      this.isVisibleEditUser = true
    },

    updateSuccess(value) {
      this.isVisibleEditUser = false
      this.userInfo.class = value
      this.userInfo.user_info = this.user_info
      if (this.filter.tab == 'topup') {
        this.initTopup()
      } else this.init()
    },
    handleShowModalExport() {
      if (!this.userInfo) return

      this.visibleExportModal = true
    },
    async handleExport(payload) {
      this.isExporting = true
      const result = await this[EXPORT_PACKAGE](payload)
      this.isExporting = false

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadPackage(result.url, 'packages', result.url.split('/')[1])
    },
  },
  watch: {
    'filter.status': function () {
      this.filter.page = 1
      this.init()
    },
    'filter.page': function () {
      if (this.filter.tab == 'topup') {
        this.initTopup()
      } else this.init()
    },
    'filter.search_by': function () {
      if (this.filter.search != '') {
        this.filter.page = 1
        if (this.filter.tab == 'bill') {
          this.init()
        } else this.initTopup()
      }
    },
    'filter.search': function () {
      this.filter.page = 1
      if (this.filter.tab == 'bill') {
        this.init()
      } else this.initTopup()
    },
    'filter.tab': function () {
      this.filter.page = 1
      if (this.filter.tab == 'topup') {
        this.filter.type = 1
        this.initTopup()
      } else this.init()
    },
    'filter.type': function () {
      this.filter.page = 1
      this.initTopup()
    },
    tab: function () {
      if (this.tab == 'bill' || this.tab == 'topup') {
        this.filter.tab = this.tab
      }
    },
  },
}
</script>

<style lang="scss">
@media screen and (max-width: 1400px) {
  .responsive {
    .content {
      width: 300px;
    }
    .btn-action {
      min-width: 10px !important;
    }
  }
  .btn-action {
    min-width: 180px;
  }
  .list-transactions td > span.tool-tip {
    width: 100%;
    height: 23px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
}
.input-money {
  max-width: 200px;
}
.input-money .form-control {
  height: 32px;
  border-radius: 4px !important;
  border: 1px solid #cfd0d0;
  padding: 3px 12px 7px;
}
.tooltip-notice {
  z-index: 9999;
  position: absolute;
  top: -48px;
  color: red;
  padding: 12px 17px 14px;
  box-shadow: 0 2px 4px rgba(40, 41, 61, 0.04),
    0 8px 16px rgba(96, 97, 112, 0.16);
  border: 1px solid #edeeee;
  background-color: #fff;
  visibility: hidden;
}
.error .tooltip-notice {
  visibility: visible;
}

.error .tooltip-notice::after {
  visibility: visible;
}

.error .input-money .form-control {
  border-color: #f5222d;
}
.tooltip-notice::after {
  border-top: 6px solid #fff;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  bottom: -6px;
  left: 12px;
  position: absolute;
  content: '';
  visibility: hidden;
  pointer-events: none;
  z-index: 999;
}
</style>
