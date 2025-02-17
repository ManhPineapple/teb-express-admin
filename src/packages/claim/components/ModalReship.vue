<template>
  <div class="modal__edit-order">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="modal__edit-order-header">
          <span style="margin-bottom: 3px">
            <p-svg name="InfoCircle"></p-svg>
          </span>
          <b>Lưu ý:</b> <i>(<span>*</span>) Là các trường bắt buộc nhập.</i>
        </div>
        <div class="modal__edit-order-content">
          <div class="row sm-gutters flex-nowrap">
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header">Người nhận</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label"
                      >Họ và tên: <span>*</span></label
                    >
                    <div class="card__w-input">
                      <p-input
                        name="name"
                        placeholder="vd. Nguyen Van A"
                        v-model.trim="form.name"
                        :input="form.name"
                        :error="valider.error('name')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Điện thoại:</label>
                    <div class="card__w-input">
                      <p-input
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        v-model.trim="form.phone"
                        :error="valider.error('phone')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"
                      >Thành phố: <span>*</span></label
                    >
                    <div class="card__w-input">
                      <p-input
                        name="city"
                        placeholder="Nhập thành phố"
                        v-model.trim="form.city"
                        :error="valider.error('city')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Địa chỉ: <span>*</span></label>
                    <div class="card__w-input">
                      <p-input
                        name="address"
                        placeholder="Nhập địa chỉ"
                        v-model.trim="form.address"
                        :error="valider.error('address')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Địa chỉ phụ:</label>
                    <div class="card__w-input">
                      <p-input
                        name="address2"
                        placeholder="Nhập địa chỉ phụ"
                        v-model.trim="form.address2"
                        :error="valider.error('address2')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã vùng<br />(state): <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        name="state"
                        placeholder="Nhập mã vùng"
                        v-model.trim="form.state"
                        :error="valider.error('state')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã bưu điện: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        name="postcode"
                        placeholder="Nhập mã bưu điện"
                        v-model.trim="form.postcode"
                        :error="valider.error('postcode')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã quốc gia: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        name="country"
                        placeholder="Nhập mã quốc gia"
                        v-model.trim="form.country"
                        :error="valider.error('country')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header">Reship</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label"
                      >Nội dung: <span>*</span></label
                    >
                    <div class="card__w-input">
                      <p-input
                        :placeholder="placeholder"
                        type="textarea"
                        name="description"
                        v-model="form.description"
                        :error="valider.error('description')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header">Sản phẩm</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <div class="card__w-input">
                      <div
                        class="d-flex product-item"
                        v-for="item in products"
                        :key="item.id"
                      >
                        <div class="d-flex">
                          <p-input :value="item.sku" disabled />
                          <p-input class="ml-3" :value="item.name" disabled />
                          <p-input
                            class="ml-3"
                            :value="item.quantity"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header">Thông tin hàng hóa</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">Mã đơn hàng:</label>
                    <div class="card__w-input">
                      <p-input :value="detail.order_number" disabled />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Chi tiết hàng hóa:</label>
                    <div class="card__w-input">
                      <p-input :value="detail.detail" disabled />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Trọng lượng:</label>
                    <div class="card__w-input">
                      <p-input :value="volumes.weight" disabled />
                      <div class="card__w-unit">gram</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Dài:</label>
                    <div class="card__w-input">
                      <p-input :value="volumes.length" disabled />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Rộng:</label>
                    <div class="card__w-input">
                      <p-input :value="volumes.width" disabled />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Cao:</label>
                    <div class="card__w-input">
                      <p-input :value="volumes.height" disabled />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Hàng có pin:</label>
                    <div class="card__w-input">
                      <p-checkbox :value="detail.include_battery" disabled />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header"> Dịch vụ gửi </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">Dịch vụ gửi:</label>
                    <div class="card__w-input">
                      <p-input :value="detail.service.name" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="modal__edit-order-footer">
          <div class="total-title">
            Phí reship dự kiến:
            <span class="total-number">{{ feeReship | formatPrice }}</span>
            <div class="text" style="font-size: 11px"
              >Đây là phí tạm tính, có thể thay đổi theo thời điểm lệnh reship
              được tạo thành công!</div
            >
          </div>
          <div class="divider">
            <div class="notch"></div>
            <div class="notch-bt"></div>
          </div>
          <div class="total-action justify-content-between">
            <div>
              <p-button
                class="btn btn-info mr-2"
                :disabled="isLoading"
                @click="estimateCostHandle"
                >Phí reship</p-button
              >
            </div>
            <div>
              <p-button :type="`default`" class="btn" @click="handleClose"
                >Hủy bỏ</p-button
              >
              <p-button
                class="btn btn-info"
                :disabled="isLoading"
                @click="handleUpdate"
                >Cập nhật</p-button
              >
            </div>
          </div>
        </div>
      </template>
    </p-modal>
    <OverLoading :is-loading="isLoading" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import valider from '@core/valider'
import OverLoading from '@components/shared/OverLoading'
import { RESHIP_PACKAGE_ESTIMATE_COST } from '@/packages/package/store'
import { PROCESS_CLAIM } from '../store'
import { CLAIM_TYPE_RESHIP } from '../constants'

