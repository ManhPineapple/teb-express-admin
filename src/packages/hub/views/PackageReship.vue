<template>
  <div class="pages packages__reship">
    <div class="page-header">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Nhập mã đơn"
          prefixIcon="search"
          type="search"
          clearable
          v-model="filter.search"
          @keyup.enter="searchHandle"
          @clear="clearSearch"
        >
        </p-input>
        <p-button
          id="export-btn"
          @click="searchHandle"
          class="btn btn-info ml-3 text-nowrap"
          >Quét</p-button
        >
      </div>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="items.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>MÃ ĐƠN HÀNG</th>
                      <th>ANANBAY TRACKING</th>
                      <th>LAST MILE TRACKING</th>
                      <th>NGÀY RESHIP</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in displayItems" :key="i">
                    <td>
                      <router-link
                        class="package-id"
                        :to="item.route"
                        v-if="$isAdmin()"
                      >
                        #{{ item.id }}
                      </router-link>
                      <a class="package-id" href="#" v-else> #{{ item.id }} </a>
                    </td>
                    <td>{{ item.code }}</td>
                    <td>
                      <a
                        v-if="item.tracking_number"
                        target="_blank"
                        class="on-hover tracking"
                        :href="`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${item.tracking_number}`"
                      >
                        {{ item.tracking_number }}
                        <p-svg name="arright"> </p-svg>
                      </a>

                      <span
                        class="download-label"
                        v-if="item.tracking_number != 'N/A'"
                      >
                        <p-tooltip
                          class="item_name"
                          :label="`Download`"
                          position="bottom"
                          type="dark"
                        >
                          <a
                            href="javascript:void(0)"
                            @click="downloadLabel(item.label_url)"
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="16" cy="16" r="16" fill="none" />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.00002 19.264V12.728C8.00002 9.904 9.81682 8 12.528 8H19.464C22.176 8 24 9.904 24 12.728V19.264C24 22.096 22.176 24 19.464 24H12.528C9.81682 24 8.00002 22.096 8.00002 19.264ZM16.6 17.816V12.736C16.6 12.4 16.328 12.136 16 12.136C15.664 12.136 15.4 12.4 15.4 12.736V17.816L13.424 15.832C13.312 15.72 13.152 15.656 13 15.656C12.8488 15.656 12.696 15.72 12.576 15.832C12.344 16.064 12.344 16.448 12.576 16.68L15.576 19.696C15.8 19.92 16.2 19.92 16.424 19.696L19.424 16.68C19.656 16.448 19.656 16.064 19.424 15.832C19.184 15.6 18.808 15.6 18.568 15.832L16.6 17.816Z"
                                fill="#313232"
                              />
                            </svg>
                          </a>
                        </p-tooltip>
                      </span>
                    </td>
                    <td>
                      <span v-if="item.reship_at">{{
                        item.reship_at | date('dd/MM/yyyy')
                      }}</span>
                      <span v-else>N/A</span></td
                    >
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
                :filterLimit="true"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <ModalReturn
      :visible.sync="isShowModalReturn"
      :submit="returnHandle"
      :current="current"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { GET_LABEL } from '../../container/store'
import Browser from '@core/helpers/browser'
import { HUB_COUNT_SEARCH_ITEMS, HUB_SEARCH_ITEMS } from '../store'
import { HUB_TAB_IDS } from '../constants'
import ModalReturn from '../components/ModalReturn'
import mixinBarcode from '@core/mixins/barcode'
import PSvg from '../../../../uikit/components/svg/svg'
export default {
  name: 'ListReturn',
  mixins: [mixinRoute, mixinTable, mixinBarcode],
  components: { PSvg, EmptySearchResult, ModalReturn },
  data() {
    return {
      isFetching: false,
      filter: {
        search: '',
        page: 1,
        limit: 20,
        status: 'reship',
      },
      isShowModalReturn: false,
      current: {},
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.searchHandle()
  },
  computed: {
    ...mapState('hub', {
      items: (state) => state.items,
      count: (state) => state.count,
    }),
    displayItems() {
      return this.items.map((item) => {
        item.status_text = item.package_return_id
          ? 'Đã gửi lý do'
          : 'Chưa gửi lý do'

        item.route = { name: 'package-detail', params: { id: item.id } }
        return item
      })
    },
  },
  methods: {
    ...mapActions('hub', {
      searchSubmit: HUB_SEARCH_ITEMS,
      countSearchSubmit: HUB_COUNT_SEARCH_ITEMS,
    }),
    ...mapActions('container', [GET_LABEL]),
    async searchHandle() {
      this.handleUpdateRouteQuery()

      const filters = Object.assign({}, this.filter)
      filters.status = HUB_TAB_IDS[this.filter.status]

      this.isFetching = true

      const res = await Promise.all([
        this.searchSubmit(filters),
        this.countSearchSubmit(filters),
      ])

      this.isFetching = false

      for (const v of res) {
        if (v.error) {
          this.$toast.error(v.message)
        }
      }
    },
    clearSearch() {
      this.filter.search = ''
      this.searchHandle()
    },
    barcodeSubmit(keyword) {
      if (keyword.length > 22) {
        keyword = keyword.slice(-22)
      }
      this.keyword = keyword
      this.filter.search = this.keyword
      this.searchHandle()
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
  },
  watch: {
    'filter.page': function () {
      this.searchHandle()
    },
    'filter.limit': function () {
      this.filter.page = 1
      this.searchHandle()
    },
  },
}
</script>
