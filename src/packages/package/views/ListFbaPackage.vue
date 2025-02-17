<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <div class="group d-flex">
          <p-input
            :placeholder="`Tìm theo mã lô hàng | AnanBay tracking | Order number`"
            prefixIcon="search"
            type="search"
            :clearable="true"
            :value="filter.keyword"
            @keyup.enter="handleSearch"
            @clear="handleClearSearch"
          >
          </p-input>
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
          <StatusTab v-model="filter.status" />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="shipments.length">
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover table-packages" id="tbl-packages">
                <thead>
                  <th>Shipment No.</th>
                  <th>WEIGHT</th>
                  <th>CREATED DATE</th>
                  <th>CUSTOMER</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in shipments" :key="i">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'package-fba-detail',
                          params: { id: item.id },
                        }"
                      >
                        #{{ item.id }}
                      </router-link>
                    </td>
                    <td>{{ item.weight | formatWeight }}kg</td>
                    <td>{{
                      item.created_at | datetime('dd/MM/yyyy HH:mm')
                    }}</td>
                    <td>{{ item.user.full_name }}</td>
                    <td>{{ item.price | formatPrice }}</td>
                    <td><Status :status="item.status" /></td>
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
              >
              </p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixinDownload from '@/packages/shared/mixins/download'
import { date } from '@core/utils/datetime'
import { FETCH_CUSTOMER_SHIPMENT } from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import Status from '../components/Status.vue'
import StatusTab from '../components/StatusTab.vue'
import { KG_TO_GRAM } from '@core/constants'
export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    Status,
    StatusTab,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        keyword: '',
        start_date: '',
        end_date: '',
        tester: this.$route.query.tester
          ? parseInt(this.$route.query.tester)
          : 0,
      },
      isFetching: false,
      labelDate: `Tìm theo ngày`,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('package', {
      shipments: (state) => state.customerShipments,
      count: (state) => state.countCustomerShipments,
    }),
  },
  methods: {
    ...mapActions('package', [FETCH_CUSTOMER_SHIPMENT]),
    async init() {
      this.handleUpdateRouteQuery()
      this.isFetching = true
      const result = await this[FETCH_CUSTOMER_SHIPMENT](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    handleSearch(e) {
      this.filter.keyword = e.target.value.trim()
    },
    handleClearSearch() {
      this.filter.keyword = ''
      this.filter.page = 1
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
  filters: {
    formatWeight(val) {
      return (val / KG_TO_GRAM).toFixed(2).replace('.00', '')
    },
  },
}
</script>
