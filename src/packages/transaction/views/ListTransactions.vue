<template>
  <div class="list-transactions pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12" id="search-bar">
        <div style="flex: auto; margin-right: 16px">
          <user-resource
            id="account-search"
            v-if="filter.search_by == 'account'"
            v-model="supportInfo"
            :filter="{ role: 'customer' }"
            :label="`Tìm theo tài khoản`"
            :emitID="false"
            @input="handleSearch"
          />
          <user-resource
            id="account-name-search"
            v-else-if="filter.search_by == 'account_full_name'"
            v-model="supportInfo"
            :filter="{ role: 'customer' }"
            :label="`Tìm theo tên khách hàng`"
            :emitID="false"
            @input="handleSearch"
          />
          <user-resource
            id="support-search"
            v-else
            v-model="supportInfo"
            :filter="{ role: 'support' }"
            :label="`Tìm Support`"
            :emitID="false"
            @input="handleSearch"
          />
        </div>
        <div class="d-flex date-search">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            :label="'Tìm theo ngày'"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
        <div class="filter-group d-flex">
          <p-select placeholder="Please select" v-model="filter.search_by">
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <transaction-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="transactions.length">
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
                      <th>Thao tác</th>
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
                      ><span v-status="item.status" type="transaction"></span
                    ></td>
                    <td :title="item.user.full_name">
                      <span class="tool-tip"> {{ item.user.full_name }}</span>
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
                    <td class="btn-action">
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
                :total="count"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
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
  </div>
</template>
<script>
import UserResource from '@/components/shared/resource/UsersActive'
import { mapActions, mapState } from 'vuex'
import TransactionStatusTab from '../components/TransactionStatusTab'

import {
  TRANSACTION_STATUS_TAB,
  TRANSACTION_TYPE,
  TransactionLogTypePay,
  TransactionLogTypePayoneer,
  TransactionLogTypePingPong,
  TransactionLogTypeRefund,
  TransactionLogTypeTopup,
  TransactionStatusFailure,
  TransactionStatusProcess,
  TransactionStatusSuccess,
} from '../constants'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import {
  ROLE_ACCOUNTANT,
  ROLE_ADMIN,
  ROLER_BUSSINESS_MANAGER,
} from '@core/constants'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { cloneDeep } from '../../../core/utils'
import { CHANGE_STATUS_TRANSACTION, FETCH_LIST_TRANSACTIONS } from '../store'

export default {
  name: 'ListTransactions',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    TransactionStatusTab,
    ModalConfirm,
    UserResource,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        search_by: 'account',
        type: 1,
        start_date: '',
        end_date: '',
      },
      isFetching: false,
      searchBy: {
        // bill_code: 'Mã hoá đơn',
        account: 'Tài khoản khách hàng',
        account_full_name: 'Tên khách hàng',
        support: 'Tên nhân viên Support',
      },
      searchInfo: null,
      optionType: {
        1: 'Nạp tiền',
        2: 'Thanh toán',
        4: 'Hoàn tiền',
      },
      isChangingStatus: false,
      visibleConfirmSuccess: false,
      visibleConfirmFail: false,
      typePay: TransactionLogTypePay,
      selectedItem: null,
      money: [],
      validateErrors: [],
      keywordSearch: '',
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('transaction', {
      transactions: (state) => state.transactions,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    transactionType() {
      return TRANSACTION_TYPE
    },
    statusTab() {
      return TRANSACTION_STATUS_TAB
    },
    topupType() {
      return TransactionLogTypeTopup
    },
    successStatus() {
      return TransactionStatusSuccess
    },
    getPlaceHolder() {
      switch (this.filter.search_by) {
        case 'bill_code':
          return 'Tìm theo mã hóa đơn'
        case 'account':
          return 'Tìm theo email hoặc số điện thoại khách hàng'
        case 'account_full_name':
          return 'Tìm theo tên khách hàng'
        default:
          return ''
      }
    },
    failStatus() {
      return TransactionStatusFailure
    },
  },
  methods: {
    ...mapActions('transaction', [
      FETCH_LIST_TRANSACTIONS,
      CHANGE_STATUS_TRANSACTION,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      const result = await this[FETCH_LIST_TRANSACTIONS](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    resetErrors() {
      this.validateErrors = []
    },
    handleSearch() {
      switch (this.filter.search_by) {
        case 'account':
          this.filter.search = this.supportInfo ? this.supportInfo.email : ''
          break
        case 'account_full_name':
          this.filter.search = this.supportInfo
            ? this.supportInfo.full_name
            : ''
          break
        case 'support':
          this.filter.search = this.supportInfo ? this.supportInfo.id : ''
          break
        default:
      }
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
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
    checkValidateMoneyAmount() {
      this.resetErrors()
      return true
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
      await this.init()
    },
    showBtn(transaction) {
      return (
        (transaction.type === TransactionLogTypeTopup ||
          transaction.type === TransactionLogTypePayoneer ||
          transaction.type === TransactionLogTypePingPong) &&
        transaction.status === TransactionStatusProcess &&
        (this.user.role == ROLE_ADMIN ||
          this.user.role == ROLE_ACCOUNTANT ||
          this.user.role == ROLER_BUSSINESS_MANAGER)
      )
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
          return `Thanh toán hóa đơn <a href="${path}"><strong>#${transaction.bill.code}</strong></a>`
        case TransactionLogTypeRefund:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { code: transaction.bill.code },
          }).href
          return `Hoàn tiền  hóa đơn <a href="${path}"><strong>#${transaction.bill.code}</strong></a>`
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
  },
  watch: {
    filter: {
      handler: function () {
        if (this.isFetching) {
          return
        }
        this.init()
      },
      deep: true,
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
    line-clamp: 1;
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
.list-transactions .btn-info {
  white-space: nowrap;
}
.list-transactions .btn-danger {
  white-space: nowrap;
}
</style>
