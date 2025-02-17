<template>
  <div class="modal-edit-user">
    <p-modal :active="visible" @close="handleClose" :title="title" size="md">
      <template>
        <form @submit.prevent="handleUpdate">
          <div class="row mb-20">
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Khách hàng:</label>

              <p-input :disabled="true" :value="current.full_name" />
            </div>
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Hạng:</label>

              <multiselect
                placeholder="Chọn hạng"
                v-model="type"
                label="text"
                track-by="value"
                :options="types"
              >
              </multiselect>
            </div>
          </div>
          <div class="row mb-20">
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Kiểu thanh toán:</label>
              <div>
                <label
                  class="mr-5 font-weight-600"
                  :class="{ disabled: paymentType == 1 }"
                >
                  <input
                    type="radio"
                    name="payment_type"
                    value="0"
                    v-model="paymentType"
                  />
                  Trả trước
                </label>
                <label
                  class="font-weight-600"
                  :class="{ disabled: paymentType == 0 }"
                >
                  <input
                    type="radio"
                    name="payment_type"
                    value="1"
                    v-model="paymentType"
                  />
                  Công nợ
                </label>
              </div>
            </div>
          </div>
          <div class="row mb-8">
            <div class="col-4" :class="{ disabled: paymentType == 0 }">
              <label class="color-newtral-10 mb-5"
                >Hạn mức nợ tối đa ($):</label
              >
              <p-input
                type="text"
                name="debt_max_amount"
                @input="validateAmount"
                v-model="debt_max_amount"
                @change="onChangeAmount"
                min="0"
                :error="valider.error('debt_max_amount')"
              />
            </div>
            <div class="col-4" :class="{ disabled: paymentType == 0 }">
              <label class="color-newtral-10 mb-5"
                >Thời gian nợ tối đa (ngày):</label
              >
              <multiselect
                placeholder="Chọn thời gian"
                v-model="debt_max_day"
                label="value"
                track-by="value"
                :options="dayLimit"
              >
              </multiselect>
            </div>
            <div class="col-4">
              <label class="color-newtral-10 mb-5"
                >Hạn mức hủy tối đa(trong ngày):</label
              >
              <p-input
                type="text"
                min="0"
                name="cancel_max_amount"
                v-model="cancel_max_amount"
                @change="onChangeAmountCancel"
                @input="validateAmountCancel"
                :error="valider.error('cancel_max_amount')"
              />
            </div>
          </div>
        </form>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Đóng
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleUpdate"
              :loading="loading"
            >
              Lưu
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import { parseInt } from 'lodash'
import { mapActions } from 'vuex'
import { UPDATE_USER_INFO } from '../store/index'
import valider from '@core/valider'
import {
  USER_CLASS_PUBLIC,
  USER_CLASS_PRIORITY,
  USER_CLASS_PARTNER,
  DEBT_LIMIT,
  DAY_LIMIT,
  CANCEL_MAX_AMOUNT,
} from '../constants'
import { formatNumberV2 } from '../../../core/utils/formatter'

