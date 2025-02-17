<template>
  <div class="claim-detail-page pages">
    <div class="content-page">
      <div class="page-header claim-header">
        <div class="page-header-group" :class="headClass">
          <div class="page-header-title">
            <h1>{{ claim.title }}</h1>
            <div class="sub-title" v-html="claim.content"></div>
          </div>
          <div
            class="page-header-group-actions__right"
            v-if="!isProcessed && !isProcessing"
          >
            <div class="actions">
              <a href="#" class="name">Xử lý khiếu nại</a>
              <p-svg name="dropdown"></p-svg>
              <ul>
                <li class="danger">
                  <a href="#" @click="showModalHandle">Đóng</a>
                </li>
                <li>
                  <a href="#" @click.prevent="showModalRefundHandle"
                    >Hoàn tiền</a
                  >
                </li>
                <li :class="{ disable: !isHasReship }">
                  <a href="#" @click.prevent="showModalReshipHandle"
                    >Vận chuyển lại</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="row">
          <div class="col-md-8 claim-left">
            <div class="claim-messages mb-24">
              <div class="card">
                <div class="box-messages" v-on:scroll="onscroll">
                  <div class="messages">
                    <Message
                      v-for="(mes, i) in displayMessages"
                      :key="i"
                      :current="mes"
                    />
                  </div>
                </div>
              </div>
            </div>
            <FormReply
              v-if="!isProcessed"
              :claim="claim"
              @success="replySuccess"
            />
          </div>
          <div class="col-md-4 claim-right">
            <div class="card-block">
              <div class="card-header">
                <div class="card-title">Thông tin</div>
              </div>
              <div class="card-content claim-info">
                <ul class="list-note">
                  <li class="item-note">
                    <span class="item-title">Trạng thái:</span>
                    <div class="item-value">
                      <span v-status="claim.status" type="claim"></span>
                    </div>
                  </li>
                  <li class="item-note">
                    <span class="item-title">Lý do: </span>
                    <span class="item-value">{{
                      formatReason(claim.category)
                    }}</span>
                  </li>
                  <li class="item-note">
                    <span class="item-title">AnanBay tracking: </span>
                    <span class="item-value">
                      <router-link
                        v-if="claim.package"
                        :to="{
                          name: 'package-detail',
                          params: { id: claim.package.id },
                        }"
                      >
                        {{
                          claim.package.package_code
                            ? claim.package.package_code.code
                            : ''
                        }}
                      </router-link>
                    </span>
                  </li>
                  <li class="item-note">
                    <span class="item-title">Ngày tạo: </span>
                    <span class="item-value">{{
                      claim.created_at | datetime('dd/MM/yyyy HH:mm')
                    }}</span>
                  </li>
                  <li class="item-note">
                    <span class="item-title">Ngày cập nhật: </span>
                    <span class="item-value">{{
                      claim.updated_at | datetime('dd/MM/yyyy HH:mm')
                    }}</span>
                  </li>
                  <template v-if="claim.type > 0">
                    <li class="item-note br">
                      <span class="item-title">Hướng xử lý: </span>
                      <span class="item-value">{{ typeText }}</span>
                    </li>
                    <li class="item-note" v-if="claim.amount > 0">
                      <span class="item-title">Số tiền thêm: </span>
                      <span class="item-value">{{
                        Math.abs(claim.amount) | formatPrice
                      }}</span>
                    </li>
                    <li class="item-note" v-if="claim.amount < 0">
                      <span class="item-title">Số tiền hoàn: </span>
                      <span class="item-value">{{
                        Math.abs(claim.amount) | formatPrice
                      }}</span>
                    </li>
                    <li class="item-note" v-if="claim.note">
                      <span class="item-title">Ghi chú: </span>
                      <span class="item-value">{{ claim.note }}</span>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <div class="card-block claim-attachment">
              <div class="card-header">
                <div class="card-title">Tài liệu đính kèm</div>
              </div>
              <div class="card-content">
                <div v-if="attachments.length" class="claim-attachments">
                  <p
                    class="item d-flex"
                    v-for="(item, i) in attachments"
                    :key="i"
                  >
                    <file :src="item.src" :name="item.name" class="thumb">
                      <i class="icon center">
                        <img src="~@/assets/img/download.svg" />
                      </i>
                    </file>
                    <span>
                      {{ item.name }}
                      <time>{{
                        item.created_at | date('dd/MM/yyyy hh:mm aa')
                      }}</time>
                    </span>
                  </p>
                </div>
                <template v-else>
                  <div class="text-center p-5">
                    <img src="~@/assets/img/empty.svg" alt="" />
                    <p>Chưa có file đính kèm</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OverLoading :is-loading="isLoading" />
    <ModalHandle
      :visible.sync="isVisibleModalHandle"
      :loading.sync="isLoading"
      :claim="claim"
      :type="typeHandle"
      :amount="totalAmount"
      @success="init"
    />
    <ModalReship
      v-if="claim.package"
      :visible.sync="isVisibleModalReship"
      :claim="claim"
      :package="claim"
      @submit="reshipHandle"
      @success="init"
    />
  </div>
