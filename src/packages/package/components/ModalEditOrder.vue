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
                <div class="card__w-header"> Người nhận </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Họ và tên: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="vd. Nguyen Van A"
                        type="fullname"
                        v-model="form.fullname"
                        :input="form.fullname"
                        name="name"
                        :error="valider.error('fullname')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Điện thoại: </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập số điện thoại"
                        type="phonenumber"
                        ref="email"
                        v-model="form.phone"
                        :input="form.phone"
                        name="phone"
                        :error="valider.error('phone')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Địa chỉ: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập địa chỉ"
                        type="text"
                        v-model="form.address"
                        :input="form.address"
                        name="address"
                        :error="valider.error('address')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Địa chỉ phụ: </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập địa chỉ phụ"
                        type="text"
                        v-model="form.address2"
                        :input="form.address2"
                        name="address2"
                        :error="valider.error('address2')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Thành phố: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập thành phố"
                        type="text"
                        v-model="form.city"
                        :input="form.city"
                        name="city"
                        :error="valider.error('city')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã vùng<br />
                      (state): <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập mã vùng"
                        type="text"
                        v-model="form.state"
                        :input="form.state"
                        name="state"
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
                        placeholder="Nhập mã bưu điện"
                        type="text"
                        v-model="form.postcode"
                        :input="form.postcode"
                        name="postcode"
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
                        placeholder="Nhập mã quốc gia"
                        type="text"
                        v-model="form.countrycode"
                        :input="form.countrycode"
                        name="countrycode"
                        :error="valider.error('countrycode')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w" v-if="isReLabel">
                <div class="card__w-header"> Reship </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Nội dung: <span>*</span></label
                    >
                    <div class="card__w-input">
                      <p-input
                        :placeholder="placeholder"
                        type="textarea"
                        v-model="form.description"
                        :input="form.description"
                        name="description"
                        :disabled="!isReLabel"
                        :error="valider.error('description')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div
                  class="card__w-header d-flex justify-content-between align-items-center"
                >
                  Sản phẩm
                  <div class="add-product" v-if="!isReLabel">
                    <a @click="handleAddProduct" class="btn btn-add">
                      <img src="~@assets/img/Add 20px.png" />
                    </a>
                  </div>
                </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <div class="card__w-input">
                      <div
                        class="d-flex product-item"
                        v-for="(prod, index) in package_prods"
                        :key="index"
                      >
                        <div class="row product-info">
                          <div class="select-product col-md-7">
                            <multiselect
                              class="multiselect-custom dropdown-reason"
                              v-model="product_sku[index]"
                              :options="product_option"
                              placeholder="Chọn SKU"
                              @select="handleSelectProd($event, index)"
                              @remove="handleRemoveProd(index)"
                              :disabled="isReLabel"
                              :custom-label="customLabelProd"
                            ></multiselect>
                          </div>
                          <div class="select-product col-md-5">
                            <div class="product-name">
                              {{ prod.name }}
                            </div>
                          </div>
                          <span class="err-span" v-if="prod.err != ''">
                            {{ prod.err }}
                          </span>
                        </div>

                        <input
                          placeholder="Số lượng"
                          v-model="prod.quantity"
                          :input="prod.quantity"
                          class="form-control select-product product-quantity"
                          name="quantity"
                          :disabled="isReLabel"
                        />

                        <div class="add-product" v-if="!isReLabel">
                          <a
                            @click="handleRemoveProduct(index)"
                            class="btn btn-remove"
                          >
                            <img src="~@assets/img/X 20px.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Tên gói hàng </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Tên gói hàng..."
                        v-model="form.package_name"
                        :input="form.package_name"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Số lượng </label>
                    <div class="card__w-input">
                      <p-input
                        v-model="form.package_quantity"
                        :input="form.package_quantity"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Giá trị đơn </label>
                    <div class="card__w-input">
                      <p-input
                        v-model="form.product_price"
                        :input="form.product_price"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header"> Thông tin hàng hóa </div>
                <div class="card__w-content">
                  <div class="card__w-item" v-if="false">
                    <label class="card__w-label"> Danh sách đơn hàng: </label>
                    <div class="card__w-input">
                      <multiselect
                        class="multiselect-custom dropdown-reason"
                        v-model="item"
                        :options="products"
                        placeholder="Chọn một "
                        @select="handleSelect"
                        :custom-label="customLabel"
                        :disabled="isDisable"
                        @remove="handleRemove"
                      ></multiselect>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã đơn hàng : <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập mã đơn hàng"
                        type="text"
                        v-model="form.order_number"
                        :input="form.order_number"
                        name="order_number"
                        :disabled="isReLabel"
                        :error="valider.error('order_number')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Chi tiết hàng hóa : <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chi tiết hàng hóa"
                        type="text"
                        v-model="form.detail"
                        :input="form.detail"
                        name="detail"
                        :disabled="isReLabel"
                        :error="valider.error('detail')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Trọng lượng: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập trọng lượng"
                        type="text"
                        v-model="form.weight"
                        :input="form.weight"
                        name="weight"
                        :disabled="isDisable"
                        :error="valider.error('weight')"
                      />
                      <div class="card__w-unit">gram</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Dài: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều dài "
                        type="text"
                        v-model="form.length"
                        :input="form.length"
                        name="length"
                        :disabled="isDisable"
                        :error="valider.error('length')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Rộng: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều rộng "
                        type="text"
                        v-model="form.width"
                        :input="form.width"
                        name="width"
                        :disabled="isDisable"
                        :error="valider.error('width')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Cao: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều cao "
                        type="text"
                        v-model="form.height"
                        :input="form.height"
                        name="height"
                        :disabled="isDisable"
                        :error="valider.error('height')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Hàng có pin:</label>
                    <div class="card__w-input">
                      <p-checkbox
                        v-model="form.include_battery"
                        :disabled="isDisableCheckBattery"
                      ></p-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header"> Dịch vụ gửi </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Dịch vụ gửi: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <multiselect
                        :disabled="true"
                        class="multiselect-custom dropdown-reason"
                        v-model="service"
                        :options="services"
                        placeholder="Chọn một"
                        :allow-empty="false"
                        @select="handleSelectService"
                        :custom-label="customLabel"
                      ></multiselect>
                    </div>
                  </div>
                  <!-- <div class="card__w-item">
                    <label class="card__w-label">
                      Loại đơn hàng: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <select
                        v-model="cnPackageType"
                        class="multiselect-custom dropdown-reason"
                        @change="handleCnPackageTypeChange"
                      >
                        <option value="Pre-purchased">Hàng nhờ mua</option>
                        <option value="Purchased">Hàng đã mua</option>
                      </select>
                    </div>
                  </div> -->

                  <div v-if="this.package_detail.package.service.code === 'CN'">
                    <div class="card__w-item">
                      <label class="card__w-label"> Link sản phẩm: </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập link"
                          type="text"
                          v-model="form.cn_product_link"
                          :input="form.width"
                          name="product_link"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label"> Giá sản phẩm: </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập giá sản phẩm"
                          type="text"
                          v-model="form.cn_product_price"
                          :input="form.width"
                          name="cn_product_price"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label">
                        Giá ship nội địa CN:
                      </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập giá ship"
                          type="text"
                          v-model="form.cn_shipping_fee"
                          :input="form.width"
                          name="cn_shipping_fee"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label"> Giá ship CN-VN: </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập giá ship"
                          type="text"
                          v-model="form.cn_shipping_to_vn_fee"
                          :input="form.width"
                          name="cn_shipping_to_vn_fee"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label"> Phí Handling: </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập giá handling"
                          type="text"
                          v-model="form.cn_label_extra_fee"
                          :input="form.width"
                          name="cn_label_extra_fee"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label"> Label CN: </label>
                      <div class="card__w-input">
                        <p-input
                          placeholder="Nhập mã barcode"
                          type="text"
                          v-model="form.custom_cn_barcode"
                          :input="form.width"
                          name="custom_cn_barcode"
                          :disabled="
                            this.package_detail.package.tracking != null
                          "
                        />
                      </div>
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
          <div class="total-title" v-if="this.isReLabel">
            Phí reship dự kiến:
            <span class="total-number">{{ feeReship | formatPrice }}</span>
            <div class="text" style="font-size: 11px"
              >Đây là phí tạm tính, có thể thay đổi theo thời điểm lệnh reship
              được tạo thành công!</div
            >
          </div>
          <div class="total-title" v-else>
            Tổng cước:
            <span class="total-number">{{ 0 | formatPrice }}</span>
            <div class="text">Bảng giá không áp dụng cho hành trình này!</div>
          </div>
          <div class="divider">
            <div class="notch"></div>
            <div class="notch-bt"></div>
          </div>
          <div class="total-action justify-content-between">
            <div>
              <p-button
                v-if="this.isReLabel"
                class="btn btn-info mr-2"
                :disabled="isUpdate"
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
                :disabled="isUpdate"
                @click="handleUpdate"
                >Cập nhật</p-button
              >
            </div>
          </div>
        </div>
      </template>
    </p-modal>
    <OverLoading :is-loading="loading" />
  </div>
