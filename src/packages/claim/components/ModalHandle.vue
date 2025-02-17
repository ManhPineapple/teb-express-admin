<template>
  <p-modal
    class="modal-handle-ticket"
    :active="visible"
    :title="title"
    @close="handleClose"
  >
    <div class="page-content">
      <div class="menu_content">
        <div class="page-content_drag card2">
          <div class="form-group" v-if="isRefund">
            <label class="text-bold mb-5"
              >Số tiền hoàn (USD): <span class="text-danger">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :value="refund_amount"
              @input="onChangeRefundAmount"
            />
            <span class="invalid-error" v-if="errorRefundAmount">{{
              errorRefundAmount
            }}</span>
          </div>
          <div class="form-group">
            <label class="text-bold mb-5">Ghi chú:</label>
            <textarea class="form-control" v-model.trim="note"></textarea>
            <span class="invalid-error" v-if="errorNote">{{ errorNote }}</span>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div>
        <span style="margin-bottom: 2px">
          <p-svg name="InfoCircle"></p-svg>
        </span>
        <b>Lưu ý:</b> (<span style="color: red">*</span>)
        <i>Là các trường bắt buộc nhập.</i>
      </div>
      <div class="d-flex">
        <div>
          <p-button @click="handleClose" type="default"> Hủy </p-button>
        </div>
        <div class="ml-7">
          <p-button
            type="info"
            @click="confirmSubmitHandle"
            :loading="isSubmitting"
            :disabled="isButtonDisable"
          >
            Xử lý
          </p-button>
        </div>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { PROCESS_CLAIM } from '../store'
import { formatAmount, amountToNumber } from '@core/utils/formatter'
import {
  CLAIM_TYPES,
  CLAIM_TYPE_DEFAULT,
  CLAIM_TYPE_REFUND,
  CLAIM_REFUND_RATE,
  CLAIM_REFUND_MAX,
} from '../constants'

export default {
  name: 'ModalHandle',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    claim: {
      type: Object,
      default: () => {},
    },
    type: Number,
    amount: Number,
  },
  computed: {
    isButtonDisable() {
      return (
        this.errorType != '' ||
        this.errorExtraAmount != '' ||
        this.errorRefundAmount != '' ||
        this.errorNote != ''
      )
    },
    isRefund() {
      return this.type == CLAIM_TYPE_REFUND
    },
    title() {
      if (this.type == CLAIM_TYPE_REFUND) {
        return `Xử lý hoàn tiền khiếu nại`
      }

      return `Đóng khiếu nại`
    },
  },
  data() {
    return {
      isVisibleConfirmDelete: false,
      isSubmitting: false,
      types: CLAIM_TYPES,
      extra_amount: '',
      refund_amount: '',
      errorType: '',
      errorExtraAmount: '',
      errorRefundAmount: '',
      note: '',
      errorNote: '',
    }
  },
  methods: {
    ...mapActions('claim', {
      processClaim: PROCESS_CLAIM,
    }),
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleAction() {
      this.$emit('action')
    },
    onChangeExtraAmount(e) {
      try {
        this.errorExtraAmount = ''
        this.extra_amount = formatAmount(e.target.value)
        e.target.value = this.extra_amount
      } catch {
        this.extra_amount = e.target.value
        this.errorExtraAmount = 'Số tiền không hợp lệ!'
      }
    },
    onChangeRefundAmount(e) {
      try {
        this.errorRefundAmount = ''
        const amount = amountToNumber(e.target.value)
        if (amount > CLAIM_REFUND_MAX) {
          e.target.value = CLAIM_REFUND_MAX
        }

        this.refund_amount = formatAmount(e.target.value)
        e.target.value = this.refund_amount
      } catch {
        this.refund_amount = e.target.value
        this.errorRefundAmount = 'Số tiền không hợp lệ!'
      }
    },
    confirmSubmitHandle() {
      this.$dialog.confirm({
        title: 'Bạn có chắc chắn thông tin nhập là đúng?',
        onConfirm: () => this.submitHandle(),
      })
    },
    async submitHandle() {
      if (this.isSubmitting || !this.claim.id) return

      const payload = {
        id: this.claim.id,
        type: 0,
        note: this.note,
        extra_amount: 0,
        refund_amount: 0,
      }

      payload.type = this.type
      if (this.types.every(({ id }) => this.type != id)) {
        this.$toast.error('Hướng sử lý không hợp lệ!')
        return
      }

      try {
        payload.extra_amount = amountToNumber(this.extra_amount)
      } catch {
        this.errorExtraAmount = 'Số tiền không hợp lệ!'
        return
      }

      try {
        payload.refund_amount = amountToNumber(this.refund_amount)
      } catch {
        this.errorRefundAmount = 'Số tiền không hợp lệ!'
        return
      }

      if (payload.type == CLAIM_TYPE_REFUND && payload.refund_amount <= 0) {
        this.errorRefundAmount = 'Số tiền hoàn > $0'
        return
      }

      if (
        payload.type == CLAIM_TYPE_REFUND &&
        payload.refund_amount > CLAIM_REFUND_MAX
      ) {
        this.errorRefundAmount = `Số tiền hoàn tối đa $${CLAIM_REFUND_MAX}`
        return
      }

      if (payload.note.length > 1000) {
        this.errorNote = 'Ghi chú không được vượt quá 1000 ký tự'
        return
      }

      this.isSubmitting = true
      const res = await this.processClaim(payload)
      this.isSubmitting = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$emit('success', res)
      this.$toast.success('Xử lý khiếu nại thành công!')
      this.handleClose()
    },
  },
  watch: {
    type: function (val) {
      this.errorType = ''
      if (val != CLAIM_TYPE_DEFAULT) return

      this.note = ''
      this.extra_amount = ''
      this.refund_amount = ''
      this.errorExtraAmount = ''
      this.errorRefundAmount = ''
      this.errorNote = ''
    },
    visible: function () {
      const refund = this.amount * CLAIM_REFUND_RATE
      this.refund_amount =
        refund > CLAIM_REFUND_MAX
          ? CLAIM_REFUND_MAX
          : refund < 0
          ? 0
          : Math.round(refund * 100) / 100
    },
  },
}
</script>