</template>

<script>
import File from '../components/File'
import FormReply from '../components/FormReply'
import { mapActions, mapState, mapMutations } from 'vuex'
import Message from '../components/Message'
import ModalHandle from '../components/ModalHandle.vue'
import { FETCH_TICKET, FETCH_MESSAGE, UPDATE_MESSAGE_TICKET } from '../store'
import {
  CLAIM_STATUS_PENDING,
  CLAIM_STATUS_PROCESSED,
  MAP_REASON_CATEGORY_TEXT,
  REASON_CATEGORY_OTHER_TEXT,
  CLAIM_TYPES,
  MAP_CLAIM_STATUS,
  CLAIM_TYPE_DEFAULT,
  CLAIM_TYPE_REFUND,
  CLAIM_TYPE_RESHIP,
} from '../constants'
import { truncate } from '@core/utils/string'
import { datetime, format } from '@core/utils/datetime'
import { cloneDeep } from '@core/utils'
import debounce from 'lodash/debounce'
import { PACKAGE_ALERT_TYPE_HUB_RETURN } from '@/packages/package/constants'
import OverLoading from '@components/shared/OverLoading'
import ModalReship from '../components/ModalReship.vue'

const regexName = /_\w{8}-\w{4}-\w{4}-\w{4}-\w{12}.(xlsx|jpg|png|jpeg)$/gi

