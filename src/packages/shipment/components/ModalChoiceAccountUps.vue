<template>
  <p-modal
    :size="`custom`"
    :active="visible"
    :title="`Thông tin lô hàng`"
    @close="handleClose"
  >
    <div class="row" v-if="isShowAccount">
      <div class="col-12 mb-8">
        <label class="form-label">Chọn tài khoản ups :</label>
        <div class="row">
          <p-radio
            type="info"
            class="col-6 radio-inline"
            v-model="account_ups"
            :native-value="optionAccountDefault"
            >Phoenix (default)</p-radio
          >
          <p-radio
            type="info"
            class="col-6 radio-inline"
            v-model="account_ups"
            :native-value="optionAcocount2"
          >
            Viva</p-radio
          >
        </div>
      </div>
    </div>
    <div class="row" v-if="isShowInputValue">
      <div class="col-12 mb-8">
        <label class="form-label">Chọn tài khoản fedex :</label>
        <div class="row">
          <p-radio
            type="info"
            class="col-6 radio-inline"
            v-model="account_fedex"
            :native-value="accountDefault"
            >Fedex 1</p-radio
          >
          <p-radio
            type="info"
            class="col-6 radio-inline"
            v-model="account_fedex"
            :native-value="optionAcocount"
            >Fedex 2</p-radio
          >
        </div>
      </div>
      <div class="col-12">
        <label class="form-label">Giá trị lô hàng:</label>
        <p-input
          type="text"
          :placeholder="`Nhập giá trị... Đơn vị: USD`"
          v-model="value"
        ></p-input>
      </div>
    </div>

    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" :loading="loading" @click="handleSave">
          Đóng lô
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import {
  DEFAULT_ACCOUNT_FEDEX,
  DEFAULT_ACCOUNT_UPS,
  OPTION_ACCOUNT_FEDEX,
  OPTION_ACCOUNT_UPS2,
} from '../constants'
export default {
  name: 'ModalChoiceAccountUps',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isShowAccount: {
      type: Boolean,
      default: false,
    },
    isShowInputValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optionAccountDefault: DEFAULT_ACCOUNT_UPS,
      optionAcocount2: OPTION_ACCOUNT_UPS2,
      account_ups: DEFAULT_ACCOUNT_UPS,
      accountDefault: DEFAULT_ACCOUNT_FEDEX,
      optionAcocount: OPTION_ACCOUNT_FEDEX,
      account_fedex: DEFAULT_ACCOUNT_FEDEX,
      value: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        ups_account: DEFAULT_ACCOUNT_UPS,
      }
      if (this.isShowAccount) {
        payload.ups_account = this.account_ups
      }
      if (this.isShowInputValue) {
        payload.shipment_value = parseFloat(this.value)
        payload.fedex_account = this.account_fedex
      }
      this.$emit('close', payload)
    },
  },
  watch: {},
}
</script>
<style>
.modal-footer {
  justify-content: flex-end !important;
}
@media screen and (min-width: 1088px) {
  .modal-custom {
    width: 340px !important;
  }
}
.p-modal-content .p-radio {
  margin-bottom: 0;
}
</style>
