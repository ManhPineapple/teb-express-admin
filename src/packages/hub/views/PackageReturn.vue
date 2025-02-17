<template>
  <div class="pages packages__return">
    <div class="page-header">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Tìm theo mã đơn hàng"
          prefixIcon="search"
          type="search"
          clearable
          v-model="search"
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
          <template v-if="returnItems.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <template>
                      <th>Order Number</th>
                      <th>ANANBAY TRACKING</th>
                      <th class="text-center">Action</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in paginate(returnItems)" :key="i">
                    <td>{{ item.order_number }}</td>
                    <td>{{ item.package_code.code }}</td>
                    <td class="text-center">
                      <p-button
                        :style="`width:85px;`"
                        class="btn-promotion"
                        type="danger"
                        @click="confirmRemove(item)"
                      >
                        Xóa
                      </p-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="d-flex justify-content-between align-items-center mb-16"
              >
                <div class="pagination-box">
                  <nav>
                    <ul class="pagination">
                      <li class="page-item nav-button">
                        <span
                          class="page-linksy left-link"
                          :class="{ disabled: filter.page == 1 }"
                          @click="filter.page--"
                        >
                          <svgicon name="arrowright" class="text-white" />
                        </span>
                      </li>
                      <li class="page-item">
                        <span
                          v-for="(pageNumber, index) in pages"
                          :key="index"
                          :class="{ active: isPageActive(pageNumber) }"
                          @click="setPage(pageNumber)"
                        >
                          <span
                            class="page-linksy"
                            v-if="index == 0"
                            @click="setPage(index + 1)"
                            >{{ index + 1 }}</span
                          >
                          <span
                            class="page-linksy"
                            v-else-if="index === filter.page"
                            >{{ index + 1 }}</span
                          >
                          <span
                            class="page-linksy"
                            v-else-if="index === filter.page - 1"
                            >{{ index + 1 }}</span
                          >
                          <span
                            class="page-linksy"
                            v-else-if="index === filter.page - 2"
                            >{{ index + 1 }}</span
                          >
                          <span
                            class="page-linksy"
                            v-else-if="index === pages.length - 1"
                            >{{ index + 1 }}</span
                          >
                          <span
                            class="page-linksy"
                            v-else-if="
                              index !== 4 &&
                              filter.page !== pages.length - 2 &&
                              index === pages.length - 2
                            "
                            >...</span
                          >
                        </span>
                      </li>
                      <li class="page-item nav-button">
                        <span
                          @click="filter.page++"
                          :class="{ disabled: filter.page === pages.length }"
                          class="page-linksy"
                        >
                          <svgicon name="arrowright" class="text-white" />
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetching" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinBarcode from '@core/mixins/barcode'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { HUB_SCAN_RETURN, REMOVE_SCAN_RETURN_ITEM } from '../store'
import PageLoading from '@components/shared/OverLoading'
export default {
  name: 'ListReturn',
  mixins: [mixinRoute, mixinTable, mixinBarcode],
  components: { EmptySearchResult, PageLoading },
  data() {
    return {
      isFetching: false,
      search: '',
      returnItems: [],
      pages: [],
      filter: {
        limit: 30,
        page: 1,
      },
    }
  },
  methods: {
    ...mapActions('hub', [HUB_SCAN_RETURN, REMOVE_SCAN_RETURN_ITEM]),
    async searchHandle() {
      if (this.detecting_scanning && this.input_stack.length) {
        return
      }
      this.isFetching = true
      const payload = {
        search: this.search.trim(),
      }
      let result = await this[HUB_SCAN_RETURN](payload)
      this.isFetching = false
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.returnItems.push(result.package)
      this.setPages()
    },
    clearSearch() {
      this.search = ''
    },
    confirmRemove(item) {
      this.$dialog.confirm({
        title: `Xác nhận`,
        message: 'Bạn có chắc chắn muốn thực hiện hành động này ?',
        onConfirm: () => {
          this.removeReturnPackage(item)
        },
      })
    },
    async removeReturnPackage(item) {
      this.isFetching = true
      const payload = {
        id: item.id,
      }
      let result = await this[REMOVE_SCAN_RETURN_ITEM](payload)
      this.isFetching = false
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.returnItems = this.returnItems.filter((i) => i.id !== payload.id)
    },
    isPageActive(page) {
      return this.filter.page === page
    },
    setPages() {
      this.pages = []
      let numberOfPages = Math.ceil(this.returnItems.length / this.filter.limit)
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index)
      }
    },
    setPage(page) {
      this.filter.page = page
    },
    paginate(items) {
      if (!items) {
        return
      }
      let page = this.filter.page
      let perPage = this.filter.limit
      let from = page * perPage - perPage
      let to = page * perPage
      return items.slice(from, to)
    },
    barcodeSubmit(keyword) {
      if (keyword.length == 38) {
        keyword = keyword.slice(-26).trim()
      } else if (keyword.length > 40) {
        keyword = keyword.slice(-23).trim()
      } else if (keyword.length > 24) {
        keyword = keyword.slice(-22).trim()
      }
      this.search = keyword
      this.searchHandle()
    },
  },
}
</script>

<style>
.left-link svg {
  transform: rotate(180deg);
}
.pagination .page-item > span {
  cursor: pointer;
  border-radius: 4px !important;
}

.pagination .disabled svg path {
  stroke: #cfd0d0;
}
.pagination .nav-button:first-child {
  margin-right: 20px;
}
.pagination .nav-button:last-child {
  margin-left: 20px;
}
.pagination li.page-item {
  height: 40px !important;
}
.pagination li.page-item > span {
  display: inline-block;
  margin: 0px 2px;
}
.pagination .nav-button > span {
  padding: 3px 0 0px 9px !important;
  width: 40px;
  height: 40px;
  border: 2px solid #313232 !important;
  box-sizing: border-box;
  border-radius: 8px !important;
  background-color: unset !important;
  font-weight: 700;
}
.pagination .nav-button > span.disabled {
  border: none !important;
}
.pagination .disabled {
  pointer-events: none;
}
</style>
