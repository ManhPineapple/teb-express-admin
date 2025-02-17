<template>
  <div class="list__shipment pages">
    <div class="page-content">
      <div class="mb-12 row">
        <div class="warehouse col-6">
          <button
            class="btn btn-warehouse mb-8"
            v-for="(item, i) in listWarehouse"
            :key="i"
            :class="{ active: filter.hubID == item.id }"
            @click="selectWarehouse(item.id)"
            >HUB {{ item ? item.state : '' }}</button
          >
          <button
            class="btn btn-warehouse mb-8"
            :class="{ active: filter.fba > 0 }"
            @click="selectFba(1)"
            >FBA</button
          >
        </div>
        <div class="d-flex jc-sb col-6" id="search-box">
          <p-input
            placeholder="Tìm theo mã lô hoặc mã kiện"
            prefixIcon="search"
            type="search"
            clearable
            @keyup.enter="handleSearch"
            v-model="keywordSearch"
            @clear="clearSearch"
            @input="checkClearSearch"
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
                v-for="(item, key) in optionWarehouseFilter"
                :key="key"
              >
                {{ item.name }}
              </option>
            </p-select>
          </div>
          <p-button
            @click="visibleModal"
            type="info"
            v-if="!$isShipPartner() && !$isSaleOperation()"
          >
            <svgicon name="plus" class="text-white" />
            Tạo lô hàng
          </p-button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <shipment-status-tab
            :has-all="false"
            v-model="filter.status"
            :status="statusTab"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="shipments.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th width="200">Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th width="150" style="text-align: center"
                        >Tổng cân nặng</th
                      >
                      <th width="150" style="text-align: center"
                        >Số lượng kiện</th
                      >
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in shipments" :key="i">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'shipment-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.id }}
                      </router-link>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="item.close_at">{{
                      item.close_at | date('dd/MM/yyyy')
                    }}</td>
                    <td v-else>-</td>
                    <td style="text-align: center">{{
                      item.quantity > 0 ? sumWeight(item.containers) : 0
                    }}</td>
                    <td style="text-align: center">
                      {{ item.quantity }}
                    </td>
                    <td>
                      <span v-status="item.status" type="shipment"></span>
                    </td>
                    <td>
                      <p-button
                        @click="showConfirmChangeIntransit(item)"
                        :loading="isLoading[item.id]"
                        type="info"
                        :class="`mr-3`"
                        v-if="
                          showIntransitButton(item) &&
                          !$isShipPartner() &&
                          !$isSaleOperation()
                        "
                      >
                        Chuyển UPS
                      </p-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
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
      :visible.sync="visibleConfirmIntransit"
      :type="`danger`"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn muốn chuyển UPS không?`"
      :title="`Xác nhận`"
      @action="handleChangeIntransit"
    ></modal-confirm>
    <modal-choice-warehouse
      :warehouses="listWarehouse"
      @save="handleCreate"
      :visible.sync="visibleConfirm"
      :loading="loadingCreateWarehouse"
    >
    </modal-choice-warehouse>
  </div>
</template>
<script>
import {
  SHIPMENT_STATUS_TAB,
  ShipmentClosed,
  WAREHOUSE_TYPE_INTERNAL,
  WAREHOUSE_TYPE_INTERNATIONAL,
  WareHouseStatusActive,
} from '../constants'
import { mapState, mapActions } from 'vuex'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  FETCH_LIST_SHIPMENT,
  CREATE_SHIPMENT,
  INTRANSIT_SHIPMENT,
} from '../store'
import ShipmentStatusTab from '../components/ShipmentStatusTab'
import ModalChoiceWarehouse from '../components/ModalChoiceWarehouse'
import { cloneDeep } from '../../../core/utils'
import { FETCH_WAREHOUSE } from '../../shared/store'

export default {
  name: 'ListShipment',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ShipmentStatusTab,
    ModalChoiceWarehouse,
    ModalConfirm,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
        hubID: '',
        warehouse_id: null,
        fba: 0,
      },
      listWarehouse: [],
      optionWarehouseFilter: [],
      keywordSearch: '',
      shipmentAction: null,
      isLoading: [],
      isFetching: false,
      visibleConfirm: false,
      visibleConfirmIntransit: false,
      ShipmentClosed: ShipmentClosed,
      loadingCreateWarehouse: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('shipment', {
      shipments: (state) => state.shipments,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
      statusTab() {
        return SHIPMENT_STATUS_TAB
      },
      ...mapState('shared', {
        wareHouses: (state) => state.wareHouses,
      }),
    }),
  },
  methods: {
    ...mapActions('shipment', [
      FETCH_LIST_SHIPMENT,
      CREATE_SHIPMENT,
      INTRANSIT_SHIPMENT,
    ]),
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      let req = {}
      const result = await this[FETCH_WAREHOUSE](req)

      if (!result.success) {
        this.isFetching = false
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }

      this.listWarehouse = this.wareHouses.filter(
        (i) => i.type == WAREHOUSE_TYPE_INTERNATIONAL
      )
      this.optionWarehouseFilter = this.wareHouses.filter(
        (i) =>
          i.type == WAREHOUSE_TYPE_INTERNAL && i.status == WareHouseStatusActive
      )

      if (!this.filter.hubID && !this.filter.fba) {
        const wareHouseActive = this.wareHouses.find(
          ({ type }) => type == WAREHOUSE_TYPE_INTERNATIONAL
        )
        if (!wareHouseActive) {
          this.isFetching = false
          return
        }

        this.filter.hubID = wareHouseActive.id
      }

      let payload = cloneDeep(this.filter)
      payload.search = payload.search.toUpperCase()
      const result_1 = await this[FETCH_LIST_SHIPMENT](payload)
      if (!result_1.success) {
        this.isFetching = false
        this.$toast.open({ message: result_1.message, type: 'error' })
        return
      }
      this.isFetching = false
    },
    showIntransitButton(shipment) {
      return shipment.status === ShipmentClosed
    },
    showConfirmChangeIntransit(shipment) {
      this.shipmentAction = shipment
      this.visibleConfirmIntransit = true
    },
    async handleChangeIntransit() {
      this.visibleConfirmIntransit = false
      this.$set(this.isLoading, this.shipmentAction.id, true)
      const payload = {
        id: parseInt(this.shipmentAction.id),
      }
      const result = await this[INTRANSIT_SHIPMENT](payload)
      this.$set(this.isLoading, this.shipmentAction.id, false)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Chuyển UPS thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleCreate(body) {
      if (!body.is_fba && body.warehouse_id == 0) {
        this.$toast.error('Warehouse id is required')
        return
      }

      this.loadingCreateWarehouse = true
      const result = await this[CREATE_SHIPMENT](body)
      this.loadingCreateWarehouse = false

      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }

      this.$toast.open({ message: 'Tạo lô thành công', type: 'success' })
      this.visibleConfirm = false

      this.filter.fba = 0
      if (body.is_fba) {
        this.filter.fba = 1
        this.filter.hubID = 0
      }
      this.init()
    },

    selectWarehouse(id) {
      this.filter.page = 1
      this.filter.fba = 0
      if (this.filter.hubID == id) return
      this.filter.hubID = id
    },
    selectFba(val) {
      this.filter.page = 1
      this.filter.fba = val
      this.filter.hubID = 0
    },
    sumWeight(containers) {
      return containers
        .map((item) => item.weight)
        .reduce((prev, curr) => prev + curr, 0)
    },

    visibleModal() {
      this.visibleConfirm = true
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
.list__shipment {
  #search-box .input-group {
    margin-right: 8px;
  }

  .btn-info {
    white-space: nowrap;
  }
  .btn-warehouse {
    background: #ffffff;
    margin-right: 8px;
    color: #626363;
    font-weight: 600;

    border: 1px solid #edeeee;
    &:hover,
    &.active {
      border: 1px solid #00b4c3;
      color: #00b4c3;
    }
    &:focus {
      box-shadow: unset;
    }
  }
}
</style>
