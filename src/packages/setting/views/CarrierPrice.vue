<template>
  <div class="pages setting page-sm">
    <div class="page-content">
      <div class="card">
        <div class="card-body p-24">
          <VclTable v-if="isFetching"></VclTable>
          <div class="table-responsive" v-else>
            <table class="table table-hover table-services">
              <thead>
                <tr>
                  <th>CÂN NẶNG (OZ)</th>
                  <th v-for="zone in zones" :key="zone">{{ zone }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in sizes" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td v-for="(zone, i) in item.zones" :key="i">{{
                    zone.carrier_code
                  }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p class="text-right mt-24"
        >Ngày cập nhật: {{ updatedAt | datetime('dd/MM/yyyy HH:mm:ss') }}</p
      >
      <div class="card">
        <div class="card-body p-0">
          <VclTable v-if="isFetching"></VclTable>
          <template v-else-if="logs.length">
            <div class="table-responsive">
              <table class="table table-hover table-log">
                <tr>
                  <th></th>
                  <th v-for="zone in zones" :key="zone" colspan="3">{{
                    zone
                  }}</th>
                </tr>
                <tr>
                  <th>CÂN NẶNG (OZ)</th>
                  <th v-for="(name, i) in headers" :key="i">{{ name }}</th>
                </tr>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td
                    v-for="(price, i) in item.prices"
                    :key="i"
                    :class="price.class"
                  >
                    <span :title="`Mốc: ${item.name}`" v-if="price.price > 0">{{
                      price.price | formatPrice
                    }}</span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
    <ModalEdit
      :visible.sync="isVisibleModalEdit"
      :carriers="carriers"
      :current="current"
      @success="onEditSuccess"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  FETCH_LIST_CHECK_PRICE_LOGS,
  FETCH_CARRIER_SERVICE,
  UPDATE_CARRIER_SERVICE,
} from '../store'
import {
  CARRIER_CODE_IBBLUE,
  CARRIER_CODE_SHIPPO,
  CARRIER_CODE_SHIPSAVING,
} from '../constants'
import ModalEdit from '../components/ModalCarrierPrice'

