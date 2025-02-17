<template>
  <div class="pages list__claim">
    <div class="page-content">
      <div class="d-flex list__claim-search mb-12">
        <div class="group">
          <p-input
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            clearable
            v-model="filter.search"
            @input="checkClearSearch"
            @keyup.enter="handleSearch"
          >
          </p-input>
          <p-select
            class=""
            placeholder="Please select"
            v-model="filter.search_by"
          >
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>

        <div class="d-flex date-search">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            :label="labelDate"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="list__claim-list">
            <status-tab
              v-model="filter.status"
              :status="claimStatus"
              :has-all="false"
            />
            <vcl-table class="md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="claims.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ KHIẾU NẠI</th>
                      <th>MÃ VẬN ĐƠN</th>
                      <th>TIÊU ĐỀ</th>
                      <th>NGƯỜI XỬ LÝ</th>
                      <th>NGƯỜI XÉT DUYỆT</th>
                      <th>NGÀY TẠO</th>
                      <th>TRẠNG THÁI</th>
                      <th>TIỀN HOÀN</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in displayClaims" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                        >
                          {{ item.id }}
                        </router-link>
                      </td>
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: { id: item.package_id },
                          }"
                        >
                          {{ item.package_code }}
                        </router-link>
                      </td>
                      <td>
                        <p-tooltip
                          :label="item.title"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.title.length > 25"
                        >
                          {{ truncate(item.title, 25) }}
                        </p-tooltip>
                      </td>
                      <td>{{ item.supports }}</td>
                      <td>{{ item.accountant }}</td>
                      <td>{{ item.created_at | datetime('dd/MM/yyyy') }}</td>
                      <td>
                        <span v-status="item.status" type="claim"></span>
                      </td>
                      <td>{{ item.amount | formatPrice }}</td>
                      <td style="white-space: nowrap">
                        <button
                          class="btn btn-info"
                          v-if="
                            !item.is_processed && [
                              $isAccountant() || $isAdmin(),
                            ]
                          "
                          @click="confirmHandle(item)"
                          >Xác nhận</button
                        >
                        <button
                          class="btn btn-danger ml-1"
                          v-if="
                            !item.is_processed && [
                              $isAccountant() || $isAdmin(),
                            ]
                          "
                          @click="cancelHandle(item)"
                          >Từ chối</button
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <EmptySearchResult v-else></EmptySearchResult>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import {
  CLAIM_STATUS_PENDING,
  CLAIM_STATUS_PROCESSED,
  CLAIM_STATUS_APPLYING,
} from '../constants'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import {
  FETCH_LIST_CLAIMS,
  FETCH_COUNT_CLAIMS,
  CONFIRM_CLAIM,
  UPDATE_TICKET,
} from '../store'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListClaim',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
  },
  props: {
    user_id: {
      type: Number,
      default: 0,
    },
    searchBy: {
      type: Object,
      default() {
        return {
          id: 'Mã khiếu nại',
          code: 'Mã tracking',
          recipient: 'Người xử lý',
          customer_code: 'Mã khách hàng',
        }
      },
    },
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: CLAIM_STATUS_PENDING,
        search_by: 'code',
        start_date: '',
        end_date: '',
      },
      keywordSearch: '',
      isFetching: false,
      claimStatus: [
        {
          value: CLAIM_STATUS_PENDING,
          text: 'Chờ xét duyệt',
        },
        {
          value: CLAIM_STATUS_PROCESSED,
          text: 'Đã xét duyệt',
        },
      ],
      labelDate: `Tìm theo ngày`,
    }
  },
  created() {
    this.filter = { ...this.filter, ...this.getRouteQuery() }
    this.init()
  },
  computed: {
    ...mapState('claim', {
      count: (state) => state.count,
      claims: (state) => state.claims,
    }),
    displayClaims() {
      return (this.claims || []).map((item) => {
        const supports = (item.supports || []).map(({ full_name }) => full_name)
        const customer = (item.user || {}).full_name || '-'
        const accountant = (item.accountant || {}).full_name || '-'
        const code = ((item.package || {}).package_code || {}).code || '-'

        return {
          id: item.id,
          package_id: item.package ? item.package.id : 0,
          package_code: code,
          title: item.title,
          supports: supports.join(', '),
          created_at: item.created_at,
          updated_at: item.updated_at,
          status: item.status,
          user_name: customer,
          accountant: accountant,
          amount: Math.abs(item.amount || 0),
          is_processed: item.status == CLAIM_STATUS_PROCESSED,
        }
      })
    },
    searchPlaceholder() {
      const maptext = {
        id: 'Tìm theo mã khiếu nại',
        code: 'Tìm theo AnanBay tracking',
        recipient: 'Tìm theo người xử lý',
        customer_code: 'Tìm theo mã khách hàng',
      }

      return maptext[this.filter.search_by] || maptext['code']
    },
  },
  methods: {
    ...mapActions('claim', [
      FETCH_LIST_CLAIMS,
      FETCH_COUNT_CLAIMS,
      CONFIRM_CLAIM,
      UPDATE_TICKET,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      const filter = { ...this.filter }

      if (this.user_id > 0) {
        filter.user_id = this.user_id
      }

      filter.is_refund = true
      filter.search = (filter.search || '').toUpperCase()

      this[FETCH_COUNT_CLAIMS](filter)
      const res = await this[FETCH_LIST_CLAIMS](filter)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
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
    confirmHandle(item) {
      this.$dialog.confirm({
        title: `Xác nhận duyệt khiếu nại #${item.id}`,
        message: `Bạn có chắc chắn muốn xác nhận duyệt khiếu nại này?`,
        onConfirm: () => this.submitHandle(item),
      })
    },
    async submitHandle({ id }) {
      this.isFetching

      const payload = { id }
      const res = await this[CONFIRM_CLAIM](payload)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Xác nhận duyệt khiếu nại thành công!')
      this.init()
    },
    cancelHandle(item) {
      this.$dialog.confirm({
        title: `Từ chối xác nhận duyệt khiếu nại #${item.id}`,
        message: `Bạn có chắc chắn muốn từ chối xác nhận duyệt khiếu nại này?`,
        onConfirm: () => this.submitCancelHandle(item),
      })
    },
    async submitCancelHandle({ id }) {
      this.isFetching

      const payload = { id, status: CLAIM_STATUS_APPLYING }
      const res = await this[UPDATE_TICKET](payload)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Từ chối xác nhận duyệt khiếu nại thành công!')
      this.init()
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
