<template>
  <div class="modal-add-user-coupon">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <div class="row mb-16" v-for="(item, i) in data" :key="i">
        <div class="col-6" style="padding-right: 4px">
          <label><b>Khách hàng:</b> <span style="color: red">*</span></label>
          <p-input
            type="text"
            class="mb-8"
            :disabled="true"
            :value="getCustomer(item)"
          ></p-input>
        </div>
        <div class="col-3" style="padding: 0 4px">
          <label><b>Số lượng:</b> <span style="color: red">*</span></label>
          <p-input
            type="number"
            class="mb-8"
            :value="item.quantity"
            v-model.number="data[i].quantity"
          ></p-input>
          <span class="invalid-error" v-if="errs2[i] && errs2[i].quantity">
            {{ errs2[i].quantity }}
          </span>
        </div>
        <div class="col-3" style="padding-left: 4px">
          <label><b>Đã sử dụng:</b> </label>
          <p-input
            type="number"
            min="1"
            class="mb-8"
            :value="item.used"
            :disabled="true"
          ></p-input>
        </div>
      </div>
      <div class="row mb-16" v-for="(item, j) in rows" :key="j + data.length">
        <div class="col-6" style="padding-right: 4px">
          <label><b>Khách hàng:</b> <span style="color: red">*</span></label>
          <user-resource
            class="user-resource is-fullwidth"
            :filter="{ role: 'customer' }"
            :label="`Thêm khách hàng`"
            :emitID="true"
            :isTester="tester"
            :arr-status="filter_status"
            v-model="rows[j].customer_id"
            @input="addRow($event, j)"
            :exclude="excludeIDs"
          />
          <span class="invalid-error" v-if="errs[j] && errs[j].customer_id">
            {{ errs[i].customer_id }}
          </span>
        </div>
        <div class="col-3" style="padding: 0 4px">
          <label><b>Số lượng:</b> <span style="color: red">*</span></label>
          <p-input
            type="number"
            min="1"
            class="mb-8"
            placeholder="Số lượng"
            v-model.number="rows[j].quantity"
            @change="addRow(rows[j].quantity, j)"
          ></p-input>
          <span class="invalid-error" v-if="errs[j] && errs[j].quantity">
            {{ errs[j].quantity }}
          </span>
        </div>
        <div class="col-3" style="padding-left: 4px">
          <label><b>Đã sử dụng:</b> </label>
          <p-input
            type="number"
            min="1"
            class="mb-8"
            :placeholder="rows[j].used"
            v-model.number="rows[j].used"
            :disabled="true"
          ></p-input>
        </div>
      </div>
      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Bỏ qua
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleSave"
              :loading="loading"
            >
              Lưu lại
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import UserResource from '@/components/shared/resource/UsersActive'
import { USER_STATUS_ACTIVE, USER_STATUS_DEACTIVE } from '../constants'
import valider from '@core/valider'
export default {
  name: 'ModalAddUserCoupon',
  components: {
    UserResource,
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
    coupon: {
      type: Object,
      default: () => {},
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    title() {
      return 'Thêm khách hàng'
    },
  },
  data() {
    return {
      data: [],
      rows: [
        {
          customer_id: 0,
          quantity: 0,
          used: 0,
        },
      ],
      errs: [],
      errs2: [],
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
      valider: null,
      filter_status: `${USER_STATUS_ACTIVE},${USER_STATUS_DEACTIVE}`,
      excludeIDs: [],
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSave() {
      this.valider = valider.schema((y) => ({
        customer_id: y
          .number()
          .typeError('Khách hàng chưa được chọn')
          .min(1, 'Khách hàng chưa được chọn'),
        quantity: y
          .number()
          .required('Số lượng không để trống')
          .typeError('Số lượng không để trống')
          .integer('Số lượng chỉ nhập số nguyên')
          .positive('Số lượng không hợp lệ')
          .min(1, 'Số lượng không hợp lệ'),
      }))
      this.valider.reset()
      this.errs = []
      this.rows.forEach((item, i) => {
        if (item.customer_id || item.quantity) {
          if (!this.valider.check(item)) {
            this.errs[i] = this.valider.errors
          }
        }
      })
      this.valider.reset()
      this.errs2 = []
      this.data.forEach((item, i) => {
        if (item.customer_id || item.quantity) {
          if (!this.valider.check(item)) {
            this.errs2[i] = this.valider.errors
          }
          if (item.quantity < item.used) {
            this.errs2[i] = {
              quantity: 'Số lượng không hợp lệ',
            }
          }
        }
      })
      if (this.errs.length || this.errs2.length) {
        return
      }

      let payload = [
        ...this.data.map((item) => {
          return {
            id: item.id,
            customer_id: item.customer_id,
            quantity: item.quantity,
          }
        }),
        ...this.rows
          .filter((item) => {
            return item.customer_id && item.quantity
          })
          .map((item) => {
            return {
              id: null,
              customer_id: item.customer_id,
              quantity: item.quantity,
            }
          }),
      ]
      this.$emit('add', payload, this.coupon.id)
    },
    handleSearch() {},
    addRow(id, i) {
      if (id) {
        let r = this.rows.find((i) => {
          return !i.customer_id && !i.quantity
        })
        if (!r) {
          this.rows.push({
            customer_id: 0,
            quantity: 0,
            used: 0,
          })
        }
        this.excludeIDs.push(id)
      } else {
        this.excludeIDs = this.excludeIDs.filter((item) => item !== id)
        const el = this.rows[i]
        const last = this.rows.slice(-1)[0]
        if (
          !el.customer_id &&
          !el.quantity &&
          !last.customer_id &&
          !last.quantity &&
          this.rows.length > 1
        ) {
          this.rows.pop()
        }
      }
    },
    getCustomer(item) {
      return `${item.full_name} - ${item.email}`
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    visible: function (v) {
      if (!v) {
        this.rows = [
          {
            customer_id: 0,
            quantity: 0,
            used: 0,
          },
        ]
        this.errs = []
        this.errs2 = []
        this.excludeIDs = []
        this.data = []
        return
      }
      this.data = this.users
      this.excludeIDs = [
        ...this.excludeIDs,
        ...this.data.map((i) => i.customer_id),
      ]
    },
  },
}
</script>
<style>
.multiselect__single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modal-add-user-coupon .p-modal-content {
  width: 640px !important;
}
.invalid-error {
  font-size: 10px !important;
}
.modal-add-user-coupon .modal-body {
  min-height: 370px;
}
</style>