export default {
  name: 'CarrierPrice',
  components: { ModalEdit },
  computed: {
    ...mapState('setting', {
      logs: (state) => state.check_price_logs || [],
      carrier_service: (state) => state.carrier_service || {},
    }),
    carriers() {
      const carriers = (this.carrier_service.carriers || []).map(
        ({ id, name, code }) => ({ id, name, code })
      )
      carriers.sort((a, b) => a.id > b.id)
      return carriers
    },
    sizes() {
      return this.carrier_service.sizes || []
    },
    zones() {
      if (!this.logs || !this.logs.length) return []
      const items = ((this.logs[0] || {}).data[0] || {}).data
      const zones = items.map(({ zone }) => zone)
      return [...new Set(zones)]
    },
    headers() {
      const headers = []
      for (let i = 0; i < this.zones.length; i++) {
        headers.push('IB BLUE', 'SHIPPO', 'SHIP SAVING')
      }

      return headers
    },
    items() {
      let items = []

      let ibblueID = 0
      let shippoID = 0
      let shipsavingID = 0
      for (const { id, code } of this.carriers) {
        if (code === CARRIER_CODE_IBBLUE) {
          ibblueID = id
        }
        if (code === CARRIER_CODE_SHIPPO) {
          shippoID = id
        }
        if (code === CARRIER_CODE_SHIPSAVING) {
          shipsavingID = id
        }
      }

      for (const log of this.logs) {
        if (typeof log.data === 'string') {
          try {
            log.data = JSON.parse(log.data)
          } catch (error) {
            log.data = []
          }
        }

        for (const line of log.data) {
          const item = {
            name: '',
            point: line.point,
            created_at: log.created_at,
            prices: [],
          }

          const zones = []
          let zone = {}
          let zoneName = ''
          for (const lineItem of line.data) {
            if (zoneName != lineItem.zone && zoneName != '') {
              zones.push(zone)
              zone = {}
            }

            zoneName = lineItem.zone
            if (lineItem.carrier_id == shippoID) {
              zone.shippo = lineItem
            }
            if (lineItem.carrier_id == ibblueID) {
              zone.ibblue = lineItem
            }
            if (lineItem.carrier_id == shipsavingID) {
              zone.shipsaving = lineItem
            }
          }

          if (zoneName != '') {
            zones.push(zone)
          }

          for (const izone of zones) {
            const ibblue = izone.ibblue
              ? { class: '', price: izone.ibblue.price }
              : { class: '', price: 0 }
            const shippo = izone.shippo
              ? { class: '', price: izone.shippo.price }
              : { class: '', price: 0 }
            const shipsaving = izone.shipsaving
              ? { class: '', price: izone.shipsaving.price }
              : { class: '', price: 0 }
            if (ibblue.price > 0 || shippo.price > 0 || shipsaving.price > 0) {
              if (
                ibblue.price > 0 &&
                ibblue.price < shippo.price &&
                ibblue.price < shipsaving.price
              ) {
                ibblue.class = 'selected'
              } else if (shippo.price > 0 && shippo.price < shipsaving.price) {
                shippo.class = 'selected'
              } else {
                shipsaving.class = 'selected'
              }
            }

            item.prices.push(ibblue, shippo, shipsaving)
          }

          items.push(item)
        }
      }

      items = items.sort((a, b) => a.point - b.point)
      const n = items.length

      if (n < 3) {
        return items
      }

      items[0].name = `<${items[1].point}`
      items[n - 1].name = `>${items[n - 1].point}`

      for (let i = 1; i < n - 1; i++) {
        items[i].name = `${items[i].point}-${items[i + 1].point}`
      }

      return items
    },
    updatedAt() {
      if (!this.items.length) return new Date()
      return this.items[0].created_at
    },
  },
  data() {
    return {
      isFetching: false,
      current: null,
      isVisibleModalEdit: false,
      filter: {
        page: 1,
        limit: 1,
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('setting', {
      updateCarrierService: UPDATE_CARRIER_SERVICE,
      fetchCarrierService: FETCH_CARRIER_SERVICE,
      fetchListLogs: FETCH_LIST_CHECK_PRICE_LOGS,
    }),

    async init() {
      this.isFetching = true

      const arrResponse = await Promise.all([
        this.fetchCarrierService(),
        this.fetchListLogs({ limit: 1, page: 1 }),
      ])

      for (const res of arrResponse) {
        if (res.error) {
          this.$toast.error(res.message)
        }
      }

      this.isFetching = false
    },
    editHandle(item) {
      this.current = item
      this.isVisibleModalEdit = true
    },
    async onEditSuccess() {
      this.isFetching = true
      const res = await this.fetchCarrierService()

      if (res.error) {
        this.$toast.error(res.message)
      }

      this.isFetching = false
    },
  },
}
</script>
<style lang="scss">
.table-services {
  margin: 0 auto;

  tr {
    th,
    td {
      white-space: nowrap;
      border-top: 0;
      text-align: center;
    }
  }

  tbody {
    tr {
      td {
        border: 1px solid #007672;
        border: 0;
        border-top: 1px solid #007672;
        border-left: 1px solid #007672;
        background-color: #fff;
        padding: 16px 12px;
        font-weight: bold;

        &:last-child {
          border-right: 0;
          border-radius: 0;
        }

        &:first-child {
          border-radius: 0;
          color: #aaabab;
          font-weight: 500;
        }

        span {
          vertical-align: text-top;
        }
      }

      &:first-child td {
        border-top: 1px solid #007672;
      }

      &:last-child td {
        border-bottom: 0;
      }

      &:nth-child(2n + 1) td {
        background-color: #e8fffe;
      }
    }
  }

  thead th {
    background-color: #fff;
    padding: 12px;
    border-left: 1px solid #007672;
    font-weight: 600;
    height: 48px;

    &:first-child {
      border-left: 0;
    }
  }
}

.table-log {
  margin-bottom: 0;

  tr {
    th,
    td {
      padding: 12px;
      border: 0;
      white-space: nowrap;

      &:first-child {
        border-radius: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }

    td {
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;

      &:first-child {
        border-top: 1px solid #e0e0e0;
      }

      &.selected {
        font-weight: bold;
        color: #007672;
      }
    }

    th {
      background: #fff;
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;

      &:first-child {
        border-top: 1px solid #e0e0e0;
      }

      &:last-child {
        border-right: 0;
      }
    }
  }
}
</style>
