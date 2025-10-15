<template>
  <div class="list-packages pages page__container">
    <div class="page-content">
      <div class="mb-12">
        <div class="d-flex jc-sb row" id="search-box">
          <div
            class="page__container-warehouses col-5"
            style="padding-right: 0px"
          >
            <button
              v-for="(warehouse, i) in listWarehouse"
              :key="i"
              :class="{ active: warehouse.id == filter.warehouse }"
              @click="handleFilter(warehouse.id)"
              class="choose-warehouse btn btn-default mr-8 mb-8"
            >
              HUB {{ warehouse ? warehouse.state : '' }}
            </button>
            <button
              :class="{ active: filter.fba_type == 1 }"
              @click="handleFilterFba()"
              class="choose-warehouse btn btn-default mr-8 mb-8"
            >
              FBA
            </button>
            <button
              :class="{ active: filter.fba_type == 2 }"
              @click="handleFilterFFba()"
              class="choose-warehouse btn btn-default mr-8 mb-8"
            >
              Fast FBA
            </button>
          </div>
          <div class="page__container-search d-flex jc-sb col-7">
            <p-input
              placeholder="Tìm theo mã kiện, nhãn kiện hoặc AnanBay tracking"
              prefixIcon="search"
              type="search"
              class="mr-8"
              clearable
              v-model="keywordSearch"
              @input="checkClearSearch"
              @keyup.enter="handleSearch"
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
                  v-for="(item, key) in optionWarehouseFilter"
                  :key="key"
                >
                  {{ item.name }}
                </option>
              </p-select>
            </div>
            <p-button
              type="info"
              @click="addEventHandle"
              class="mr-8"
              v-if="$isAdmin() || $isShipPartner()"
            >
              Thêm hành trình
            </p-button>
            <p-button
              type="info"
              @click="CreateContainerHandle"
              v-if="!$isShipPartner() && !$isSaleOperation()"
            >
              <svgicon name="plus" class="text-white add_container" />
              Tạo kiện hàng
            </p-button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <container-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="coverCountStatus"
          />
          <div class="p-tabs nav-tabs-horizontal mt-16 type-badge">
            <ul role="tablist" class="nav nav-tabs nav-tabs-line">
              <li
                role="presentation"
                class="nav-item"
                :class="{ active: k == filter.type }"
                v-for="(text, k) in containerTypes"
                :key="k"
              >
                <a
                  href="javascript:void(0)"
                  class="nav-link"
                  @click.prevent="changeType(k)"
                  >{{ text }}</a
                >
              </li>
              <li class="right-item">
                <p-checkbox
                  v-model="filter.is_warning"
                  style="left: unset !important; right: 11px"
                  >Hiển thị Kiện hàng bất thường</p-checkbox
                >
              </li>
            </ul>
          </div>
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="containers.length">
            <div class="table-responsive" style="overflow: revert">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã kiện</th>
                      <th>Nhãn kiện</th>
                      <th>Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th width="90">Kích thước</th>
                      <th class="text-center">Số lượng đơn</th>
                      <th class="text-center">Tổng cân nặng</th>
                      <th class="text-center">Cân nặng thực tế</th>
                      <th class="text-center" v-if="$isAdmin()"
                        >Tổng cân nặng gói hàng</th
                      >
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th width="100"></th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in displayContainers" :key="i">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'container-detail',
                          params: {
                            code: item.code ? item.code : '',
                          },
                        }"
                      >
                        {{ item.code ? item.code : '' }}
                      </router-link>
                      <span
                        class="page-header__barcode"
                        @click="printBarcode(item.barcode)"
                      >
                        <p-svg name="barcode"></p-svg>
                      </span>
                    </td>
                    <td>
                      <a
                        class="text-no-underline on-hover"
                        v-if="item.tracking_number"
                        href="javascript:void(0)"
                        @click="downloadLabel(item.label_url)"
                        >{{ item.tracking_number }}</a
                      >
                    </td>
                    <td>
                      <router-link
                        v-if="item.shipment_id"
                        :to="{
                          name: 'shipment-detail',
                          params: {
                            id: item.shipment_id,
                          },
                        }"
                      >
                        {{ item.shipment_id }}
                      </router-link>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="item.close_at">{{
                      item.close_at | date('dd/MM/yyyy')
                    }}</td>
                    <td v-else></td>
                    <td
                      >{{ item.length }} x {{ item.width }} x
                      {{ item.height }}</td
                    >
                    <td class="text-center">{{ item.count_item }}</td>
                    <td
                      class="text-center"
                      :class="{ warning: showNotifyWeight(item) }"
                      >{{ item.weight }}</td
                    >
                    <td
                      class="text-center"
                      :class="{ warning: showNotifyWeight(item) }"
                      >{{ item.actual_weight ? item.actual_weight : '' }}</td
                    >
                    <td class="text-center" v-if="$isAdmin()">{{
                      item.package_weight | formatKg
                    }}</td>
                    <td>{{ item.type_text }}</td>
                    <td>
                      <span v-status="item.status" type="container"></span>
                    </td>
                    <td class="text-right">
                      <p-tooltip
                        class="w-tooltip-warning"
                        :label="`Kiện hàng bất thường, cân nặng không khớp`"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                        v-if="showNotifyWeight(item)"
                      >
                        <p-svg name="warning_container" class="mr-8"></p-svg>
                      </p-tooltip>
                      <p-tooltip
                        :label="`Xem lịch sử`"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                      >
                        <a href="#" @click="showHistoryContainer(item)">
                          <p-svg
                            name="clock"
                            :class="{ 'mr-8': showBtnUpdate(item) }"
                          ></p-svg>
                        </a>
                      </p-tooltip>
                      <p-tooltip
                        :label="`Sửa tracking`"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                        v-if="!$isSaleOperation()"
                      >
                        <a
                          href="#"
                          @click="handleShowUpdateModal(item)"
                          v-if="showBtnUpdate(item)"
                        >
                          <p-svg name="update"></p-svg>
                        </a>
                      </p-tooltip>
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
              >
              </p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-choice-shipping-box
      :warehouses="listWarehouse"
      @save="createContainerSubmit"
      :visible.sync="visibleModalChoiceBox"
      :loading="loadingCreateContainer"
      :isCreate="true"
      :actionConfirm="'Tạo'"
      :cancel="'Bỏ qua'"
      :title="'Tạo kiện hàng'"
    >
    </modal-choice-shipping-box>
    <modal-history-container
      :visible.sync="visibleModalHistory"
      :id="historyContainerID"
    >
    </modal-history-container>
    <modal-update-container
      :loading="isSubmitting"
      @update="handleUpdateContainer"
      :tracking="container.tracking_number"
      :visible.sync="visibleUpdateModal"
    >
    </modal-update-container>
    <ModalAddEvent :visible.sync="isVisibleModalAddEvent" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import ContainerStatusTab from '../components/ContainerStatusTab'
