<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="mb-16 d-flex">
        <all-user
          id="search"
          class="user-resource is-fullwidth"
          :filter="query"
          :label="`Tìm theo tên khách hàng, email hoặc mã khách hàng`"
          :emitID="false"
          v-model="user"
          :search="initSearch"
          @input="init"
        />
        <p-button
          type="info"
          style="
            width: 152px;
            height: 40px;
            font-weight: 700;
            font-size: 14px;
            line-height: 20px;
            margin-left: 8px;
          "
          class="btn btn-special"
          @click="showModalInvitesCustomer"
        >
          Mời khách hàng
        </p-button>
      </div>
      <div class="card">
        <div class="card-body">
          <status-tab
            v-model="filter.status"
            :status="statusUser"
            :hasAll="false"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="users.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã khách hàng</th>
                    <th>Thông tin khách hàng</th>
                    <th width="250">Quy mô</th>
                    <th>Ngày tạo</th>
                    <th>Người mời</th>
                    <th width="300" v-if="filter.status == statusInActive"
                      >Người thẩm định</th
                    >
                    <th style="min-width: 240px; text-align: center"
                      >Thao tác</th
                    >
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td>
                      <router-link
                        v-if="!$isSupport() && !$isSale() && !$isShipPartner()"
                        class="text-no-underline"
                        :to="{
                          name: 'user-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        U{{ item.id }}
                      </router-link>
                      <p v-else> U{{ item.id }} </p>
                    </td>
                    <td class="user-fullname">
                      <p class="name">
                        <p-tooltip
                          :label="item.full_name"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.full_name.length > 25"
                        >
                          {{ truncate(item.full_name, 25) }}
                        </p-tooltip>
                      </p>
                      <p>
                        <p-tooltip
                          :label="item.email"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.email.length > 25"
                        >
                          {{ truncate(item.email, 25) }}
                        </p-tooltip>
                      </p>
                      <p v-if="showPhoneNumber">{{
                        item.phone_number || 'N/A'
                      }}</p>
                    </td>
                    <td>{{ getPackage(item.package) || 'N/A' }}</td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ item.referring_name || 'N/A' }}</td>
                    <td v-if="filter.status == statusInActive">
                      <multiselect
                        class="multiselect-custom"
                        v-model="selectedAppraiser[i]"
                        :options="appraiserOption"
                        placeholder="Chọn người"
                        @select="handleSelectAppraiser($event, i, item.id)"
                        :disabled="
                          current_user.role != role_support_leader &&
                          current_user.role != role_admin &&
                          current_user.role != role_bu_manager &&
                          current_user.role != role_ship_partner
                        "
                        :custom-label="customLabel"
                      ></multiselect>
                    </td>
                    <td style="text-align: center">
                      <a
                        v-if="filter.status == statusInActive"
                        href="#"
                        class="btn edit"
                        :class="{
                          deactive:
                            current_user.role != role_support_leader &&
                            current_user.role != role_support &&
                            current_user.role != role_sale &&
                            current_user.role != role_admin &&
                            current_user.role != role_bu_manager &&
                            current_user.role != role_ship_partner,
                        }"
                        @click="visibleModalApprai(item)"
                      >
                        Thẩm định
                      </a>
                      <a
                        v-if="
                          (current_user.role == role_admin ||
                            current_user.role == role_bu_manager) &&
                          filter.status == statusActive
                        "
                        href="#"
                        class="btn edit"
                        @click="visibleEdit(item)"
                      >
                        Sửa
                      </a>
                      <a
                        v-if="filter.status == statusActive"
                        href="#"
                        class="btn edit"
                        :class="{
                          deactive:
                            current_user.role != role_support_leader &&
                            current_user.role != role_admin &&
                            current_user.role != role_bu_manager &&
                            current_user.role != role_ship_partner,
                        }"
                        @click="visibleRole(item)"
                      >
                        Phân quyền
                      </a>
                      <a
                        v-if="
                          current_user.role != role_support &&
                          current_user.role != role_sale
                        "
                        href="#"
                        class="btn"
                        :class="{
                          lock: item.status == statusActive,
                          edit: item.status != statusActive,
                        }"
                        @click.prevent="visibleModal(item)"
                      >
                        {{ textButton(item.status) }}
                      </a>
                    </td>
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
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="visibleConfirmLock"
      :actionConfirm="`Xác nhận`"
      :cancel="`Bỏ qua`"
      :description="`Tài khoản '${item.full_name}' sẽ bị khóa.`"
      :description_1="`Bạn có chắc chắn muốn khóa tài khoản này?`"
      :title="`Khóa tài khoản`"
      :type="'danger'"
      @action="handleUpdateStatus(item)"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmUnlock"
      :actionConfirm="`Xác nhận`"
      :cancel="`Bỏ qua`"
      :description="`Tài khoản '${item.full_name}' sẽ được kích hoạt.`"
      :description_1="`Bạn có chắc chắn muốn kích hoạt tài khoản này?`"
      :title="`Kích hoạt tài khoản`"
      @action="handleUpdateStatus(item)"
    ></modal-confirm>

    <modal-active-user
      :visible.sync="isVisibleModalActiveUser"
      :data="apprai_user"
      @init="init"
    ></modal-active-user>
    <modal-apprai
      :visible.sync="isVisibleApprai"
      v-if="isVisibleApprai"
      :data="apprai_user"
      @init="init"
    >
    </modal-apprai>
    <modal-invite-customer
      :visible.sync="visibleModalInvite"
    ></modal-invite-customer>
    <modal-add-user
      :visible.sync="visibleModalEditUser"
      v-if="visibleModalEditUser"
      :data="user"
      :isEditCustomer="true"
      @init="init"
    >
    </modal-add-user>
  </div>
