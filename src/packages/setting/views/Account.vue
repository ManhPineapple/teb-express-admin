<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-16">
        <div class="search-input d-flex">
          <p-input
            placeholder="Tìm theo tên/email"
            prefixIcon="search"
            type="search"
            :clearable="true"
            @input="checkClearSearch"
            v-model="keywordSearch"
            @keyup.enter="handleSearch"
          >
          </p-input>

          <select-role
            class="search-type ml-8"
            @selected="handleSearchRole"
            @unselected="handleRemoveSearch"
            :optionSearch="filterRole"
            :item="filter"
            :placeHolder="'Quyền'"
          />
        </div>
        <p-button
          type="info"
          class="ml-8 add-user"
          @click="visibleModalAddUser({})"
        >
          Thêm quản lý
        </p-button>
      </div>
      <div class="card">
        <div class="card-body">
          <status-tab v-model="filter.status" :status="statusUser" />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="users.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="200">Tên</th>
                    <th width="200">Email/SĐT</th>
                    <th width="150">Trạng thái</th>
                    <th width="100">Ngày tạo</th>
                    <th width="100">Quyền</th>
                    <th width="180"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td :class="{ deactive: !checkActive(item.status) }">
                      <p-tooltip
                        :label="item.full_name"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.full_name.length > 25"
                      >
                        {{ truncate(item.full_name, 25) }}
                      </p-tooltip>
                    </td>
                    <td :class="{ deactive: !checkActive(item.status) }">
                      <p-tooltip
                        :label="item.email"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.email.length > 25"
                      >
                        {{ truncate(item.email, 25) || item.phone_number }}
                      </p-tooltip>
                    </td>
                    <td :class="{ deactive: !checkActive(item.status) }">
                      <span class="d-flex"
                        ><i
                          class="fa fa-circle"
                          :class="
                            checkActive(item.status) ? 'active' : 'deactive'
                          "
                        ></i
                        >{{
                          checkActive(item.status)
                            ? 'Hoạt động'
                            : 'Không hoạt động'
                        }}</span
                      >
                    </td>
                    <td :class="{ deactive: !checkActive(item.status) }">{{
                      item.created_at | date('dd/MM/yyyy')
                    }}</td>
                    <td :class="{ deactive: !checkActive(item.status) }">
                      {{ mapRole(item.role).name }}
                    </td>
                    <td style="text-align: center">
                      <span :class="{ deactive: !checkActive(item.status) }">
                        <a
                          href="#"
                          class="btn edit"
                          @click="visibleModalAddUser(item)"
                          :class="{ deactive: !checkActive(item.status) }"
                          >Sửa</a
                        >
                      </span>
                      <a
                        href="#"
                        class="btn"
                        :class="checkActive(item.status) ? 'lock' : 'unlock'"
                        @click="actionUpdateStatus(item)"
                        >{{ checkActive(item.status) ? 'Khóa' : 'Mở' }}</a
                      >
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
      :visible.sync="isVisibleConfirmStatus"
      v-if="isVisibleConfirmStatus"
      :actionConfirm="actions.status.button"
      :description="actions.status.Description"
      :title="actions.status.title"
      :type="actions.status.type"
      @action="handleUpdateStatus(item)"
    >
    </modal-confirm>
    <modal-confirm
      :visible.sync="isVisibleConfirmRole"
      v-if="isVisibleConfirmRole"
      :actionConfirm="actions.role.button"
      :description="actions.role.Description"
      :title="actions.role.title"
      :type="actions.role.type"
      @action="handleUpdateRole(role, id)"
      @close="init"
    >
    </modal-confirm>
    <modal-add-user
      :visible.sync="isVisibleAddUser"
      v-if="isVisibleAddUser"
      :data="user"
      :warehouses="wareHouses"
      @init="init"
    >
    </modal-add-user>
  </div>
</template>
<script>
import StatusTab from '../components/StatusTab.vue'
import SelectRole from '../components/SelectRole.vue'
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import { ROLE_SALE } from '@core/constants'