import ModalChoiceShippingBox from '../components/ModalChoiceShippingBox'
import ModalUpdateContainer from '../components/ModalUpdateContainer'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

import Browser from '@core/helpers/browser'
import { printImage } from '@core/utils/print'
import { cloneDeep } from '../../../core/utils'
import { FETCH_WAREHOUSE } from '../../shared/store'
import {
  WAREHOUSE_TYPE_INTERNAL,
  WAREHOUSE_TYPE_INTERNATIONAL,
  WareHouseStatusActive,
} from '../../shipment/constants'
import api from '../api'
import ModalAddEvent from '../components/ModalAddEvent.vue'
import ModalHistoryContainer from '../components/ModalHistoryContainer'
import {
  CONTAINER_CLOSE,
  CONTAINER_DELIVERIED,
  CONTAINER_EXPORT_HUB,
  CONTAINER_IMPORT_HUB,
  CONTAINER_STATUS_TAB,
  CONTAINER_TYPE_FEDEX,
  CONTAINER_TYPE_MANUAL,
  MAP_CONTAINER_TEXT_TYPES,
  MAP_NAME_STATUS_CONTAINER,
} from '../contants'
import {
  CREATE_CONTAINER,
  FETCH_LIST_CONTAINERS,
  GET_HISTORY_CONTAINER,
  GET_LABEL,
  UPDATE_CONTAINER,
} from '../store'