</template>
<script>
import { PRODUCT_STATUS_ACTIVATE } from '@/packages/package/constants'
import OverLoading from '@components/shared/OverLoading'
import { cloneDeep } from '@core/utils'
import valider from '@core/valider'
import { mapActions, mapGetters, mapState } from 'vuex'
import PButton from '../../../../uikit/components/button/Button'
import { PACKAGE_STATUS_CREATED, PACKAGE_STATUS_PURCHASED } from '../constants'
import {
  FETCH_LIST_PRODUCTS,
  FETCH_PACKAGE_DETAIL,
  GET_SERVICE,
  RESHIP_PACKAGE_ESTIMATE_COST,
  UPDATE_PACKAGE,
} from '../store'

export default {
  name: 'ModalEditOrder',
  components: { PButton, OverLoading },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isReLabel: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
    },
    packageId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
      products: (state) => state.products,
    }),
    ...mapGetters('package', {
      services: GET_SERVICE,
    }),
    isDisableCheckBattery() {
      return this.package_detail.package.status !== PACKAGE_STATUS_CREATED
    },
    code() {
      return this.package_detail && this.package_detail.package.package_code
        ? this.package_detail.package.package_code.code
        : ''
    },
    title() {
      if (this.isReLabel) {
        return `Reship đơn ${this.code}`
      }

      return `Sửa đơn ${this.code}`
    },
    placeholder() {
      return `Phí Re-ship cho đơn ${this.code}`
    },
    currentId() {
      return this.packageId > 0
        ? this.packageId
        : this.$route.params.id
        ? this.$route.params.id
        : 0
    },
  },
  data() {
    return {
      item: null,
      sender: null,
      service: {
        id: 0,
        name: '',
      },
      form: {
        fullname: '',
        phone: '',
        city: '',
        state: '',
        postcode: '',
        note: '',
        code: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        countrycode: '',
        order_number: '',
        detail: '',
        address: '',
        address2: '',
        amount: '',
        include_battery: false,
        description: '',
        package_name: '',
        package_quantity: 0,
        product_price: 0,
        cn_product_link: '',
        cn_product_price: '',
        cn_shipping_fee: '',
        custom_cn_barcode: '',
        cn_label_extra_fee: '',
        cn_shipping_to_vn_fee: '',
      },
      loading: false,
      isDisable: false,
      isUpdate: false,
      valider: null,
      validErrors: {},
      fixAmount: 0,
      package_prods: [],
      product_sku: [],
      product_option: [],
      feeReship: 0,
      cnPackageType: '',
      cnPackageOptions: [
        { value: 'Pre-purchased', label: 'Hàng nhờ mua' },
        { value: 'Purchased', label: 'Hàng đã mua' },
      ],
    }
  },
  created() {
    this.init()
    this.valider = valider.schema((y) => {
      let fields = {
        fullname: y
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
        weight: y
          .string()
          .required('Số cân nặng không để trống')
          .matches(
            /^\s*(?:0|\d*(?:\.\d{1,20})?)\s*$/,
            'Số cân nặng không hợp lệ'
          ),
        length: y
          .string()
          .required('Số đo chiều dài không để trống')
          .matches(
            /^\s*(?:0|\d*(?:\.\d{1,20})?)\s*$/,
            'Số đo chiều dài không hợp lệ'
          ),
        width: y
          .string()
          .required('Số đo chiều rộng không để trống')
          .matches(
            /^\s*(?:0|\d*(?:\.\d{1,20})?)\s*$/,
            'Số đo chiều rộng không hợp lệ'
          ),
        height: y
          .string()
          .required('Số đo chiều cao không để trống')
          .matches(
            /^\s*(?:0|\d*(?:\.\d{1,20})?)\s*$/,
            'Số đo chiều cao không hợp lệ'
          ),
        address: y
          .string()
          .required('Địa chỉ không để trống')
          .matches(/[A-Za-z0-9'.\-\s,]/, 'Địa chỉ không hợp lệ'),
        address2: y.string().matches(/[A-Za-z0-9'.\-\s,]/, {
          message: 'Địa chỉ phụ không hợp lệ',
          excludeEmptyString: true,
        }),
      }
      if (this.isReLabel) {
        fields = {
          ...fields,
          ...{
            description: y.string().required('Nội dung không để trống'),
            amount: y.string().required('Phí Re-ship không để trống'),
          },
        }
      }
      return fields
    })
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PRODUCTS,
      UPDATE_PACKAGE,
      FETCH_PACKAGE_DETAIL,
      RESHIP_PACKAGE_ESTIMATE_COST,
    ]),
    async init() {
      this.feeReship = 0
      this.loading = true
      if (this.packageId) {
        await this.fetchPackage(this.packageId)
      }
      this.$set(this.form, 'description', `Phí Re-ship cho đơn ${this.code}`)
      this.$set(this.form, 'amount', 0)
      const payload = {
        user_id: this.package_detail.package.user_id,
        status: PRODUCT_STATUS_ACTIVATE,
      }

      await this[FETCH_LIST_PRODUCTS](payload)

      this.product_option = cloneDeep(this.products)
      this.loading = false

      const pkg = (this.package_detail || {}).package || {}

      this.form.fullname = pkg.recipient
      this.form.phone = pkg.phone_number
      this.form.city = pkg.city
      this.form.state = pkg.state_code
      this.form.postcode = pkg.zipcode
      this.form.note = pkg.note
      this.form.code = pkg.code
      this.form.items = pkg.items
      this.form.weight = pkg.weight
      this.form.length = pkg.length
      this.form.width = pkg.width
      this.form.height = pkg.height
      this.form.countrycode = pkg.country_code
      this.form.service = {
        id: pkg.service ? pkg.service.id : 0,
        name: pkg.service ? pkg.service.name : '',
      }
      this.form.custom_cn_barcode = pkg.custom_cn_barcode
      this.form.package_name = pkg.package_name
      this.form.package_quantity = pkg.package_quantity
      this.form.product_price = pkg.product_price
      this.form.address = pkg.address_1
      this.form.address2 = pkg.address_2
      this.form.order_number = pkg.order_number
      this.form.detail = pkg.detail
      this.form.include_battery = pkg.include_battery
      this.service = this.form.service
      if (this.form.weight < pkg.actual_weight) {
        this.form.weight = pkg.actual_weight
      }
      this.form.cn_product_link = pkg.cn_product_link
      this.form.cn_product_price = pkg.cn_product_price
      this.form.cn_shipping_fee = pkg.cn_shipping_fee
      this.form.custom_cn_barcode = pkg.custom_cn_barcode

      if (
        this.form.width * this.form.length * this.form.height <
        pkg.actual_width * pkg.actual_length * pkg.actual_height
      ) {
        this.form.width = pkg.actual_width
        this.form.length = pkg.actual_length
        this.form.height = pkg.actual_height
      }

      this.package_prods = []
      this.product_sku = []

      if (this.package_detail.package.package_products) {
        for (
          let i = 0;
          i < this.package_detail.package.package_products.length;
          i++
        ) {
          let prod = this.products.find(
            (prod) =>
              prod.id ==
              this.package_detail.package.package_products[i].product_id
          )

          this.package_prods.push({
            product_id:
              this.package_detail.package.package_products[i].product_id,
            sku: prod.sku,
            quantity: this.package_detail.package.package_products[i].quantity,
            name: prod.name,
            err: '',
          })

          this.product_sku.push(prod)

          let index = this.product_option.findIndex((ele) => ele.id == prod.id)
          if (index >= 0) {
            this.product_option.splice(index, 1)
          }
        }
      }

      this.package_prods.push({
        product_id: 0,
        sku: 'Chọn sản phẩm',
        quantity: '',
        name: 'Tên sản phẩm',
        err: '',
      })

      this.product_sku.push({
        product_id: 0,
        sku: 'Chọn sản phẩm',
        quantity: '',
        name: 'Tên sản phẩm',
      })

      this.isDisable =
        this.package_detail.package.status != PACKAGE_STATUS_CREATED &&
        this.package_detail.package.status != PACKAGE_STATUS_PURCHASED
    },
    handleSelectProd(value, index) {
      let i = this.products.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.products[i])
      }

      i = this.product_option.findIndex((ele) => ele.id == value.id)
      if (i >= 0) {
        this.product_option.splice(i, 1)
      }
      this.package_prods[index].product_id = value.id
      this.package_prods[index].sku = value.sku
      this.package_prods[index].name = value.name

      this.product_sku[index] = value
    },

    handleRemoveProd(index) {
      let i = this.products.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.products[i])
      }
      this.package_prods[index].product_id = 0
      this.package_prods[index].sku = 'Chọn sản phẩm'
      this.package_prods[index].quantity = ''
      this.package_prods[index].name = 'Tên sản phẩm'
    },

    customLabelProd(item) {
      return item.sku
    },

    handleClose() {
      this.form.fullname = ''
      this.form.phone = ''
      this.form.city = ''
      this.form.state = ''
      this.form.postcode = ''
      this.form.note = ''
      this.form.code = ''
      this.form.items = ''
      this.form.weight = ''
      this.form.length = ''
      this.form.width = ''
      this.form.height = ''
      this.form.countrycode = ''
      this.form.service = ''
      this.form.address = ''
      this.form.amount = ''
      this.form.description = ''
      this.form.include_battery = false
      this.valider.errors = null
      this.package_prods = []
      this.product_sku = []
      this.$emit('update:visible', false)
    },
    customLabel(item) {
      return item.name
    },
    handleSelect(value) {
      this.form.width = value.width
      this.form.height = value.height
      this.form.weight = value.weight
      this.form.length = value.length
      this.isDisable = true
    },
    handleSelectService(value) {
      this.form.service = value
    },
    handleRemove() {
      this.isDisable = true
      const pkg = (this.package_detail || {}).package || {}

      this.form.weight = pkg.weight
      this.form.length = pkg.length
      this.form.width = pkg.width
      this.form.height = pkg.height

      if (this.form.weight < pkg.actual_weight) {
        this.form.weight = pkg.actual_weight
      }

      if (
        this.form.width * this.form.length * this.form.height <
        pkg.actual_width * pkg.actual_length * pkg.actual_height
      ) {
        this.form.width = pkg.actual_width
        this.form.length = pkg.actual_length
        this.form.height = pkg.actual_height
      }
    },
    async handleUpdate() {
      let invalidProd = true

      const regex = new RegExp(/^[0-9]{1,4}$/)

      for (let i = 0; i < this.package_prods.length; i++) {
        this.package_prods[i].quantity = String(
          this.package_prods[i].quantity
        ).trim()

        if (
          (this.package_prods[i].product_id < 1 &&
            this.package_prods[i].quantity != '') ||
          (this.package_prods[i].quantity == '' &&
            this.package_prods[i].product_id > 0)
        ) {
          this.package_prods[i].err =
            'Vui lòng chọn SKU và nhập số lượng sản phẩm'
          invalidProd = false
          continue
        }

        if (
          (!regex.test(this.package_prods[i].quantity) ||
            this.package_prods[i].quantity < 1) &&
          this.package_prods[i].quantity != ''
        ) {
          this.package_prods[i].err = 'Số lượng sản phẩm không hợp lệ'
          invalidProd = false
          continue
        }

        this.package_prods[i].err = ''
      }

      let package_products = []

      this.package_prods
        .filter((prod) => prod.product_id > 0 && prod.err == '')
        .forEach((prod) => {
          package_products.push({
            product_id: prod.product_id,
            quantity: parseInt(prod.quantity),
          })
        })

      if (!this.valider.check(this.form) || !invalidProd) {
        return
      }
      if (Object.keys(this.validErrors).length > 0 || !invalidProd) {
        return
      }
      this.isUpdate = true

      let amount = (this.form.amount || '0').trim()
      amount = parseFloat(amount.replace(/,/g, '')).toFixed(2)

      const params = {
        id: this.currentId,
        recipient: this.form.fullname,
        phone_number: this.form.phone.trim(),
        address_1: this.form.address,
        city: this.form.city,
        state_code: this.form.state,
        zipcode: this.form.postcode,
        country_code: this.form.countrycode,
        sku: this.form.order_number,
        detail: this.form.detail,
        weight: +this.form.weight,
        width: +this.form.width,
        length: +this.form.length,
        height: +this.form.height,
        service: this.form.service.name,
        note: this.form.note,
        address_2: this.form.address2,
        amount: parseFloat(amount),
        description: this.form.description,
        include_battery: this.form.include_battery,
        is_reship: this.isReLabel,
        package_products: package_products,
        package_name: this.form.package_name,
        package_quantity: Number(this.form.package_quantity) || 0,
        product_price: parseFloat(this.form.product_price) || 0,
        custom_cn_barcode: this.form.custom_cn_barcode,
        cn_product_price: +this.form.cn_product_price,
        cn_product_link: this.form.cn_product_link,
        cn_shipping_fee: +this.form.cn_shipping_fee,
        cn_shipping_to_vn_fee: +this.form.cn_shipping_to_vn_fee,
        cn_label_extra_fee: +this.form.cn_label_extra_fee,
      }
      this.isUpdate = false
      this.$emit('submit', params)
    },

    formatAmount() {
      this.form.amount = this.toPrice(this.form.amount)
      this.validErrors = {}
    },

    inputAmount() {
      const n = this.form.amount.split('.')
      if (String(n[1]).length > 2 && n.length >= 2) {
        this.form.amount = this.form.amount.slice(0, -1)
      }
      this.fixAmount = this.form.amount

      this.validErrors = {}
      this.form.amount = String(this.form.amount).replace(/[^0-9.]/g, '')

      if (this.form.amount < 0) {
        this.validErrors.amount = 'Phí phát sinh phải >= 0'
      }

      const re = /[^0-9.,]/g

      if (re.test(this.form.amount) || n.length > 2) {
        this.validErrors.amount = 'Phí phát sinh không đúng định dạng'
      }
    },

    toNumber(amount) {
      amount = ('' + amount).trim()
      amount = amount.trim().replace(/[^0-9.,]/g, '')
      if (!amount) return 0

      amount = amount.replace(/,/g, '').replace(/^0+/g, '')
      const arr = amount.split('.')

      let number = arr[0]
      let decimal = arr[1]

      amount = decimal ? `${number}.${decimal}` : number

      if (decimal !== undefined && decimal.length >= 2) {
        amount = (Math.floor(parseFloat(amount) * 100) / 100).toFixed(2)
        decimal = amount.split('.')[1]
      }

      amount = decimal ? `${number}.${decimal}` : number
      return parseFloat(amount)
    },

    toPrice(amount) {
      amount = this.toNumber(amount)
      if (amount === 0) return ''

      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    handleAddProduct() {
      this.package_prods.push({
        product_id: 0,
        sku: 'Chọn sản phẩm',
        quantity: '',
        name: 'Tên sản phẩm',
        err: '',
      })

      this.product_sku.push({
        product_id: 0,
        sku: 'Chọn sản phẩm',
        quantity: '',
        name: 'Tên sản phẩm',
      })
    },

    handleRemoveProduct(index) {
      let i = this.products.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.products[i])
      }
      this.package_prods.splice(index, 1)
      this.product_sku.splice(index, 1)
    },

    async estimateCostHandle() {
      if (this.isUpdating || !this.currentId) return

      this.isUpdate = true
      this.feeReship = 0

      const params = {
        id: this.currentId,
        recipient: this.form.fullname.trim(),
        phone_number: this.form.phone.trim(),
        address_1: this.form.address.trim(),
        city: this.form.city.trim(),
        state_code: this.form.state.trim(),
        zipcode: this.form.postcode.trim(),
        country_code: this.form.countrycode.trim(),
        address_2: this.form.address2.trim(),
      }

      const result = await this[RESHIP_PACKAGE_ESTIMATE_COST](params)

      this.isUpdate = false

      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.feeReship = result.total_amount
    },
  },
  watch: {
    visible: function (val) {
      if (!val) {
        return
      }
      this.init()
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