import {
  USER_STATUS_TAB,
  USER_STATUS_DEACTIVE,
  USER_STATUS_ACTIVE,
  ROLE,
} from '../constants'
import {
  LIST_USER,
  CREATE_USER,
  UPDATE_STATUS_USER,
  UPDATE_ROLE_USER,
} from '../store/index'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import ModalAddUser from '../components/ModalAddUser'
import { FETCH_WAREHOUSE } from '../../shared/store'

import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'Account',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    StatusTab,
    SelectRole,
    ModalConfirm,
    ModalAddUser,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        role: '',
      },
      keywordSearch: '',
      actions: {
        status: {
          title: 'Cập nhật trạng thái',
        },
        role: {
          title: 'Phân quyền',
        },
      },
      isVisibleConfirmStatus: false,
      isVisibleConfirmRole: false,
      isVisibleAddUser: false,
      isFetching: false,
      statusDeactive: USER_STATUS_DEACTIVE,
      statusActive: USER_STATUS_ACTIVE,
      // filterRole: ROLE,
      statusUser: USER_STATUS_TAB,
      user: {},
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('setting', {
      users: (state) => state.users,
      count: (state) => state.count_user,
    }),
    ...mapState('shared', {
      wareHouses: (state) => state.wareHouses,
    }),
    filterRole() {
      if (this.$isBusinessManager()) {
        return ROLE.filter(({ key }) => key == ROLE_SALE)
      }
      return ROLE
    },
  },
  methods: {
    truncate,
    ...mapActions('setting', [
      LIST_USER,
      CREATE_USER,
      UPDATE_STATUS_USER,
      UPDATE_ROLE_USER,
    ]),
    ...mapActions('shared', [FETCH_WAREHOUSE]),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let req = { status: 1 }

      const [result, result2] = await Promise.all([
        this.listUser(this.filter),
        this[FETCH_WAREHOUSE](req),
      ])
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      if (!result2.success) {
        this.$toast.open({ message: result2.message, type: 'error' })
      }
      this.isFetching = false
    },
    checkActive(status) {
      return status == this.statusActive ? true : false
    },

    handleSearchRole(value) {
      this.filter.role = value
    },

    handleRemoveSearch() {
      this.filter.role = ''
    },
    actionUpdateStatus(item) {
      if (item.status == this.statusActive) {
        this.actions.status.button = 'Khóa'
        this.actions.status.Description =
          'Bạn có chắc chắn muốn khóa người dùng này?'
        this.actions.status.type = 'danger'
      } else {
        this.actions.status.button = 'Mở'
        this.actions.status.Description =
          'Bạn có chắc chắn muốn mở khóa người dùng này?'
        this.actions.status.type = 'success'
      }

      this.isVisibleConfirmStatus = true
      this.item = item
    },
    async handleUpdateStatus(item) {
      let payload = {
        id: item.id,
        status: item.status == this.statusActive ? 0 : 1,
      }

      const result = await this.updateStatusUser(payload)
      this.isVisibleConfirmStatus = false

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

    actionUpdateRole(role, item) {
      this.roleName = this.filterRole.find((item) => item.key == role)
      this.actions.role.button = 'Phân quyền'
      this.actions.role.Description = `Bạn có chắc chắn muốn phân quyền <b>${this.roleName.name}</b> cho người dùng này?`

      this.isVisibleConfirmRole = true
      this.role = role
      this.id = item.id
    },

    async handleUpdateRole(role, id) {
      let payload = {
        id: id,
        role: role,
      }

      const result = await this.updateRoleUser(payload)
      this.isVisibleConfirmRole = false

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

    visibleModalAddUser(item) {
      this.user = item
      this.isVisibleAddUser = true
    },

    mapRole(role) {
      return ROLE.find((x) => x.key == role)
    },
  },
  watch: {
    filter: {
      handler: function () {
        if (this.isFetching) {
          return
        }
        this.init()
      },
      deep: true,
    },
  },
}
</script>