export default {
  name: 'ListContainers',
  mixins: [mixinRoute, mixinTable],
  components: {
    ModalHistoryContainer,
    EmptySearchResult,
    ContainerStatusTab,
    ModalChoiceShippingBox,
    ModalUpdateContainer,
    ModalAddEvent,
  },
  computed: {
    ...mapState('container', {
      containers: (state) => state.containers,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
      statusTab() {
        return CONTAINER_STATUS_TAB
      },
      ...mapState('shared', {
        wareHouses: (state) => state.wareHouses,
      }),
      mapStatus() {
        let status = cloneDeep(MAP_NAME_STATUS_CONTAINER)
        Object.keys(status).map((x) => {
          if (x == CONTAINER_EXPORT_HUB || x == CONTAINER_IMPORT_HUB) {
            status[x].value = 'Đã giao'
            status[x].class = 'badge-info'
          }
        })
        return status
      },
      coverCountStatus() {
        if (!this.count_status) return
        const reduce = this.count_status
          .filter(
            (obj) =>
              obj.status == CONTAINER_IMPORT_HUB ||
              obj.status == CONTAINER_EXPORT_HUB ||
              obj.status == CONTAINER_DELIVERIED
          )
          .map((item) => item.count)
          .reduce((t, n) => t + n, 0)
        const temp = this.count_status.map((obj) =>
          obj.status == CONTAINER_DELIVERIED ||
          obj.status == CONTAINER_IMPORT_HUB ||
          obj.status == CONTAINER_EXPORT_HUB
            ? { status: CONTAINER_DELIVERIED, count: reduce }
            : obj
        )
        return temp
      },

      displayContainers() {
        return (this.containers || []).map((item) => {
          item.type_text = MAP_CONTAINER_TEXT_TYPES[item.type]
          return item
        })
      },
    }),
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
        status: '',
        search: '',
        warehouse: '',
        type: CONTAINER_TYPE_FEDEX,
        is_warning: false,
        fba_type: 0,
        warehouse_id: null,
      },
      listWarehouse: [],
      optionWarehouseFilter: [],
      keywordSearch: '',
      isSubmitting: false,
      isFetching: false,
      visibleUpdateModal: false,
      container: {},
      visibleModalChoiceBox: false,
      loadingCreateContainer: false,
      visibleModalHistory: false,
      containerHistories: [],
      containerTypes: MAP_CONTAINER_TEXT_TYPES,
      historyContainerID: null,
      isVisibleModalAddEvent: false,
      warehoseLoaded: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  methods: {
    ...mapActions('container', [
      FETCH_LIST_CONTAINERS,
      CREATE_CONTAINER,
      GET_LABEL,
      UPDATE_CONTAINER,
      GET_HISTORY_CONTAINER,
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
      if (!this.filter.warehouse && this.filter.fba_type == 0) {
        const wareHouseActive = this.wareHouses.find(
          ({ type }) => type == WAREHOUSE_TYPE_INTERNATIONAL
        )
        if (!wareHouseActive) {
          this.isFetching = false
          return
        }

        this.filter.warehouse = wareHouseActive.id
      }

      let payload = cloneDeep(this.filter)
      payload.search = payload.search.toUpperCase()

      const result_1 = await this[FETCH_LIST_CONTAINERS](payload)
      if (!result_1.success) {
        this.isFetching = false
        this.$toast.open({ message: result_1.message, type: 'error' })
        return
      }
      this.isFetching = false
    },
    showNotifyWeight(item) {
      if (!this.$isAdmin()) {
        return false
      }
      return (
        item.actual_weight && item.weight && item.actual_weight !== item.weight
      )
    },
    showBtnUpdate(container) {
      return (
        container.type === CONTAINER_TYPE_MANUAL &&
        [CONTAINER_CLOSE].includes(container.status)
      )
    },
    handleShowUpdateModal(container) {
      this.visibleUpdateModal = true
      this.container = container
    },
    async handleUpdateContainer(tracking) {
      const regex = /^[a-z0-9]+$/i
      if (tracking.trim() != '' && !regex.test(tracking.trim())) {
        this.$toast.open({
          message: 'Tracking chỉ chứa chữ số và chữ cái',
          type: 'error',
        })
        return
      }

      this.isSubmitting = true
      const payload = {
        id: parseInt(this.container.id),
        tracking_number: tracking.trim().toUpperCase(),
      }
      const result = await this[UPDATE_CONTAINER](payload)

      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.isSubmitting = false
      this.visibleUpdateModal = false
      this.$toast.open({
        message: `Cập nhật kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    isCloseContainer(container) {
      return container.status === CONTAINER_CLOSE
    },
    CreateContainerHandle() {
      this.visibleModalChoiceBox = true
    },
    showHistoryContainer(container) {
      this.historyContainerID = container.id
      this.visibleModalHistory = true
    },
    async downloadLabel(labelUrl) {
      if (labelUrl == '') {
        this.$toast.open({
          type: 'error',
          message: "This tracking doesn't have label",
          duration: 3000,
        })
        return
      }
      let result = ''

      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this[GET_LABEL](payload)

      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
    async printBarcode(barcode) {
      document.activeElement && document.activeElement.blur()

      const res = await api.downloadLabel({
        url: barcode,
        type: 'labels',
      })
      if (!res && res.error) {
        this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
        return
      }

      try {
        let blob = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(blob)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    async createContainerSubmit(body) {
      if (body.warehouse_id == 0 && body.fba_type == 0) {
        this.$toast.error('Chưa chọn kho')
        return
      }

      if (body.type == 0) {
        this.$toast.error('Chưa chọn kiểu kiện')
        return
      }

      this.loadingCreateContainer = true
      const result = await this[CREATE_CONTAINER](body)
      this.loadingCreateContainer = false
      this.visibleModalChoiceBox = false

      if (!result.success) {
        this.$toast.error(result.message)
        return
      }

      this.$toast.success('Tạo kiện hàng thành công')

      this.filter.page = 1
      this.filter.type = body.type
      this.filter.warehouse = body.warehouse_id
      this.filter.fba_type = body.fba_type

      this.init()
    },
    handleFilter(id) {
      this.filter.page = 1
      this.filter.warehouse = id
      this.filter.fba_type = 0
    },
    handleFilterFba() {
      this.filter.page = 1
      this.filter.fba_type = 1
      this.filter.warehouse = 0
    },
    handleFilterFFba() {
      this.filter.page = 1
      this.filter.fba_type = 2
      this.filter.warehouse = 0
    },
    changeType(v) {
      this.filter.page = 1
      this.filter.type = v
    },
    addEventHandle() {
      this.isVisibleModalAddEvent = true
    },
  },
  watch: {
    filter: {
      handler: function () {
        if (!this.isFetching) {
          this.init()
        }
      },
      deep: true,
    },
  },
}
</script>
<style>
.w-tooltip-warning::after {
  transform: translateX(-89%) !important;
}
.warning {
  color: #fa8c16 !important;
}
</style>
