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
            v-model="keywordSearch"
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
              :count="totalCount"
            />
            <vcl-table class="md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="listclaim.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ</th>
                      <th>ANANBAY TRACKING </th>
                      <th>LÝ DO</th>
                      <th>NGƯỜI XỬ LÝ</th>
                      <th>NGÀY TẠO</th>
                      <th>CẬP NHẬT</th>
                      <th>TRẠNG THÁI</th>
                      <th>KẾT QUẢ</th>
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
                          :label="item.reason"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.reason.length > 30"
                        >
                          {{ truncate(item.reason, 30) }}
                        </p-tooltip>
                      </td>
                      <td>{{ item.supports }}</td>
                      <td>{{ item.created_at | datetime('dd/MM/yyyy') }}</td>
                      <td>{{ item.updated_at | datetime('dd/MM/yyyy') }}</td>
                      <td>
                        <span v-status="item.status" type="claim"></span>
                      </td>
                      <td>
                        {{ item.type_text }}
                      </td>
                      <td width="40">
                        <router-link
                          v-if="item.isCustomerReply"
                          class="text-no-underline"
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                        >
                          <p-svg name="messenger"></p-svg>
                        </router-link>
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
  CLAIM_STATUS,
  MAP_REASON_CATEGORY_TEXT,
  REASON_CATEGORY_OTHER_TEXT,
  CLAIM_TYPES,
  CLAIM_STATUS_PROCESSED,
  CLAIM_CUSTOMER_REPLY,
} from '../constants'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { FETCH_CLAIMS } from '../store'
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
          code: 'Mã tracking',
          customer_code: 'Mã khách hàng',
          recipient: 'Người xử lý',
          id: 'Mã khiếu nại',
        }
      },
    },
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
        search_by: 'code',
        start_date: '',
        end_date: '',
      },
      keywordSearch: '',
      isFetching: false,
      claimStatus: CLAIM_STATUS,
      labelDate: `Tìm theo ngày`,
    }
  },
  created() {
    this.filter = { ...this.filter, ...this.getRouteQuery() }
    if (this.filter.search) {
      this.keywordSearch = this.filter.search
    }
    this.init()
  },
  computed: {
    ...mapState('claim', {
      count: (state) => state.count,
      listclaim: (state) => state.claims,
      totalCount: (state) => state.totalCount,
    }),
    displayClaims() {
      const mapTypes = new Map()
      for (const { id, name } of CLAIM_TYPES) {
        mapTypes.set(id, name)
      }

      return (this.listclaim || []).map((item) => {
        const supports = (item.supports || []).map(({ full_name }) => full_name)
        return {
          id: item.id,
          package_id: item.package ? item.package.id : 0,
          package_code:
            item.package && item.package.package_code
              ? item.package.package_code.code
              : '',
          title: item.title,
          reason:
            MAP_REASON_CATEGORY_TEXT[item.category] ||
            REASON_CATEGORY_OTHER_TEXT,
          supports: supports.join(', '),
          created_at: item.created_at,
          updated_at: item.updated_at,
          status: item.status,
          isCustomerReply:
            item.status_rep == CLAIM_CUSTOMER_REPLY &&
            item.status != CLAIM_STATUS_PROCESSED,
          user_id: item.user_id,
          user_name: item.user ? item.user.full_name : '',
          type_text: mapTypes.get(item.type) || '-',
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
    ...mapActions('claim', [FETCH_CLAIMS]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      this.filter.search = this.filter.search
        ? this.filter.search.toUpperCase()
        : ''
      let result = await this[FETCH_CLAIMS](this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
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
