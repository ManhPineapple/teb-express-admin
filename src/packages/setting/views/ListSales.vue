<template>
  <div class="pages list__sales">
    <div class="page-header mb-16">
      <div class="row">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="group-kpi col-6">
                  <div class="group-kpi-title">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="4" cy="4" r="4" fill="#48BE78" />
                    </svg>
                    KPI doanh thu
                  </div>
                  <div
                    class="group-kpi-content"
                    style="border-right: 1px solid #e0e0e0"
                    v-if="kpi"
                  >
                    <h4>{{ kpi.revenue_month | formatPrice }}</h4>
                    <span>/ Tháng</span>
                  </div>
                  <div v-else> N/A </div>
                </div>
                <div class="group-kpi col-6">
                  <div class="group-kpi-title">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E0E0E0" />
                    </svg>
                    KPI Khách hàng
                    <p-button
                      class="pull-right btn-info"
                      id="btn-set-kpi"
                      @click="showModalKpi"
                    >
                      Set KPI
                    </p-button>
                  </div>
                  <div class="group-kpi-content" v-if="kpi">
                    <h4>{{ kpi.new_user_month }}</h4>
                    <span
                      >Khách hàng mới ({{
                        kpi.revenue_per_user | formatPrice
                      }}
                      mỗi khách)</span
                    >
                  </div>
                  <div v-else> N/A </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card" style="height: 100%">
            <div class="card-body">
              <div class="row">
                <div class="col-8">
                  <div class="d-flex" id="date_filter_pip">
                    <el-date-picker
                      type="month"
                      format="MM/yyyy"
                      v-model="month_filter"
                      placeholder="Chọn tháng lọc"
                      @change="loadChartPipMail()"
                    >
                    </el-date-picker>
                  </div>
                  <ul class="list-pip" v-if="graphData.length">
                    <li
                      v-for="(item, i) in graphData"
                      :key="i"
                      style="margin-bottom: 6px"
                    >
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="margin-right: 4px; margin-top: -2px"
                      >
                        <path
                          d="M7 0C7 0 10.5444 2.76236 11.9498 5.17159C13.3551 7.5808 14 12 14 12H0L7 0Z"
                          :fill="item.fill"
                        />
                      </svg>
                      <strong>{{ item.count }} Sales</strong> {{ item.label }}
                    </li>
                  </ul>
                </div>
                <div class="col-4">
                  <div id="chart" v-if="graphData.length">
                    <apexchart
                      type="pie"
                      height="135"
                      :options="chartOptions"
                      :series="series"
                    ></apexchart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="search-input d-flex">
            <p-input
              placeholder="Tìm kiếm theo tên hoặc email"
              prefixIcon="search"
              class="mb-2 mr-8"
              type="search"
              :value="filter.search"
              @keyup.enter="handleSearch"
              :clearable="true"
              @clear="clearSearch"
            >
            </p-input>
            <div class="mr-8" style="min-width: 200px">
              <p-select
                style="width: 100%"
                :placeholder="`Tìm theo kho`"
                v-model="filter.warehouse_id"
              >
                <option value="">Tất cả</option>
                <option
                  :value="item.id"
                  v-for="(item, key) in wareHouses"
                  :key="key"
                >
                  {{ item.name }}
                </option>
              </p-select>
            </div>
          </div>
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="sales.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>TÊN</th>
                    <th>EMAIL</th>
                    <th>KHO</th>
                    <th>SỐ KHÁCH HÀNG</th>
                    <th>SỐ TICKET</th>
                    <th>DOANH THU</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in sales" :key="item.id">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'saler-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.full_name }}
                      </router-link>
                    </td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.warehouse ? item.warehouse : 'N/A' }}</td>
                    <td>{{ item.count_customer | formatNumberV2 }}</td>
                    <td>{{ item.count_ticket | formatNumberV2 }}</td>
                    <td>{{ item.revenue | formatPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <EmptySearchResult v-else></EmptySearchResult>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-80 paginate"
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
    <modal-set-kpi
      :visible.sync="isShowModalKpi"
      :kpi="kpi"
      @save="handleSaveSettingKpi"
    ></modal-set-kpi>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import { FETCH_WAREHOUSE } from '../../shared/store'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import {
  FETCH_LIST_SALES,
  FETCH_COUNT_SALES,
  SAVE_SETTING_KPI,
  FETCH_SETING_KPI,
} from '../store'
import PButton from '../../../../uikit/components/button/Button'
import ModalSetKpi from '../components/ModalSetKpi'
import {
  PipEmailTypeNotPass,
  PipEmailTypePass,
  PipEmailTurnFirst,
  PipEmailTurnLast,
} from '../constants'
export default {
  name: 'ListSales',
  mixins: [mixinRoute, mixinTable],
  components: {
    PButton,
    EmptySearchResult,
    ModalSetKpi,
  },
  computed: {
    ...mapState('shared', {
      wareHouses: (state) => state.wareHouses,
    }),
    ...mapState('setting', {
      sales: (state) => state.sales,
      count: (state) => state.count_sales,
    }),
  },
  data() {
    return {
      filter: {
        search: '',
        warehouse_id: null,
        limit: 25,
      },
      month_filter: '',
      series: [44, 55, 13, 43, 22],
      chartOptions: {
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 1500,
            options: {
              chart: {
                height: '82',
              },
            },
          },
        ],
      },
      isLoadingChart: false,
      warehoseLoaded: false,
      isFetching: false,
      isShowModalKpi: false,
      kpi: null,
      graphData: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    ...mapActions('setting', {
      fetchList: FETCH_LIST_SALES,
      fetchCount: FETCH_COUNT_SALES,
      saveKpi: SAVE_SETTING_KPI,
      fetchSettingKpi: FETCH_SETING_KPI,
    }),
    async init() {
      this.handleUpdateRouteQuery()
      this.isFetching = true

      const filter = { ...this.filter }

      this.fetchCount(filter)
      const res = await this.fetchList(filter)
      const r2 = await this.fetchSettingKpi()
      this.isFetching = false

      if (res.error || r2.error) {
        this.$toast.error(res.message || r2.message)
        return
      }
      this.kpi = r2.kpi
      if (r2.data_graph) {
        this.series = r2.data_graph.map((i) => i.count)
        const dataPip = r2.data_graph.map((i) => {
          switch (true) {
            case i.type === PipEmailTypeNotPass && i.turn === PipEmailTurnFirst:
              return {
                count: i.count,
                label: 'pip mail lần 1',
                fill: '#FA8C16',
              }
            case i.type === PipEmailTypePass && i.turn === PipEmailTurnLast:
              return {
                count: i.count,
                label: 'Đạt KPI',
                fill: '#00B7B0',
              }
            case i.type === PipEmailTypeNotPass && i.turn === PipEmailTurnLast:
              return {
                count: i.count,
                label: 'pip mail lần 2',
                fill: '#F5222D',
              }
          }
        })
        this.graphData = dataPip
        this.chartOptions = {
          labels: dataPip.map((i) => i.label),
          legend: {
            show: false,
          },
        }
      }

      if (!this.warehoseLoaded) {
        let req = { status: 1, type: 2 }
        const r2 = await this[FETCH_WAREHOUSE](req)
        if (!r2.success) {
          this.$toast.open({ message: r2.message, type: 'error' })
          return
        }
        this.warehoseLoaded = true
      }
    },
    showModalKpi() {
      this.isShowModalKpi = true
    },
    async loadChartPipMail() {
      if (!this.month_filter) {
        return
      }
      const payload = {
        month: this.month_filter.toLocaleDateString('en-GB'),
      }
      this.isLoadingChart = true
      let r = await this.fetchSettingKpi(payload)
      this.isLoadingChart = false
      if (!r.data_graph) {
        this.graphData = []
        return
      }

      this.series = r.data_graph.map((i) => i.count)
      const dataPip = r.data_graph.map((i) => {
        switch (true) {
          case i.type === PipEmailTypeNotPass && i.turn === PipEmailTurnFirst:
            return {
              count: i.count,
              label: 'pip mail lần 1',
              fill: '#FA8C16',
            }
          case i.type === PipEmailTypePass && i.turn === PipEmailTurnLast:
            return {
              count: i.count,
              label: 'Đạt KPI',
              fill: '#00B7B0',
            }
          case i.type === PipEmailTypeNotPass && i.turn === PipEmailTurnLast:
            return {
              count: i.count,
              label: 'pip mail lần 2',
              fill: '#F5222D',
            }
        }
      })

      this.graphData = dataPip

      this.chartOptions = {
        labels: dataPip.map((i) => i.label),
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 1500,
            options: {
              chart: {
                height: '120%',
              },
            },
          },
        ],
      }
    },
    async handleSaveSettingKpi(payload) {
      this.isSubmitting = true
      let result = await this.saveKpi(payload)
      this.isSubmitting = false
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Lưu cài đặt KPI thành công !',
      })
      this.isShowModalKpi = false
      this.init()
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
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
