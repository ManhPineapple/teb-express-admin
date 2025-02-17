<template>
  <div class="pages bill__detail">
    <div class="page-header">
      <div class="page-header_back">
        <router-link :to="{ name: 'bill-list' }" class="text">
          <img
            src="@/assets/img/Arrow - Left Square 24px.png"
            class="page-header_back_icon"
          />

          Hóa đơn
        </router-link>
      </div>
      <div class="bill__detail-flex">
        <div class="bill__detail-info">
          <div class="bill__detail-title">Mã hóa đơn:</div>
          <div class="bill__detail-title">Ngày tạo:</div>
          <div class="bill__detail-title">Tên khách hàng</div>
          <div class="bill__detail-title">Tổng hóa đơn</div>
          <div class="bill__detail-code">{{ bill.code }}</div>
          <div class="bill__detail-date">{{
            bill.created_at | date('dd/MM/yyyy HH:mm:ss')
          }}</div>
          <div v-if="bill && bill.user" class="bill__detail-date">{{
            bill.user.full_name || ''
          }}</div>
          <div class="bill__detail-status">{{ total_fee | formatPrice }}</div>
        </div>
        <div class="bill__detail-action">
          <p-button
            @click="handleExportBill"
            class="btn btn-info ml-3 text-nowrap"
            v-if="
              user.role == ROLE_ADMIN ||
              user.role == ROLE_ACCOUNTANT ||
              user.role == ROLE_BU_MANAGER
            "
            :loading="loading"
            >Export</p-button
          >
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="row">
        <div class="col-12 item-gutters" v-if="feeCreate.length">
          <div class="card-block">
            <div class="card-header">
              <div class="card-title">Phí vận đơn</div>
              <div class="card-pagi">
                <div
                  class="btn-pagi mr-2"
                  :class="{
                    'disable-next-page': filter.page <= 1,
                  }"
                  @click="previousCreateFee"
                >
                  <i class="fas fa-chevron-left"></i>
                </div>
                <div
                  class="btn-pagi"
                  :class="{
                    'disable-next-page': filter.page >= totalPageCreate,
                  }"
                  @click="nextCreateFee"
                >
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>AnanBay tracking</th>
                      <th>Last mile tracking</th>
                      <th>Phí giao</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in feeCreate" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                        >
                          {{ item.package_code ? item.package_code.code : '' }}
                          <span class="link-icon">
                            <p-svg name="external"></p-svg>
                          </span>
                        </router-link>
                      </td>
                      <td>{{
                        item.tracking ? item.tracking.tracking_number : ``
                      }}</td>
                      <td>{{ item.shipping_fee | formatPrice2 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 item-gutters" v-if="feeExtra.length">
          <div class="card-block">
            <div class="card-header">
              <div class="card-title">Phí phát sinh</div>
              <div class="card-pagi">
                <div
                  class="btn-pagi mr-2"
                  :class="{
                    'disable-next-page': filterExtra.page <= 1,
                  }"
                  @click="previousExtraFee"
                >
                  <i class="fas fa-chevron-left"></i>
                </div>
                <div
                  class="btn-pagi"
                  @click="nextExtraFee"
                  :class="{
                    'disable-next-page': filterExtra.page >= totalPageExtra,
                  }"
                >
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>AnanBay tracking</th>
                      <th>MÃ LÔ FBA</th>
                      <th>Thời gian</th>
                      <th>Phí phát sinh</th>
                      <th>Loại phí</th>
                      <th>Nội dung</th>
                      <th
                        v-if="
                          user.role == ROLE_ADMIN ||
                          user.role == ROLE_ACCOUNTANT ||
                          user.role == ROLE_BU_MANAGER
                        "
                        >Thao tác</th
                      >
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in feeExtra" :key="i">
                      <td>
                        <router-link
                          v-if="item.package && item.package.package_code"
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.package_id,
                            },
                          }"
                        >
                          {{
                            item.package
                              ? item.package.package_code
                                ? item.package.package_code.code
                                : ''
                              : null
                          }}
                          <span class="link-icon">
                            <p-svg name="external"></p-svg>
                          </span>
                        </router-link>
                      </td>
                      <td>
                        <router-link
                          v-if="item.customer_shipment_id"
                          class="text-no-underline"
                          :to="{
                            name: 'package-fba-detail',
                            params: {
                              id: item.customer_shipment_id,
                            },
                          }"
                        >
                          #{{ item.customer_shipment_id }}
                        </router-link>
                      </td>
                      <td>{{
                        item.created_at | date('dd/MM/yyyy HH:mm:ss')
                      }}</td>
                      <td>{{ item.amount | formatPrice2 }}</td>
                      <td>{{ item.extra_fee_types.name }}</td>
                      <td>
                        <p-tooltip
                          :label="item.description"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.description.length > 15"
                        >
                          {{ truncate(item.description, 15) }}
                        </p-tooltip>
                      </td>
                      <td
                        v-if="
                          user.role == ROLE_ADMIN ||
                          user.role == ROLE_ACCOUNTANT ||
                          user.role == ROLE_BU_MANAGER
                        "
                      >
                        <a @click="handelModal(item.id)" class="btn btn-danger">
                          <span>Huỷ</span>
                        </a>
                      </td>
                      <td>
                        <span
                          v-if="item.status == 10"
                          class="badge badge-round badge-unpaid"
                          >Chưa thanh toán</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="visibleConfirmFail"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn muốn hủy phí này ?`"
      :title="`Xác nhận hủy phí`"
      @action="handleCancel"
    ></modal-confirm>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { truncate } from '@core/utils/string'

import {
  FETCH_BILL_DETAIL,
  FETCH_BILL_EXTRA,
  CANCEL_EXTRA_FEE,
  EXPORT_BILL,
} from '../store'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import {
  ROLE_ADMIN,
  ROLE_ACCOUNTANT,
  ROLER_BUSSINESS_MANAGER,
} from '@core/constants'
import mixinDownload from '@/packages/shared/mixins/download'

export default {
  name: 'BillDetail',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: { ModalConfirm },
  data() {
    return {
      filterExtra: {
        page: 1,
        limit: 10,
      },
      filter: {
        page: 1,
        limit: 10,
      },
      total_fee: 0,
      total_unpaid: 0,
      visibleConfirmFail: false,
      idExtra: 0,
      ROLE_ADMIN: ROLE_ADMIN,
      ROLE_BU_MANAGER: ROLER_BUSSINESS_MANAGER,
      ROLE_ACCOUNTANT: ROLE_ACCOUNTANT,
      loading: false,
    }
  },
  computed: {
    ...mapState('bill', {
      feeCreate: (state) => state.feeCreate,
      countCreate: (state) => state.countCreate,
      feeExtra: (state) => state.feeExtra,
      countExtra: (state) => state.countExtra,
      bill: (state) => state.bill,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),

    totalPageCreate() {
      const totalPages = Math.ceil(this.countCreate / this.filter.limit)
      return totalPages
    },
    totalPageExtra() {
      const totalPages = Math.ceil(this.countExtra / this.filterExtra.limit)
      return totalPages
    },
  },
  created() {
    this.filterExtra.code = this.$route.params.code
    this.filter.code = this.$route.params.code
    this.init()
  },
  methods: {
    ...mapActions('bill', [
      FETCH_BILL_DETAIL,
      FETCH_BILL_EXTRA,
      CANCEL_EXTRA_FEE,
      EXPORT_BILL,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_BILL_DETAIL](this.filter)

      if (!result.success) {
        this.isFetching = false
        return
      }
      this.total_fee = this.bill.extra_fee + this.bill.shipping_fee
      this.total_unpaid = result.total_unpaid
      await this[FETCH_BILL_EXTRA](this.filterExtra)

      this.isFetching = false
    },
    handleRouter() {
      const { id } = this.$route.params
      this.$router
        .push({
          name: 'list-transaction',
          query: {
            search_by: 'bill_id',
            page: 1,
            limit: 30,
            search: id,
          },
        })
        .catch()
    },
    async previousCreateFee() {
      let page =
        this.filter.page <= 1 ? (this.filter.page = 1) : (this.filter.page -= 1)
      this.$set(this.filter, 'page', page)
      await this[FETCH_BILL_DETAIL](this.filter)
    },
    async nextCreateFee() {
      let page =
        this.filter.page >= this.totalPageCreate
          ? this.filter.page
          : this.filter.page + 1
      this.$set(this.filter, 'page', page)
      await this[FETCH_BILL_DETAIL](this.filter)
    },
    async previousExtraFee() {
      let page =
        this.filterExtra.page <= 1
          ? (this.filterExtra.page = 1)
          : (this.filterExtra.page -= 1)
      this.$set(this.filterExtra, 'page', page)
      await this[FETCH_BILL_EXTRA](this.filterExtra)
    },
    async nextExtraFee() {
      let page =
        this.filterExtra.page >= this.totalPageExtra
          ? this.filterExtra.page
          : this.filterExtra.page + 1
      this.$set(this.filterExtra, 'page', page)
      await this[FETCH_BILL_EXTRA](this.filterExtra)
    },
    handelModal(id) {
      this.visibleConfirmFail = true
      this.idExtra = id
    },
    async handleCancel() {
      let params = {
        id_extra: this.idExtra,
        id: this.bill.id,
      }
      let res = await this[CANCEL_EXTRA_FEE](params)
      if (!res.success) {
        this.$toast.open({ message: res.message, type: 'error' })
        return
      }
      this.visibleConfirmFail = false
      this.init()
    },

    async handleExportBill() {
      const payload = {
        bill_id: this.bill.id,
      }
      this.loading = true
      const result = await this[EXPORT_BILL](payload)
      this.loading = false

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
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
