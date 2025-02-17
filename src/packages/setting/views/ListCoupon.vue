<template>
  <div class="pages list__product">
    <div class="search-input d-flex">
      <p-input
        placeholder="Tìm mã coupon"
        prefixIcon="search"
        class="mb-2"
        type="search"
        :value="filter.search"
        @keyup.enter="handleSearch"
      >
      </p-input>
      <div class="ml-3">
        <select
          v-model="filter.search_by"
          class="form-control"
          style="width: auto"
        >
          <option :value="key" v-for="(value, key) in searchBy" :key="key">
            {{ value }}
          </option>
        </select>
      </div>
      <p-button
        style="min-width: 154px"
        class="ml-3"
        type="info"
        @click="showModalCreateCoupon"
      >
        Tạo mã Coupon
      </p-button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="coupons.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>Mã coupon</th>
                    <th class="text-center">Ngày bắt đầu</th>
                    <th class="text-center">Ngày hết hạn</th>
                    <th class="text-center">Điểm mua</th>
                    <th class="text-center">Loại</th>
                    <th class="text-center">tối thiểu</th>
                    <th class="text-center">tối đa</th>
                    <th class="text-center">Giá trị giảm</th>
                    <th class="text-center">Trạng thái</th>
                    <th> </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, i) in coupons"
                    :key="i"
                    :class="{ expire: checkDisableCoupon(item) }"
                  >
                    <td>{{ item.code }}</td>
                    <td class="text-center">{{
                      item.start_date | date('dd/MM/yyyy HH:mm:ss')
                    }}</td>
                    <td class="text-center">{{
                      item.end_date | date('dd/MM/yyyy HH:mm:ss')
                    }}</td>
                    <td class="text-center">{{ item.point }}</td>
                    <td class="text-center">{{ getTypeCoupon(item.type) }}</td>
                    <td class="text-center">
                      {{ item.min_apply | formatPrice }}
                    </td>
                    <td class="text-center">
                      <span v-if="item.max_apply">
                        {{ item.max_apply | formatPrice }}</span
                      >
                      <span v-else>-</span>
                    </td>
                    <td class="text-center">{{ getValueCoupon(item) }}</td>
                    <td class="text-center">
                      <span
                        v-if="item.is_used && item.users.length > 0"
                        class="badge badge-round badge-done"
                        >Đã sử dụng</span
                      >
                      <span
                        v-else-if="!checkExpireCoupon(item)"
                        class="badge badge-round badge-success"
                        >Còn hiệu lực</span
                      >
                      <span v-else class="badge badge-round badge-expired"
                        >Hết hiệu lực</span
                      >
                    </td>
                    <td class="text-right">
                      <a
                        @click="showDetailCoupon(item.id)"
                        style="margin-right: 12px"
                      >
                        <p-svg name="edit_icon"></p-svg>
                      </a>
                      <a @click="showModalAddUser(item.id)">
                        <p-svg name="add_user"></p-svg>
                      </a>
                    </td>
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
    <modal-create-coupon
      :visible.sync="visibleModalCreateCoupon"
      :loading="isSubmitting"
      :coupon="coupon"
      @save="hanldeSaveCoupon"
    ></modal-create-coupon>
    <modal-add-user-coupon
      :visible.sync="visibleModalAddUser"
      :loading="isSubmitting"
      :coupon="coupon"
      @add="hanldeAddUserCoupon"
      :users="users"
    ></modal-add-user-coupon>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import ModalCreateCoupon from '../components/ModalCreateCoupon'
import ModalAddUserCoupon from '../components/ModalAddUserCoupon'
import { TYPE_COUPON, COUPON_TYPE_DISCOUNT_PERCENT } from '../constants'
import { formatPrice } from '@core/utils/formatter'
import {
  ADD_USER_COUPON,
  CREATE_COUPON,
  GET_LIST_COUPON,
  GET_DETAIL_COUPON,
} from '../store/index'

export default {
  name: 'ListCoupon',
  mixins: [mixinRoute, mixinTable],
  components: {
    ModalAddUserCoupon,
    EmptySearchResult,
    ModalCreateCoupon,
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
        search_by: 'code',
      },
      coupon: null,
      users: [],
      isFetching: false,
      isSubmitting: false,
      visibleModalCreateCoupon: false,
      visibleModalAddUser: false,
      searchBy: {
        code: 'Tìm theo mã coupon',
        customer_name: 'Tìm theo khách hàng',
      },
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('setting', {
      count: (state) => state.countCoupons,
      coupons: (state) => state.coupons,
    }),
  },
  methods: {
    ...mapActions('setting', [
      CREATE_COUPON,
      GET_LIST_COUPON,
      GET_DETAIL_COUPON,
      ADD_USER_COUPON,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[GET_LIST_COUPON](this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },
    getValueCoupon(item) {
      if (item.type === COUPON_TYPE_DISCOUNT_PERCENT) {
        return `${item.value}%`
      }
      return formatPrice(item.value)
    },
    async hanldeSaveCoupon(payload) {
      this.isSubmitting = true
      let r = await this[CREATE_COUPON](payload)
      this.isSubmitting = false
      if (r.error) {
        this.$toast.error(r.message)
        return
      }
      let msg = 'Tạo coupon thành công'
      if (payload.id) {
        msg = 'Cập nhật coupon thành công'
      }
      this.$toast.success(msg)
      this.visibleModalCreateCoupon = false
      this.init()
    },
    async hanldeAddUserCoupon(payload, id) {
      payload.coupon_id = id
      this.isSubmitting = true
      const r = await this[ADD_USER_COUPON](payload)
      this.isSubmitting = false
      if (r.error) {
        this.$toast.error(r.message)
        return
      }
      this.$toast.success('Thêm coupon khách hàng thành công')
      this.visibleModalAddUser = false
      this.init()
    },
    checkDisableCoupon(item) {
      if (
        new Date(item.end_date) < new Date() ||
        (item.is_used && item.users.length)
      ) {
        return true
      }
      return false
    },
    checkExpireCoupon(item) {
      if (new Date(item.end_date) < new Date()) {
        return true
      }
      return false
    },
    async showModalAddUser(id) {
      const p = {
        id: id,
      }
      const result = await this[GET_DETAIL_COUPON](p)
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.coupon = result.coupon
      this.users = result.users || []
      this.visibleModalAddUser = true
    },
    async showDetailCoupon(id) {
      const p = {
        id: id,
      }
      const result = await this[GET_DETAIL_COUPON](p)
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.coupon = result.coupon
      this.visibleModalCreateCoupon = true
    },
    showModalCreateCoupon() {
      this.coupon = null
      this.visibleModalCreateCoupon = true
    },
    getTypeCoupon(type) {
      return TYPE_COUPON[type]
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
<style>
tr.expire {
  opacity: 0.7;
}
</style>
