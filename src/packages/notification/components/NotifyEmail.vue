<template>
  <div class="list-notify-emails">
    <div class="page-content">
      <div class="d-flex jc-sb mb-16">
        <p-input
          :placeholder="`Tìm theo tiêu đề/người gửi`"
          prefixIcon="search"
          type="search"
          :value="filter.search"
          @keyup.enter="handleSearch"
          class="mr-8"
        >
        </p-input>
        <p-button
          type="info"
          class="btn-create-noti"
          @click="showCreateNotifyModal"
        >
          <svgicon name="plus" class="text-white" />
          Tạo thông báo
        </p-button>
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="notifies.length">
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover table-notify-emails">
                <thead>
                  <tr>
                    <th class="text-left" style="width: 30%">Tiêu đề</th>
                    <th class="text-left" width="250">người gửi</th>
                    <th class="text-left" width="250">Thời gian tạo</th>
                    <th class="text-left" width="250">Thời gian gửi</th>
                    <th class="text-left" width="120">Trạng thái</th>
                    <th width="200"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in notifies" :key="i">
                    <td class="text-left title_colum">
                      <p-tooltip
                        :label="item.title"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                      >
                        <b>
                          {{ item.title }}
                        </b>
                      </p-tooltip>
                    </td>
                    <td class="text-left">{{
                      item.sender ? item.sender.full_name : 'N/A'
                    }}</td>
                    <td class="text-left">{{
                      item.created_at | datetime('dd/MM/yyyy - HH:mm:ss')
                    }}</td>
                    <td class="text-left">
                      <template v-if="item.sent_at">
                        {{ item.sent_at | datetime('dd/MM/yyyy - HH:mm:ss') }}
                      </template>
                      <div v-else>N/A</div>
                    </td>
                    <td
                      class="text-left"
                      v-html="getStatusNotify(item.status)"
                    ></td>
                    <td class="text-right">
                      <p-button
                        type="info"
                        class="btn-send"
                        @click="confirmSendNotiEmail(item.id)"
                        v-if="showBtnSendNoti(item.status)"
                      >
                        Gửi
                      </p-button>
                      <p-button
                        type="default"
                        @click="loadDetailNotify(item.id)"
                        class="btn-detail"
                      >
                        Chi tiết
                      </p-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
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
    <modal-create-notify-email
      @save="handleSaveNotifyEmail"
      :tester="tester"
      :visible.sync="visibleCreateNotiModal"
      :show-detail="isShowDetail"
      :data="notify"
    >
    </modal-create-notify-email>
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalCreateNotifyEmail from '@/packages/notification/components/ModalCreateNotifyEmail'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  FETCH_LIST_NOTIFY_EMAIL,
  CREATE_NOTIFY_EMAIL,
  FETCH_DETAIL_NOTIFY_EMAIL,
  SEND_NOTIFY_EMAIL,
} from '../store'
import { mapActions, mapState } from 'vuex'
import { NOTIFY_EMAIL_NOT_SEND, NOTIFY_EMAIL_SENT } from '../constant'
export default {
  name: 'NotifyEmail',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalCreateNotifyEmail,
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 30,
        search: '',
      },
      isShowDetail: false,
      isFetching: false,
      isSubmitting: false,
      isLoading: false,
      visibleCreateNotiModal: false,
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('notification', {
      notifies: (state) => state.notifyEmails,
      count: (state) => state.countNotifyEmails,
      notify: (state) => state.notifyEmail,
    }),
  },
  methods: {
    ...mapActions('notification', [
      FETCH_LIST_NOTIFY_EMAIL,
      CREATE_NOTIFY_EMAIL,
      FETCH_DETAIL_NOTIFY_EMAIL,
      SEND_NOTIFY_EMAIL,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_NOTIFY_EMAIL](this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.isFetching = false
    },
    async loadDetailNotify(id) {
      this.isLoading = true
      const payload = {
        id: id,
      }
      const result = await this[FETCH_DETAIL_NOTIFY_EMAIL](payload)
      this.isLoading = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      this.visibleCreateNotiModal = true
      this.isShowDetail = true
    },
    confirmSendNotiEmail(id) {
      this.$dialog.confirm({
        title: 'Bạn có chắc chắn muốn gửi thông báo không ?',
        onConfirm: () => this.handleSendNotifyEmail(id),
      })
    },
    async handleSendNotifyEmail(id) {
      this.isSubmitting = true
      const payload = {
        id: id,
        is_tester: this.tester == '1' ? true : false,
      }
      const result = await this[SEND_NOTIFY_EMAIL](payload)
      this.isSubmitting = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }

      this.$toast.open({
        type: 'success',
        message: 'Gửi thông báo thành công',
      })
      this.init()
    },
    async handleSaveNotifyEmail(payload) {
      this.visibleCreateNotiModal = false
      this.isSubmitting = true
      payload.is_tester = this.tester == '1' ? true : false
      const result = await this[CREATE_NOTIFY_EMAIL](payload)
      this.isSubmitting = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      let msg = 'Lưu thông báo thành công'
      if (payload.is_send) {
        msg = 'Gửi thông báo thành công'
      }
      this.$toast.open({
        type: 'success',
        message: msg,
      })
      this.init()
    },
    showBtnSendNoti(status) {
      return status == NOTIFY_EMAIL_NOT_SEND
    },
    getStatusNotify(status) {
      switch (status) {
        case NOTIFY_EMAIL_NOT_SEND:
          return `<div class="not_send_status">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6668 8.00001C14.6668 11.68 11.6802 14.6667 8.00016 14.6667C4.32016 14.6667 1.3335 11.68 1.3335 8.00001C1.3335 4.32001 4.32016 1.33334 8.00016 1.33334C11.6802 1.33334 14.6668 4.32001 14.6668 8.00001Z" stroke="#3F51B5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.4734 10.12L8.40675 8.88665C8.04675 8.67332 7.75342 8.15999 7.75342 7.73999V5.00665" stroke="#3F51B5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Chưa gửi
                  </div>`
        case NOTIFY_EMAIL_SENT:
          return `<div class="sent_status">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00016 14.6667C11.6668 14.6667 14.6668 11.6667 14.6668 8.00001C14.6668 4.33334 11.6668 1.33334 8.00016 1.33334C4.3335 1.33334 1.3335 4.33334 1.3335 8.00001C1.3335 11.6667 4.3335 14.6667 8.00016 14.6667Z" stroke="#48BE78" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5.1665 8.00001L7.05317 9.88668L10.8332 6.11334" stroke="#48BE78" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                     Đã gửi
                  </div>`
        default:
          break
      }
    },
    showCreateNotifyModal() {
      this.visibleCreateNotiModal = true
      this.isShowDetail = false
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
