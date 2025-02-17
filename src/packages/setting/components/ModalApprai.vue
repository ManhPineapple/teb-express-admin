<template>
  <div class="modal-apprai">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Họ và tên: <span style="color: red">*</span></label
            >
            <p-input
              placeholder="Nhập họ và tên"
              v-model="user.full_name"
              @keyup.enter="handleCreate"
              :error="valider.error('full_name')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Số điện thoại: <span style="color: red">*</span></label
            >
            <p-input
              placeholder="Nhập số điện thoại"
              v-model="user.phone_number"
              @keyup.enter="handleCreate"
              :error="valider.error('phone_number')"
            />
          </div>
        </div>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Email: <span style="color: red">*</span></label
            >
            <p-input
              placeholder="Nhập email"
              v-model="user.email"
              @keyup.enter="handleCreate"
              :error="valider.error('email')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Mã số thuế:
            </label>
            <p-input
              placeholder="Nhập mã số thuế"
              v-model="user.tax_code"
              @keyup.enter="handleCreate"
              :error="valider.error('tax_code')"
            />
          </div>
        </div>

        <div class="row mb-16">
          <div class="col">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Kích thước hàng:</label
            >
            <p-input
              placeholder="Nhập kích thước hàng"
              v-model="user.volume"
              @keyup.enter="handleCreate"
              :error="valider.error('volume')"
            />
          </div>
          <div class="col">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Loại hàng:</label
            >
            <p-input
              placeholder="Nhập loại hàng"
              v-model="user.item_type"
              @keyup.enter="handleCreate"
              :error="valider.error('item_type')"
            />
          </div>
        </div>

        <div class="row mb-16">
          <div class="col">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Quy mô: <span style="color: red">*</span></label
            >
            <multiselect
              class="multiselect-custom"
              :class="{ 'input-valid': errorPackage }"
              v-model="package_user"
              :options="mapPackage"
              placeholder="Chọn quy mô"
              @select="handleSelect"
              @remove="handleRemove"
              :disabled="false"
              :custom-label="customLabel"
              :openDirection="'above'"
            ></multiselect>
            <span class="invalid-error" v-if="errorPackage"
              >Quy mô không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16">
          <div class="col">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Địa chỉ kho:</label
            >
            <p-input
              placeholder="Nhập đia chỉ kho"
              v-model="user.warehouse_address"
              @keyup.enter="handleCreate"
              :error="valider.error('warehouse_address')"
            />
          </div>
        </div>
      </template>

      <template slot="footer">
        <div>
          <span style="margin-bottom: 3px">
            <p-svg name="InfoCircle"></p-svg>
          </span>
          <b>Lưu ý:</b>
          <i
            >(<span style="color: red">*</span>) Là các trường bắt buộc nhập.</i
          >
        </div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Huỷ
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleCreate"
              :loading="loading"
            >
              Xác nhận
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import valider from '@core/valider'
import { APPRAI } from '../store/index'
import { OPTIONS_PACKAGES } from '../constants'

export default {
  name: 'ModalApprai',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Thẩm định',
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      user: {
        full_name: '',
        phone_number: '',
        email: '',
        tax_code: '',
        volume: '',
        item_type: '',
        warehouse_address: '',
        package: 0,
      },
      listUsers: [],
      loading: false,
      valider: null,
      package_user: {},
      mapPackage: OPTIONS_PACKAGES,
      errorPackage: false,
    }
  },

  created() {
    this.valider = valider.schema((y) => ({
      full_name: y.string().required('Tên không để trống'),
      email: y.string().required('Email không để trống'),
      phone_number: y.string().required('Số điện thoại không để trống'),
    }))
  },

  methods: {
    ...mapActions('setting', [APPRAI]),

    async handleCreate() {
      this.errorPackage = false
      if (!this.valider.check(this.user)) {
        return
      }

      if (parseInt(this.user.package) < 1) {
        this.errorPackage = true
        return
      }

      const payload = {}
      console.log(this.data)
      console.log(this.data.phone_number.trim())

      if (this.user.full_name.trim() != this.data.full_name) {
        payload.full_name = this.user.full_name.trim()
      }

      if (this.user.email.trim() != this.data.email) {
        payload.email = this.user.email.trim()
      }

      if (this.user.phone_number.trim() != this.data.phone_number) {
        payload.phone_number = this.user.phone_number.trim()
      }

      payload.package = parseInt(this.user.package)

      payload.tax_code = this.user.tax_code.trim()

      payload.volume = this.user.volume.trim()

      payload.item_type = this.user.item_type.trim()

      payload.warehouse_address = this.user.warehouse_address.trim()

      payload.id = this.data.id

      this.loading = true
      const res = await this.apprai(payload)
      this.loading = false

      if (!res.success) {
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      this.$emit('update:visible', false)
      this.$emit('init', true)
      this.$toast.success('Cập nhật thành công', { duration: 3000 })
    },

    customLabel(item) {
      return item.value
    },

    handleSelect(value) {
      this.user.package = value.id
    },

    handleRemove() {
      this.user.package = 0
    },

    handleClose() {
      this.valider.errors = null
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function () {
        if (this.visible) {
          this.user = Object.assign({}, this.data)
          this.package_user = this.mapPackage.find(
            (pkg) => pkg.id == this.data.package
          )
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
