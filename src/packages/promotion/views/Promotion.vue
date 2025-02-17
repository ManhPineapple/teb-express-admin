<template>
  <div class="pages promotion setting-account">
    <div class="d-flex jc-sb mb-16">
      <div class="search-input d-flex">
        <search-promotion
          id="search"
          class="user-resource is-fullwidth mb-2"
          :filter="filter"
          :label="`Tìm kiếm promotion`"
          v-model="filter.search"
          @input="init"
        />
      </div>
      <p-button
        type="info"
        class="ml-8 add-user"
        v-if="$isAdmin() || $isMarketing() || $isBusinessManager()"
        @click="showModalCreateHandle"
      >
        Tạo mới
      </p-button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <status-tab :status="statusTab" v-model="filter.status"></status-tab>
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="listPromotions.length > 0">
            <div class="table-responsive">
              <table class="table table-hover table-promotion">
                <thead>
                  <tr class="list__product-title">
                    <th>#</th>
                    <th>PROMOTION</th>
                    <th>Người tạo</th>
                    <th>TRẠNG THÁI</th>
                    <th>LOẠI</th>
                    <th>NGÀY TẠO</th>
                    <th class="text-left">THAO TÁC</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in promotions" :key="item.id">
                    <td>#{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.create_by }}</td>
                    <td :class="item.status_class">{{ item.status_text }}</td>
                    <td>{{ item.type_text }}</td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td class="text-left btn-action">
                      <a
                        @click.prevent="showModalDescriptionHandle(item)"
                        href="#"
                      >
                        <p-svg name="eye" stroke="black"></p-svg>
                      </a>
                      <a
                        href="#"
                        v-if="!$isMarketing()"
                        @click.prevent="loadDetailPromotion(item)"
                      >
                        <p-svg
                          name="users"
                          :stroke="item.add_user_style"
                        ></p-svg>
                      </a>
                      <a
                        v-if="item.is_edit"
                        href="#"
                        @click.prevent="showUpdatePromotion(item)"
                      >
                        <p-svg name="edit-3" :stroke="item.edit_style"></p-svg>
                      </a>
                      <p-button
                        v-if="$isAdmin() || $isBusinessManager()"
                        :type="typeBtn(item.status)"
                        class="btn-detail ml-15 btn-promotion"
                        @click="visibleModal(item)"
                      >
                        {{ textBtn(item.status) }}
                      </p-button>
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
    <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Xác nhận`"
      :cancel="`Bỏ qua`"
      :description="description"
      :title="title"
      :type="type"
      @action="updateStatusPromotion(item)"
    ></modal-confirm>
    <modal-append-promotion
      :visible.sync="visibleModalAppend"
      :data="item"
      :tester="tester"
      @save="handleAppendPromotion"
    >
    </modal-append-promotion>
    <modal-description
      :visible.sync="isVisibleModalDescription"
      :current="item"
    ></modal-description>
    <modal-form
      :current="item"
      :visible.sync="isVisibleModalCreate"
      @on-submitted="onCreatedOrUpdateHandle"
    >
    </modal-form>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import {
  FETCH_PROMOTIONS,
  UPDATE_PROMOTION,
  APPEND_USER_TO_PROMOTION,
} from '../store/index'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import ModalAppendPromotion from '../components/ModalAppendPromotion.vue'
import SearchPromotion from '../components/SearchPromotion.vue'
import ModalDescription from '../components/ModalDescription.vue'
import ModalForm from '../components/ModalForm.vue'
import {
  PROMOTION_TYPE_MARKETING,
  MAP_PROMOTION_STATUS_TEXT,
  MAP_PROMOTION_STATUS_CLASS,
  PROMOTION_STATUS_TABS,
  PROMOTION_STATUS_ACTIVE,
  PROMOTION_STATUS_DEACTIVATE,
} from '../constants'

const PROMOTION_PRICE_BY_WEIGHT_ID =
  process.env.VUE_APP_PROMOTION_PRICE_BY_WEIGHT_ID

export default {
  name: 'ListPromotion',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalConfirm,
    ModalAppendPromotion,
    SearchPromotion,
    ModalDescription,
    ModalForm,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 0,
      },
      isFetching: false,
      product: {},
      visibleConfirm: false,
      visibleModalAppend: false,
      isVisibleModalDescription: false,
      isVisibleModalCreate: false,
      description: '',
      title: '',
      type: '',
      item: {},
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
      statusTab: PROMOTION_STATUS_TABS,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.init()
  },
  computed: {
    ...mapState('promotion', {
      count: (state) => state.count,
      listPromotions: (state) => state.promotions,
    }),
    promotions() {
      return this.listPromotions.map((item) => {
        return {
          ...item,
          create_by: item.user
            ? item.user.full_name
              ? `${item.user.full_name} - ${item.user.email}`
              : item.user.email
            : 'System',
          disabled_btn_accept:
            this.$isMarketing() ||
            (item.type == PROMOTION_TYPE_MARKETING &&
              (this.$isAdmin() || this.$isBusinessManager())),
          type_text:
            item.type == PROMOTION_TYPE_MARKETING ? 'Marketing' : 'System',
          status_text: MAP_PROMOTION_STATUS_TEXT[item.status] || 'Unknown',
          status_class:
            MAP_PROMOTION_STATUS_CLASS[item.status] || 'text-secondary',
          add_user_style:
            item.status != PROMOTION_STATUS_ACTIVE ? 'gray' : 'black',
          is_edit:
            this.$isAdmin() || this.$isMarketing() || this.$isBusinessManager(),
          edit_style: item.status != PROMOTION_STATUS_ACTIVE ? 'black' : 'gray',
        }
      })
    },
  },
  methods: {
    ...mapActions('promotion', [
      FETCH_PROMOTIONS,
      UPDATE_PROMOTION,
      APPEND_USER_TO_PROMOTION,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this.fetchPromotions(this.filter)
      this.isFetching = false

      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
      }
    },
    visibleModal(item) {
      this.item = item
      if (item.status == 1) {
        this.description = 'Xác nhận disable promotion?'
        this.type = 'danger'
        this.title = 'Disable promotion'
        this.visibleConfirm = true
        return
      }

      this.description = 'Xác nhận active promotion?'
      this.type = 'info'
      this.title = 'Active promotion'
      this.visibleConfirm = true
    },

    async updateStatusPromotion(item) {
      let payload = {
        id: item.id,
        status: item.status == 1 ? 2 : 1,
      }

      let result = await this.updatePromotion(payload)
      this.visibleConfirm = false

      if (!result || result.error) {
        return this.$toast.error(result.message, { duration: 3000 })
      }

      await this.init()
      this.$toast.success('Cập nhật thành công', { duration: 3000 })
    },

    async handleAppendPromotion(payload) {
      let result = await this.appendUserToPromotion(payload)
      this.visibleModalAppend = false

      if (!result || result.error) {
        return this.$toast.error(result.message, { duration: 3000 })
      }

      await this.init()
      this.$toast.success('Cập nhật thành công', { duration: 3000 })
    },

    loadDetailPromotion(item) {
      if (item.status != PROMOTION_STATUS_ACTIVE) return

      this.item = item
      this.visibleModalAppend = true
    },
    textBtn(status) {
      return status == PROMOTION_STATUS_DEACTIVATE
        ? 'Active'
        : status == PROMOTION_STATUS_ACTIVE
        ? 'Disable'
        : 'Phê duyệt'
    },
    typeBtn(status) {
      return status == PROMOTION_STATUS_ACTIVE ? 'danger' : 'info'
    },
    showModalDescriptionHandle(item) {
      this.item = item
      this.isVisibleModalDescription = true
    },
    showModalCreateHandle() {
      this.item = {}
      this.isVisibleModalCreate = true
    },
    onCreatedOrUpdateHandle() {
      this.isVisibleModalCreate = false
      this.init()
    },
    showUpdatePromotion(item) {
      if (
        item.status == PROMOTION_STATUS_ACTIVE &&
        item.id == PROMOTION_PRICE_BY_WEIGHT_ID
      )
        return

      this.item = item
      this.isVisibleModalCreate = true
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
<style lang="scss">
.promotion {
  .Active {
    color: #48be78;
  }

  .Disable {
    color: #da1e28;
  }
}

.table-promotion {
  tbody tr td {
    padding: 10px 5px 0;

    p {
      margin-bottom: 0;
    }
  }

  .btn-action {
    a + a,
    a + button {
      margin-left: 10px;
    }
  }
}

td .btn-promotion {
  width: 85px;
  text-align: center;
}
</style>
