<template>
  <div class="modal-add-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5">Tên:</label>
            <p-input
              placeholder="Nhập tên"
              v-model="user.full_name"
              @keyup.enter="handleSubmit"
              :error="valider.error('full_name')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >SlackID:</label
            >
            <p-input
              placeholder="Nhập Slack ID"
              v-model="user.slack_id"
              @keyup.enter="handleSubmit"
            />
          </div>
        </div>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Tài khoản:</label
            >
            <p-input
              placeholder="Nhập tài khoản"
              v-model="user.email"
              @keyup.enter="handleSubmit"
              :error="valider.error('email')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Mật khẩu:</label
            >
            <p-input
              placeholder="Nhập mật khẩu"
              type="password"
              hiddenPass="on"
              v-model="user.password"
              @keyup.enter="handleSubmit"
              :error="valider.error('password')"
            />
          </div>
        </div>

        <div class="row mb-16" v-if="!isEditCustomer">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Quyền:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorRole }"
              @selected="handleSelectRole"
              @unselected="handleRemoveRole"
              :optionSearch="roles"
              :placeHolder="'Quyền'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorRole"
              >Quyền không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleWarehouse || isRoleSale">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Kho:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorWarehouse }"
              @selected="handleSelectWarehouse"
              @unselected="handleRemoveWarehouse"
              :optionSearch="displayWarehouses"
              :placeHolder="'Chọn kho'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorWarehouse"
              >Kho không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleHub">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Hub:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorHub }"
              @selected="handleSelectWarehouse"
              @unselected="handleRemoveWarehouse"
              :optionSearch="hubs"
              :placeHolder="'Chọn hub'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorHub"
              >Hub không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleSupport && !user.support_id">
          <div class="col-12 mb-10">
            <select-customer
              class="search-type"
              :class="{ 'input-valid': errorCustomer }"
              @selected="handleSelectCustomer"
              @unselected="unselectedCustomer"
              :optionSearch="listUsers"
              :placeHolder="'Thêm khách hàng'"
              :item="user"
            />
            <span class="custom-label">Thêm khách hàng</span>
            <span class="invalid-error" v-if="errorCustomer"
              >Khách hàng không được để trống</span
            >
          </div>
        </div>
        <div class="row mb-16" v-if="isRoleSupport">
          <div class="col-12 mb-10">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Chuyển support:</label
            >
            <UserResource
              :value="user.support_id"
              label="Chọn support mới"
              class="user-resource is-fullwidth"
              :emit-id="true"
              :filter="{
                roles: $isBusinessManager() ? 'sale' : 'support,sale',
                not_in: user.id ? `${user.id}` : '',
              }"
              @input="changeSupportHandle"
            />

            <DualListbox
              class="mt-3"
              v-if="user.support_id"
              :options="customers"
              v-model="user.customer_swap"
              :custom-label="({ name }) => name"
              track-by="id"
            />
            <i
              style="
                font-size: 12px;
                color: #aaabab;
                line-height: 16px;
                margin-top: 8px;
              "
              >* Sau khi nhấn nút Lưu, danh sách khách hàng trên sẽ chuyển sang
              support mới quản lý</i
            >
          </div>
        </div>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Huỷ
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleSubmit"
              :loading="loading"
            >
              {{ data.id ? 'Sửa' : 'Tạo' }}
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import {
  ROLE_HUB,
  ROLE_SALE,
  ROLE_SUPPORT,
  ROLE_WAREHOUSE,
} from '@core/constants'
import valider from '@core/valider'
import { mapActions } from 'vuex'
import { CREATE_USER, UPDATE_USER } from '../store/index'
import SelectCustomer from './SelectCustomer.vue'
import SelectRole from './SelectRole.vue'

import api from '@/packages/shared/api'
import { cloneDeep } from '@core/utils'
import DualListbox from '../../../components/shared/DualListbox.vue'
import UserResource from '../../../components/shared/resource/UsersActive.vue'
import { HUB_TYPE, ROLE, WAREHOUSE_TYPE } from '../constants'