export default {
  name: 'ModalEditUser',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.valider = valider.schema((y) => ({
      // debt_max_day: y
      //   .number()
      //   .typeError('Thời gian công nợ không hợp lệ')
      //   .integer('Thời gian công nợ không hợp lệ')
      //   .min(0, 'Thời gian công nợ không hợp lệ'),
      debt_max_amount: y
        .number()
        .typeError('Hạn mức công nợ không hợp lệ')
        .min(0, 'Hạn mức công nợ không hợp lệ'),
    }))
    this.valider.reset()
  },
  data() {
    return {
      title: 'Chỉnh sửa thông tin khách hàng',
      paymentType: 0,
      loading: false,
      valider: null,
      type: [
        {
          text: 'Public',
          value: USER_CLASS_PUBLIC,
        },
        {
          text: 'Priority',
          value: USER_CLASS_PRIORITY,
        },
        {
          text: 'Partner',
          value: USER_CLASS_PARTNER,
        },
      ].find((i) => {
        return i.value == this.current.class
      }),
      types: [
        {
          text: 'Public',
          value: USER_CLASS_PUBLIC,
        },
        {
          text: 'Priority',
          value: USER_CLASS_PRIORITY,
        },
        {
          text: 'Partner',
          value: USER_CLASS_PARTNER,
        },
      ],
      debtLimit: DEBT_LIMIT,
      dayLimit: DAY_LIMIT,
      debt_max_amount: 0,
      debt_max_day: 0,
      cancel_max_amount: CANCEL_MAX_AMOUNT,
    }
  },
  methods: {
    ...mapActions('setting', { update: UPDATE_USER_INFO }),

    async handleUpdate() {
      if (this.loading || !this.current.id) return

      if (this.type == null) {
        this.$toast.error('Hạng không được để trống')
        return
      }

      if (this.debt_max_amount <= 0 && this.paymentType == 1) {
        this.$toast.error('Hạn mức nợ tối đa không được để trống')
        return
      }

      if (this.debt_max_day == null && this.paymentType == 1) {
        this.$toast.error('Thời gian nợ không được để trống')
        return
      }

      if (this.cancel_max_amount <= 0) {
        this.$toast.error('Hạn mức hủy tối đa không hợp lệ')
        return
      }

      const payload = {
        id: this.current.id,
        debt_max_amount: parseFloat(
          `${this.debt_max_amount || 0}`.replaceAll(',', '')
        ),
        debt_max_day: parseInt(this.debt_max_day.value || 0),
        cancel_max_amount: parseFloat(
          `${this.cancel_max_amount || 0}`.replaceAll(',', '')
        ),
        class: parseInt(this.type.value),
      }

      this.loading = true
      const res = await this.update(payload)
      this.loading = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$emit('success', payload.class, true)
      this.$toast.success('Chỉnh sửa thông tin công nợ thành công')
    },

    onChangeAmount() {
      let value = this.debt_max_amount
      let decimal = value.split('.')[1]
      let number = value.split('.')[0]
      value = value.replace(/,/g, '').replace(/^0+/, '')
      number = formatNumberV2(number)

      if (value.includes('.')) {
        this.debt_max_amount =
          decimal === undefined ? `${number}.` : `${number}.${decimal}`
      } else {
        this.debt_max_amount = number
      }
    },
    validateAmount() {
      this.debt_max_amount = this.debt_max_amount
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\d\.]+/g, '')
        .replace(/(\..*)\./g, '$1')
      let decimal = this.debt_max_amount.split('.')[1]
      let number = this.debt_max_amount.split('.')[0]
      if (decimal !== undefined && decimal.length >= 2) {
        this.debt_max_amount = `${number}.${decimal.toString().slice(0, 2)}`
      }
    },
    onChangeAmountCancel() {
      let value = this.cancel_max_amount
      let decimal = value.split('.')[1]
      let number = value.split('.')[0]
      value = value.replace(/,/g, '').replace(/^0+/, '')
      number = formatNumberV2(number)
      if (value.includes('.')) {
        this.cancel_max_amount =
          decimal === undefined ? `${number}.` : `${number}.${decimal}`
      } else {
        this.cancel_max_amount = number
      }
    },
    validateAmountCancel() {
      this.cancel_max_amount = this.cancel_max_amount
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\d\.]+/g, '')
        .replace(/(\..*)\./g, '$1')
      let decimal = this.cancel_max_amount.split('.')[1]
      let number = this.cancel_max_amount.split('.')[0]
      if (decimal !== undefined && decimal.length >= 2) {
        this.cancel_max_amount = `${number}.${decimal.toString().slice(0, 2)}`
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        this.isVisible = val
      },
      deep: true,
    },
    current: {
      handler: function (val) {
        const info = val.user_info || {}
        this.paymentType = info.debt_max_amount > 0 ? 1 : 0
        this.cancel_max_amount = info.cancel_max_amount || CANCEL_MAX_AMOUNT

        if (this.paymentType == 1) {
          this.debt_max_amount = formatNumberV2(info.debt_max_amount)
          this.debt_max_day = info.debt_max_day
            ? this.dayLimit.find((i) => {
                return i.value == info.debt_max_day
              })
            : this.dayLimit[0]
        }
      },
      deep: true,
      immediate: true,
    },
    paymentType(val) {
      if (val == 0) {
        this.debt_max_day = 0
        this.debt_max_amount = ''
      }
      if (val == 1) {
        const info = val.user_info || {}
        this.debt_max_amount = formatNumberV2(info.debt_max_amount)
        this.debt_max_day = info.debt_max_day
          ? this.dayLimit.find((i) => {
              return i.value == info.debt_max_day
            })
          : this.dayLimit[0]
      }
    },
  },
}
</script>
<style lang="scss">
.modal-edit-user {
  div.disabled {
    pointer-events: none;
    opacity: 0.4;
  }
  label.disabled {
    color: #898a8a;
  }
  input,
  .multiselect__single {
    font-weight: 600;
  }
  .modal-body {
    overflow-y: visible;
  }
  .modal-lg {
    overflow: revert;
  }
  .p-modal-content,
  .p-modal-card {
    overflow: visible !important;
  }
}
</style>
