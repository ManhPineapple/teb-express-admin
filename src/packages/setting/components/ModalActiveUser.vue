<template>
  <div class="modal-add-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-16">
          <div class="col-12 mb-10">
            <select-support
              class="search-type"
              :class="{ 'input-valid': errorSupport }"
              @selected="handleSelectSupport"
              @unselected="unselectedSupport"
              :optionSearch="listUsers"
              :placeHolder="'Thêm support'"
              :item="user"
            />
            <span class="custom-label">Thêm support</span>
            <span class="invalid-error" v-if="errorSupport"
              >Support không được để trống</span
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
import { CREATE_USER, UPDATE_STATUS_USER } from '../store/index'
import SelectSupport from './SelectSupport.vue'
import { ROLE_SUPPORT } from '@core/constants'
import api from '@/packages/shared/api'
import { USER_STATUS_ACTIVE } from '../constants'

export default {
  name: 'ModalActiveUser',
  components: {
    SelectSupport,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Phân quyền',
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    isRoleSupport() {
      return this.user.role == ROLE_SUPPORT
    },
  },

  data() {
    return {
      user: {
        support_id: [],
      },
      listUsers: [],
      loading: false,
      errorSupport: false,
      errorHub: false,
      statusActive: USER_STATUS_ACTIVE,
    }
  },

  created() {
    this.fetchAppraiser()
  },

  methods: {
    ...mapActions('setting', [CREATE_USER, UPDATE_STATUS_USER]),

    async fetchAppraiser() {
      let req = {
        roles: 'support,sale',
        not_limit: true,
        status: this.statusActive,
      }
      const result = await api.fetchUsersByRole(req)
      if (result && result.errorMessage) {
        this.users = []
        return
      }

      this.listUsers = result.users.map((x) => ({
        key: x.id,
        name: x.full_name + ' - ' + (x.email ? x.email : x.phone_number),
        full_name: x.full_name,
      }))
    },

    async handleCreate() {
      if (this.user.support_id.length < 1) {
        this.errorSupport = true
      }

      if (this.errorSupport) {
        return
      }

      let payload = {
        id: this.user.id,
        support_id: this.user.support_id,
      }

      this.loading = true

      const result = await this.updateStatusUser(payload)
      this.loading = false

      if (!result || result.error) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }

      this.$emit('update:visible', false)
      this.$emit('init', true)
      this.$toast.success('Phân quyền thành công', { duration: 3000 })
    },

    handleSelectSupport(value) {
      this.user.support_id.push(value)
      this.errorSupport = false
    },

    unselectedSupport(id) {
      const index = this.user.support_id.indexOf(id)
      if (index > -1) {
        this.user.support_id.splice(index, 1)
      }
      if (this.user.support_id.length < 1) {
        this.errorSupport = true
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function () {
        if (this.visible) {
          this.user = Object.assign({}, this.data)
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