export default {
  name: 'ModalReship',
  components: { OverLoading },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    claim: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    code() {
      const { package_code } = this.detail
      return package_code.code || ''
    },
    title() {
      return `Vận chuyển lại đơn ${this.code}`
    },
    placeholder() {
      return `Phí Re-ship cho đơn ${this.code}`
    },
    products() {
      return (this.detail.package_products || []).map(
        ({ id, product, quantity }) => ({
          id,
          sku: product.sku,
          name: product.name,
          quantity,
        })
      )
    },
    volumes() {
      const {
        weight,
        length,
        width,
        height,
        actual_weight,
        actual_length,
        actual_width,
        actual_height,
      } = this.detail
      const isActual =
        width * length * height < actual_width * actual_length * actual_height

      return {
        weight: actual_weight > weight ? actual_weight : weight,
        length: isActual ? actual_length : length,
        width: isActual ? actual_width : width,
        height: isActual ? actual_height : height,
      }
    },
    isLoading() {
      return this.loading || this.isFetching
    },
    detail() {
      return this.claim.package || {}
    },
  },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        address: '',
        address2: '',
        description: '',
      },
      isFetching: false,
      valider: null,
      validErrors: {},
      feeReship: 0,
    }
  },
  created() {
    this.init()
    this.valider = valider.schema((y) => ({
      name: y
        .string()
        .required('Tên không để trống')
        .matches(
          /^([^0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*){0,150}$/,
          'Tên không hợp lệ'
        ),
      phone: y
        .string()
        .notRequired()
        .matches(
          /^$|^[0-9+()-. ]+$/,
          'Nhập số điện thoại từ 10 đến 11 chữ số, bắt đầu bằng 0,84 hoặc +84'
        ),
      city: y
        .string()
        .required('Thành phố không để trống')
        .matches(
          /^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,50}$/,
          'Thành phố không hợp lệ'
        ),
      country: y.string().required('Mã quốc gia không để trống'),
      state: y
        .string()
        .required('Mã vùng không để trống')
        .matches(
          /^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,30}$/,
          'Mã vùng không hợp lệ'
        ),
      postcode: y
        .string()
        .required('Mã bưu điện không để trống')
        .matches(/^[0-9\-_ ]{1,15}$/, 'Mã bưu điện không hợp lệ'),
      address: y
        .string()
        .required('Địa chỉ không để trống')
        .matches(/[A-Za-z0-9'.\-\s,]/, 'Địa chỉ không hợp lệ'),
      address2: y.string().matches(/[A-Za-z0-9'.\-\s,]/, {
        message: 'Địa chỉ phụ không hợp lệ',
        excludeEmptyString: true,
      }),
      description: y.string().required('Nội dung không để trống'),
      amount: y.string().required('Phí Re-ship không để trống'),
    }))
  },
  methods: {
    ...mapActions('claim', [PROCESS_CLAIM]),
    ...mapActions('package', [RESHIP_PACKAGE_ESTIMATE_COST]),
    async init() {
      this.feeReship = 0
      this.form.amount = 0
      this.form.description = `Phí Re-ship cho đơn ${this.code}`

      const pkg = this.detail || {}
      this.form.name = pkg.recipient
      this.form.phone = pkg.phone_number
      this.form.city = pkg.city
      this.form.state = pkg.state_code
      this.form.postcode = pkg.zipcode
      this.form.country = pkg.country_code
      this.form.address = pkg.address_1
      this.form.address2 = pkg.address_2
    },

    handleClose() {
      this.form.name = ''
      this.form.phone = ''
      this.form.city = ''
      this.form.state = ''
      this.form.postcode = ''
      this.form.country = ''
      this.form.address = ''
      this.form.address2 = ''
      this.form.amount = ''
      this.form.description = ''
      this.valider.errors = null

      this.$emit('update:visible', false)
    },

    async handleUpdate() {
      if (this.isFetching || !this.claim.id) return
      if (!this.valider.check(this.form)) return

      if (Object.keys(this.validErrors).length > 0) return

      const payload = {
        id: this.claim.id,
        type: CLAIM_TYPE_RESHIP,
        package: {
          id: this.detail.id,
          recipient: this.form.name,
          phone_number: this.form.phone,
          address_1: this.form.address,
          address_2: this.form.address2,
          city: this.form.city,
          state_code: this.form.state,
          zipcode: this.form.postcode,
          country_code: this.form.country,
          description: this.form.description,
        },
      }

      this.isFetching = true
      const res = await this[PROCESS_CLAIM](payload)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$emit('success', res)
      this.$toast.success('Xử lý khiếu nại thành công!')
      this.handleClose()
    },

    async estimateCostHandle() {
      if (this.isFetching) return

      this.feeReship = 0
      this.isFetching = true

      const params = {
        id: this.detail.id,
        recipient: this.form.name,
        phone_number: this.form.phone,
        address_1: this.form.address,
        city: this.form.city,
        state_code: this.form.state,
        zipcode: this.form.postcode,
        country_code: this.form.country,
        address_2: this.form.address2,
      }

      const res = await this[RESHIP_PACKAGE_ESTIMATE_COST](params)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      this.feeReship = res.total_amount
    },
  },
  watch: {
    visible: function (val) {
      if (val) this.init()
    },
  },
}
</script>
<style>
.multiselect--disabled .multiselect__tags,
.multiselect--disabled .multiselect__single {
  background-color: #eee;
}
</style>
