<template>
  <div class="pages list__product">
    <div class="search-input">
      <p-input
        placeholder="Tìm kiếm theo tên sản phẩm hoặc sku"
        prefixIcon="search"
        class="mb-2"
        type="search"
        :value="filter.search"
        @keyup.enter="handleSearch"
      >
      </p-input>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="listProducts.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>TÊN SẢN PHẨM</th>
                    <th>SKU</th>
                    <th>LOẠI SẢN PHẨM</th>
                    <th>CHẤT LIỆU SẢN PHẨM</th>
                    <th class="text-center">TRỌNG LƯỢNG (GRAM)</th>
                    <th class="text-center">KÍCH THƯỚC (CM)</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, i) in listProducts" :key="i">
                    <td>{{ item.name }}</td>
                    <td>
                      {{ item.sku }}
                    </td>
                    <td>{{ item.detail }}</td>
                    <td>{{ item.material }}</td>
                    <td class="text-center">{{ item.weight }}</td>
                    <td class="text-center">{{ size(item) }}</td>
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
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import { FETCH_LIST_PRODUCTS } from '../../package/store/index'

export default {
  name: 'ListProduct',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
  },
  props: {
    user_id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      filter: {
        limit: 25,
        search: '',
        status: 1,
      },
      isFetching: false,
      product: {},
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('package', {
      count: (state) => state.countProducts,
      listProducts: (state) => state.products,
    }),
  },
  methods: {
    ...mapActions('package', [FETCH_LIST_PRODUCTS]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      let result = await this.fetchListProducts(this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },

    size(item) {
      return `${item.length}x${item.width}x${item.height}`
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
