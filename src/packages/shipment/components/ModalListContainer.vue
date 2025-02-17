<template>
  <p-modal :active="visible" :title="`Thêm kiện hàng`" @close="handleClose">
    <div class="mb-12">
      <div class="d-flex jc-sb" id="search-box">
        <p-input
          placeholder="Tìm theo mã kiện hoặc mã vận đơn"
          prefixIcon="search"
          type="search"
          :value="filter.search"
          @keyup.enter="handleSearch"
        >
        </p-input>
      </div>
    </div>
    <VclTable class="mt-20" v-if="isFetching"></VclTable>
    <template v-else-if="containers.length">
      <div class="table-responsive">
        <table class="table table-hover" id="tbl-packages">
          <thead>
            <tr>
              <th width="40">
                <p-checkbox
                  class="order-select-checkbox"
                  :class="{ checkAll: totalSelected > 0 }"
                  :style="totalSelected > 0 && { width: 0 }"
                  :value="isAllChecked"
                  @change.native="toggleSelectAll"
                  :indeterminate="isIndeterminate"
                ></p-checkbox>
              </th>
              <template>
                <th>Mã kiện</th>
                <th>Số lượng đơn</th>
                <th>Kích thước</th>
                <th>Ngày tạo</th>
                <th>Ngày đóng</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in containers" :key="i">
              <td width="40">
                <p-checkbox
                  v-model="action.selected"
                  :native-value="item"
                  @input="handleValue($event)"
                ></p-checkbox>
              </td>
              <td> {{ item.code }} </td>
              <td>
                {{ item.count_item }}
              </td>
              <td
                >{{ item.length }} x {{ item.width }} x
                {{ item.height }}
              </td>
              <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
              <td>{{ item.updated_at | date('dd/MM/yyyy') }}</td>
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
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button
          type="info"
          :disabled="!selected.length"
          :loading="loading"
          @click="handleSave"
        >
          Thêm
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { FETCH_LIST_CONTAINERS_NO_BOX } from '../../container/store'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import { cloneDeep } from '../../../core/utils'
export default {
  name: 'ModalListContainer',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    shipment: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState('container', {
      containers: (state) => state.containers,
      count: (state) => state.count,
    }),
    items() {
      return this.containers
    },
  },
  data() {
    return {
      filter: {
        limit: 10,
        page: 1,
        status: 2,
        search: '',
        fba: 0,
      },
      selected: [],
      isFetching: false,
    }
  },
  methods: {
    ...mapActions('container', [FETCH_LIST_CONTAINERS_NO_BOX]),
    async init() {
      this.isFetching = true
      this.filter.limit = 10
      let payload = cloneDeep(this.filter)
      payload.not_in_shipment = true
      payload.warehouse = this.shipment.hub_id
      payload.fba = this.shipment.is_fba ? 1 : 0
      payload.search = payload.search.toUpperCase()
      const result = await this[FETCH_LIST_CONTAINERS_NO_BOX](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      if (this.count > 0 && this.containers.length == 0) {
        this.filter.page--
      }
      this.action.selected = []
      this.selected = []
    },
    handleValue(e) {
      this.selected = JSON.parse(JSON.stringify(e))
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      let ids = this.selected.map((item) => {
        return item.id
      })
      this.$emit('save', ids)
    },
  },
  watch: {
    visible: {
      handler: function (value) {
        if (value) {
          this.init()
        }
      },
    },
    loading: {
      handler: function (value) {
        if (!value) {
          this.init()
        }
      },
    },
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