export default {
  name: 'ModalAddUser',
  components: {
    SelectRole,
    SelectCustomer,
    DualListbox,
    UserResource,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
    isEditCustomer: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isRoleHub() {
      return this.user.role == ROLE_HUB
    },
    isRoleSupport() {
      return this.user.role == ROLE_SUPPORT || this.user.role == ROLE_SALE
    },
    isRoleSale() {
      return this.user.role == ROLE_SALE
    },
    isRoleWarehouse() {
      return this.user.role == ROLE_WAREHOUSE
    },
    displayWarehouses() {
      if (!this.isRoleWarehouse && !this.isRoleSale) return []
      return this.warehouses
        .filter(({ type }) => type == WAREHOUSE_TYPE)
        .map(({ id, name }) => ({ key: id, name }))
    },
    hubs() {
      if (!this.isRoleHub) return []

      return this.warehouses
        .filter(({ type }) => type == HUB_TYPE)
        .map(({ id, name }) => ({ key: id, name }))
    },
    roles() {
      if (this.$isBusinessManager()) {
        return ROLE.filter(({ key }) => key == ROLE_SALE)
      }

      return ROLE
    },
    title() {
      return this.data.id > 0
        ? `Chỉnh sửa thông tin “${this.data.full_name}”`
        : 'Thêm quản lý'
    },
    customers() {
      return this.listUsers
        .map(({ id, full_name }) => ({ id, name: full_name }))
        .filter(({ id }) => this.user.customer_id.includes(id))
    },
  },

  data() {
    return {
      user: {
        full_name: '',
        role: '',
        email: '',
        password: '',
        warehouse_id: 0,
        customer_id: [],
        slack_id: '',
        support_id: 0,
        customer_swap: [],
      },
      tempCustomerIDs: [],
      listUsers: [],
      loading: false,
      valider: null,
      errorRole: false,
      errorWarehouse: false,
      errorCustomer: false,
      errorHub: false,
    }
  },

  created() {
    this.tempCustomerIDs = cloneDeep(this.user.customer_id)
    this.valider = valider.schema((y) => ({
      full_name: y.string().required('Tên không để trống'),
      role: y.string().required('Quyền không để trống'),
      email: y.string().required('Email không để trống'),
      password: this.data.id
        ? ''
        : y.string().required('Password không để trống'),
    }))
    this.fetchCustomer()
  },

  methods: {
    ...mapActions('setting', [CREATE_USER, UPDATE_USER]),

    async fetchCustomer() {
      let req = {
        role: 'customer',
        search: '',
        not_limit: true,
        status: 1,
        tester: this.$route.query.tester
          ? parseInt(this.$route.query.tester)
          : 0,
      }
      const result = await api.fetchUsersByRole(req)
      if (result && result.errorMessage) {
        this.listUsers = []
        return
      }

      this.listUsers = result.users.map((x) => ({
        id: x.id,
        key: x.id,
        name: x.full_name + ' - ' + (x.email ? x.email : x.phone_number),
        full_name: x.full_name,
      }))
    },

    async handleSubmit() {
      if (!this.user.role) {
        this.errorRole = true
      }

      if (
        this.isRoleSupport &&
        this.user.customer_id.length < 1 &&
        this.listUsers.length < 1
      ) {
        this.errorCustomer = true
      }

      if (
        (this.isRoleWarehouse || this.isRoleSale) &&
        this.user.warehouse_id < 1
      ) {
        this.errorWarehouse = true
      }

      if (this.isRoleHub && this.user.warehouse_id < 1) {
        this.errorHub = true
      }

      if (!this.valider.check(this.user)) {
        return
      }

      if (
        this.errorRole ||
        this.errorWarehouse ||
        this.errorCustomer ||
        this.errorHub
      ) {
        return
      }

      const payload = {
        full_name: this.user.full_name.trim(),
        password: this.user.password ? this.user.password.trim() : '',
        role: this.user.role,
        slack_id: this.user.slack_id,
        customer_id: this.user.customer_id,
        support_id: this.user.support_id,
        customer_swap: this.user.customer_swap,
      }

      if (this.user.email.includes('@')) {
        payload.email = this.user.email.trim().toLowerCase()
      } else {
        payload.phone_number = this.user.email.trim()
      }

      if (payload.email == this.data.email) {
        payload.email = ''
      }

      if (payload.phone_number == this.data.phone_number) {
        payload.phone_number = ''
      }

      if (payload.slack_id == this.data.slack_id) {
        payload.slack_id = ''
      }

      if (
        this.user.role == ROLE_WAREHOUSE ||
        this.user.role == ROLE_HUB ||
        this.user.role == ROLE_SALE
      ) {
        payload.warehouse_id = this.user.warehouse_id
      }

      this.loading = true

      let res = null
      if (this.user.id > 0) {
        payload.id = this.user.id
        res = await this[UPDATE_USER](payload)
      } else {
        res = await this.createUser(payload)
      }

      this.loading = false

      if (!res.success) {
        const message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message
        this.$toast.error(message, { duration: 3000 })
        return
      }

      this.$emit('update:visible', false)
      this.$emit('init', true)
      this.$toast.success('Thêm thành công', { duration: 3000 })
    },

    handleSelectRole(value) {
      this.$set(this.user, 'role', value)
      this.$set(this.user, 'warehouse_id', '')
      this.$set(this.user, 'customer_id', [])
      if (this.isRoleSupport) {
        this.user.customer_id = this.user.customer_id.concat(
          this.tempCustomerIDs
        )
      }
      this.errorRole = false
    },

    handleRemoveRole() {
      this.$set(this.user, 'role', '')
      this.errorRole = true
    },

    handleSelectWarehouse(value) {
      this.$set(this.user, 'warehouse_id', value)
      this.errorWarehouse = false
      this.errorHub = false
    },

    handleRemoveWarehouse() {
      this.$set(this.user, 'warehouse_id', 0)
      this.errorWarehouse = true
      this.errorHub = true
    },

    handleSelectCustomer(value) {
      this.user.customer_id.push(value)
      this.errorCustomer = false
    },

    unselectedCustomer(id) {
      const index = this.user.customer_id.indexOf(id)
      if (index > -1) {
        this.user.customer_id.splice(index, 1)
      }
      if (this.user.customer_id.length < 1) {
        this.errorCustomer = true
      }
    },

    handleClose() {
      this.valider.errors = null
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },

    changeSupportHandle(val) {
      this.user.support_id = val
      this.user.customer_swap = [...this.user.customer_id]
    },
  },
  watch: {
    visible: {
      handler: function () {
        if (this.visible) {
          this.user = cloneDeep(this.data)
          this.user.support_id = 0
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