export default {
  name: 'ClaimDetail',
  components: {
    File,
    FormReply,
    Message,
    ModalHandle,
    OverLoading,
    ModalReship,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      isFistScroll: false,
      isVisibleModalHandle: false,
      isVisibleModalReply: false,
      isMessageLoading: false,
      isVisibleModalReship: false,
      typeHandle: 0,
      filter: {
        limit: 50,
        last_id: 0,
        next: true,
      },
    }
  },
  computed: {
    claimID() {
      const { id } = this.$route.params
      return parseInt(id)
    },
    ...mapState('claim', {
      claim: (state) => state.ticket,
      messages: (state) => state.message,
    }),
    isProcessed() {
      return this.claim.status == CLAIM_STATUS_PROCESSED
    },
    isProcessing() {
      return this.claim.status == CLAIM_STATUS_PENDING
    },
    typeText() {
      for (const { id, name } of CLAIM_TYPES) {
        if (id == this.claim.type) {
          return name
        }
      }

      return ''
    },
    attachments() {
      const attachments = []

      if (this.messages && this.messages.length) {
        for (const message of this.messages) {
          const files = (message.attachment || []).map((src) => ({
            src,
            name: src.replace(regexName, `.$1`).split('/').pop(),
            created_at: message.created_at,
          }))

          attachments.push(...files)
        }
      }

      const files = (this.claim.attachment || []).map((src) => ({
        src,
        name: src.replace(regexName, `.$1`).split('/').pop(),
        created_at: this.claim.created_at,
      }))

      attachments.push(...files)
      return attachments
    },
    displayMessages() {
      let last = null
      const results = []
      let messages = [...(this.messages || [])]
      messages.reverse()

      const now = format(new Date(), 'yyyyMMdd')
      const nowYear = format(new Date(), 'yyyy')

      for (const message of messages) {
        const dd = datetime(message.created_at, 'yyyyMMdd')

        if (last) {
          if (last.user_id != message.user_id) {
            results.push(last)
            last = null
          } else if (last.dd != dd) {
            results.push(last)
            last = null
          }
        }

        if (!last) {
          last = cloneDeep(message)
          last.dd = dd
        }

        last.datetime = datetime(last.created_at, 'dd/MM hh:mm aa')
        if (now == dd) {
          last.datetime = datetime(last.created_at, 'hh:mm aa')
        } else if (nowYear != datetime(message.created_at, 'yyyy')) {
          last.datetime = datetime(last.created_at, 'dd/MM/yyyy hh:mm aa')
        }

        if (last.items) {
          last.items.push(message.content)
        } else {
          last.items = [message.content]
        }
      }

      if (last) {
        results.push(last)
      }

      return results
    },
    headClass() {
      return (MAP_CLAIM_STATUS[this.claim.status] || { className: '' })
        .className
    },
    totalAmount() {
      if (!this.claim || !this.claim.package) return 0

      const { shipping_fee, extra_fee } = this.claim.package
      const extra = (extra_fee || []).reduce(
        (sum, { amount }) => sum + amount,
        0
      )

      return shipping_fee + extra
    },
    isHasReship() {
      return this.claim.package.alert == PACKAGE_ALERT_TYPE_HUB_RETURN
    },
  },
  created() {
    this.init()
  },
  updated() {
    this.$nextTick(function () {
      if (this.isFistScroll || !this.messages.length) return

      setTimeout(() => {
        this.isFistScroll = true
        this.scrollHandle()
      }, 100)
    })
  },
  methods: {
    truncate,
    ...mapActions('claim', [FETCH_TICKET, FETCH_MESSAGE]),
    ...mapMutations('claim', [UPDATE_MESSAGE_TICKET]),
    async init() {
      this[UPDATE_MESSAGE_TICKET]([])

      this.isLoading = true
      this.handlerFetchTicketMessages()
      const res = await this[FETCH_TICKET](this.claimID)
      this.isLoading = false
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    handlerFetchTicketMessages: debounce(async function () {
      if (!this.filter.next || this.isMessageFetching) return

      if (this.messages.length) {
        const n = this.messages.length - 1
        this.filter.last_id = this.messages[n].id || 0
      }

      let { limit, last_id } = this.filter
      if (last_id == 1) {
        this.filter.next = false
        return
      }

      this.isMessageLoading = true
      const res = await this[FETCH_MESSAGE]({
        limit,
        last_id,
        ticket_id: this.claimID,
      })
      this.isMessageLoading = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      if (res.messages.length < 1) {
        this.filter.next = false
      }
    }, 500),
    formatReason(reason) {
      return MAP_REASON_CATEGORY_TEXT[reason] || REASON_CATEGORY_OTHER_TEXT
    },
    showModalReply() {
      this.isVisibleModalReply = true
    },
    replySuccess() {
      this.scrollHandle()
    },
    scrollHandle() {
      const $el = document.querySelector('.box-messages')
      const $messages = document.querySelector('.box-messages .messages')
      const height = $messages.offsetHeight || 0

      $el.scrollTop = height
    },
    onscroll(e) {
      if (e.target.scrollTop < 50) {
        this.handlerFetchTicketMessages()
      }
    },
    showModalHandle() {
      this.typeHandle = CLAIM_TYPE_DEFAULT
      this.isVisibleModalHandle = true
    },
    showModalRefundHandle() {
      this.typeHandle = CLAIM_TYPE_REFUND
      this.isVisibleModalHandle = true
    },
    showModalReshipHandle() {
      if (this.claim.package.alert != PACKAGE_ALERT_TYPE_HUB_RETURN) {
        this.$toast.error(`Đơn không hợp lệ`)
        return
      }

      this.typeHandle = CLAIM_TYPE_RESHIP
      this.isVisibleModalReship = true
    },
    async reshipHandle(payload) {
      console.log(payload)
    },
  },
}
</script>