</template>
<script>
import AllUser from '@/components/shared/resource/AllUser'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_SALE,
  ROLE_SUPPORT,
  ROLE_SUPPORT_LEADER,
  ROLER_BUSSINESS_MANAGER,
  ROLER_SHIP_PARTNER,
} from '@core/constants'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { cloneDeep } from '@core/utils'
import { truncate } from '@core/utils/string'
import { mapActions, mapState } from 'vuex'
import ModalActiveUser from '../components/ModalActiveUser'
import ModalAddUser from '../components/ModalAddUser.vue'
import ModalApprai from '../components/ModalApprai'
import ModalInviteCustomer from '../components/ModalInviteCustomer'
import {
  CUSTOMER_STATUS_TAB,
  OPTIONS_PACKAGES,
  USER_STATUS_ACTIVE,
  USER_STATUS_DEACTIVE,
  USER_STATUS_INACTIVE,
} from '../constants'
import {
  APPRAI,
  LIST_APPRAISER,
  LIST_USER,
  UPDATE_STATUS_USER,
} from '../store/index'

export default {
  name: 'Debt',
  mixins: [mixinRoute, mixinTable],
  components: {
    ModalInviteCustomer,
    EmptySearchResult,
    AllUser,
    ModalConfirm,
    ModalApprai,
    ModalActiveUser,
    ModalAddUser,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 2,
      },
      isFetching: false,
      statusUser: CUSTOMER_STATUS_TAB,
      user: null,
      statusDeactive: USER_STATUS_DEACTIVE,
      statusActive: USER_STATUS_ACTIVE,
      statusInActive: USER_STATUS_INACTIVE,
      visibleConfirmLock: false,
      visibleConfirmUnlock: false,
      visibleModalInvite: false,
      visibleModalEditUser: false,
      cloneUsers: [],
      isVisibleApprai: false,
      apprai_user: null,
      appraiserOption: [],
      selectedAppraiser: [],
      item: { full_name: '' },
      mapPackage: OPTIONS_PACKAGES,
      role_support: ROLE_SUPPORT,
      role_sale: ROLE_SALE,
      role_support_leader: ROLE_SUPPORT_LEADER,
      role_admin: ROLE_ADMIN,
      role_bu_manager: ROLER_BUSSINESS_MANAGER,
      role_ship_partner: ROLER_SHIP_PARTNER,
      isVisibleModalActiveUser: false,
      query: {},
      initSearch: '',
      firstLoad: false,
    }
  },
  async created() {
    if (this.$route.query.search) {
      this.initSearch = this.$route.query.search
    }
    this.filter = this.getRouteQuery()
    this.firstLoad = true
    await this.init()
    this.firstLoad = false
  },
  computed: {
    ...mapState('setting', {
      users: (state) => state.users,
      appraisers: (state) => state.appraisers,
      count: (state) => state.count_user,
    }),
    ...mapState('auth', {
      current_user: (state) => state.user,
    }),
    showPhoneNumber() {
      return this.$isAdmin() || this.$isSupport()
    },
  },
  methods: {
    truncate,
    ...mapActions('setting', [
      LIST_USER,
      LIST_APPRAISER,
      UPDATE_STATUS_USER,
      APPRAI,
    ]),

    async init() {
      this.apprai_user = null
      this.filter.search = this.user ? this.user.email : ''
      if (this.firstLoad && this.initSearch) {
        this.filter.search = this.initSearch
      }
      if (this.isFetching) {
        return
      }

      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.query = {}
      this.query.role = ROLE_CUSTOMER
      if (this.$isSupport() || this.$isSale()) {
        this.statusUser = { 'Chờ kích hoạt': 2 }
        this.query.appraiser_id = this.current_user.id
      }
      const filter = Object.assign(this.query, this.filter)
      const result = await this.listUser(filter)
      if (!result.success) {
        this.$toast.error(result.message)
      }

      let payload = {
        role: 'appraiser',
        not_limit: true,
        status: this.statusActive,
      }

      const result2 = await this.listAppraiser(payload)

      if (!result2.success) {
        this.$toast.open({ message: result2.message, type: 'error' })
      }
      this.isFetching = false
      this.cloneUsers = cloneDeep(this.users)

      this.selectedAppraiser = []
      for (let i = 0; i < this.cloneUsers.length; i++) {
        this.selectedAppraiser.push({
          full_name:
            this.cloneUsers[i].appraiser_name != ''
              ? this.cloneUsers[i].appraiser_name
              : !this.cloneUsers[i].is_customer_refer
              ? 'Chọn người'
              : '',
        })

        this.selectedAppraiser[i].id = this.cloneUsers[i].appraiser_id
      }

      this.appraiserOption = []
      for (let i = 0; i < this.appraisers.length; i++) {
        this.appraiserOption.push({
          full_name: this.appraisers[i].full_name,
          id: this.appraisers[i].id,
        })
      }
      return this.appraiserOption
    },
    showModalInvitesCustomer() {
      this.visibleModalInvite = true
    },
    getPackage(i) {
      let a = this.mapPackage.find((pkg) => pkg.id == i)
      return a ? a.value : 'N/A'
    },

    textButton(status) {
      switch (status) {
        case this.statusInActive:
          return `Kích hoạt`
        case this.statusActive:
          return `Khóa tài khoản`
        case this.statusDeactive:
          return `Mở tài khoản`
        default:
          return null
      }
    },

    visibleModal(item) {
      if (item.status == this.statusActive) {
        this.visibleConfirmLock = true
      } else this.visibleConfirmUnlock = true
      this.item = item
    },

    visibleEdit(item) {
      this.user = item
      this.visibleModalEditUser = true
    },

    visibleRole(item) {
      this.apprai_user = cloneDeep(item)
      this.isVisibleModalActiveUser = true
    },

    async handleUpdateStatus(item) {
      let payload = {
        id: item.id,
        status: item.status == this.statusActive ? 0 : 1,
      }

      const result = await this.updateStatusUser(payload)
      this.visibleConfirmLock = false
      this.visibleConfirmUnlock = false

      if (!result || result.error) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      await this.init()
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật thành công',
        duration: 3000,
      })
    },

    customLabel(item) {
      return item.full_name
    },

    async handleSelectAppraiser(value, index, user_id) {
      const payload = {}

      let appraiser_id

      if (this.cloneUsers[index].appraiser_id != value.id) {
        appraiser_id = value.id
      }

      payload.id = user_id
      payload.appraiser_id = appraiser_id

      const res = await this.apprai(payload)

      if (!res.success) {
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      this.$toast.success('Cập nhật thành công', { duration: 3000 })
    },

    visibleModalApprai(item) {
      this.apprai_user = item
      this.isVisibleApprai = true
    },
  },
  watch: {
    'filter.page': {
      handler: function () {
        if (this.firstLoad) {
          return
        }
        this.init()
      },
      deep: true,
    },
    'filter.status': {
      handler: function () {
        if (this.firstLoad) {
          return
        }
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.table-hover {
  tr th {
    white-space: nowrap;
    padding: 0 8px;
  }

  tr td {
    padding: 12px 8px;
  }

  .user-fullname {
    p {
      font-weight: 400;
      line-height: 20px;
      font-size: 14px;
      margin-bottom: 0;
      color: #313232;

      &.name {
        font-weight: 600;
      }
    }
  }
}
</style>
