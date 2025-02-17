<template>
  <div class="customer-statistic">
    <div class="card-block">
      <div class="card-header">
        <div class="card-title">Thống kê</div>
        <p-datepicker
          :format="'dd/mm/yyyy'"
          @update="selectDateHandle"
          label="Lọc theo thời gian"
          id="date-search"
          :value="{
            startDate: filters.start_date,
            endDate: filters.end_date,
          }"
          @clear="clearSearchDate"
          :ranges="true"
        ></p-datepicker>
      </div>
      <div class="card-content">
        <LineChart
          :chart-data="chartData"
          :options="options"
          :width="1200"
          :height="400"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { date } from '@core/utils/datetime'
import LineChart from '../components/LineChart.vue'
import api from '../api'

export default {
  name: 'CustomerStatistic',
  props: {
    user_id: {
      type: [String, Number],
      required: true,
    },
  },
  components: { LineChart },
  computed: {
    chartData() {
      const { statistic_revenue, statistic_package, statistic_ticket } = this

      const labels1 = statistic_revenue.map(({ date_time }) => date_time)
      const labels2 = statistic_package.map(({ date_time }) => date_time)
      const labels3 = statistic_ticket.map(({ date_time }) => date_time)

      let labels = [...labels1, ...labels2, ...labels3]
      labels = [...new Set(labels)]
      labels.sort()

      const revenueData = []
      const packageData = []
      const ticketData = []
      for (let i = 0; i < labels.length; i++) {
        const item1 = statistic_revenue.find(
          ({ date_time }) => date_time === labels[i]
        )
        revenueData.push(item1 ? item1.revenue : 0)

        const item2 = statistic_package.find(
          ({ date_time }) => date_time === labels[i]
        )
        packageData.push(item2 ? item2.number : 0)

        const item3 = statistic_ticket.find(
          ({ date_time }) => date_time === labels[i]
        )
        ticketData.push(item3 ? item3.number : 0)
      }

      return {
        labels: labels,
        datasets: [
          {
            pointRadius: 0,
            fill: false,
            label: 'Doanh thu',
            backgroundColor: '#13C2C2',
            borderColor: '#13C2C268',
            borderWidth: 2,
            yAxisID: 'right',
            data: revenueData,
          },
          {
            pointRadius: 0,
            fill: false,
            label: 'Đơn hàng',
            backgroundColor: '#48BE78',
            borderColor: '#48BE7868',
            borderWidth: 2,
            yAxisID: 'left',
            data: packageData,
          },
          {
            pointRadius: 0,
            fill: false,
            label: 'Khiếu nại',
            backgroundColor: '#FABC16',
            borderColor: '#FABC1668',
            borderWidth: 2,
            yAxisID: 'left',
            data: ticketData,
          },
        ],
      }
    },
  },
  data() {
    return {
      statistic_revenue: [],
      statistic_package: [],
      statistic_ticket: [],
      filters: {
        customer_id: 0,
        start_date: date(
          new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
          'yyyy-MM-dd'
        ),
        end_date: date(new Date(), 'yyyy-MM-dd'),
      },
      isFetching: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      options: {
        scales: {
          yAxes: [
            {
              id: 'left',
              type: 'linear',
              position: 'left',
              ticks: {
                precision: 0,
                maxTicksLimit: 15,
              },
            },
            {
              id: 'right',
              type: 'linear',
              position: 'right',
              ticks: {
                maxTicksLimit: 15,
                callback: function (value) {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 20,
              },
            },
          ],
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label: function (context, chart) {
              let label = chart.datasets[context.datasetIndex].label || ''
              label += label ? ': ' : ''

              if (chart.datasets[context.datasetIndex].yAxisID == 'left') {
                label += context.yLabel
              } else {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(context.yLabel)
              }

              return label
            },
          },
        },
      },
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.statistic_revenue = []
      this.statistic_package = []
      this.statistic_ticket = []
      let days = this.dateDiffInDays(
        this.filters.start_date,
        this.filters.end_date
      )
      if (days > 365) {
        this.$toast.error('Thời gian lọc không quá 1 năm !')
        return
      }
      const filters = { ...this.filters, customer_id: this.user_id }

      this.isFetching = true
      const res = await api.fetchCustomerStatistic(filters)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.errorMessage || 'Có lỗi xảy ra')
        return
      }

      this.statistic_revenue = res.statistic_revenue
      this.statistic_package = res.statistic_package
      this.statistic_ticket = res.statistic_ticket
    },
    dateDiffInDays(d1, d2) {
      const a = new Date(d1)
      const b = new Date(d2)
      const _MS_PER_DAY = 1000 * 60 * 60 * 24
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
      return Math.floor((utc2 - utc1) / _MS_PER_DAY)
    },
    clearSearchDate() {
      this.filters.end_date = ''
      this.filters.start_date = ''
    },
    selectDateHandle(v) {
      this.filters.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filters.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
  },
  watch: {
    filters: {
      handler: function () {
        this.fetchData()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.customer-statistic {
  .vue-daterange-picker {
    .reportrange-text {
      border: 0;
    }

    .label-date-picker {
      vertical-align: middle;
    }
  }
}
</style>
