<template>
  <p-modal :active="visible" :title="`Tạo phí phát sinh`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-6">
        <label for=""
          ><b>Loại phí</b>&ensp;<span style="color: red">*</span></label
        >
        <p-select class="floating" v-model="extra_fee_type_id">
          <option v-for="type in types" :key="type.id" :value="type.id">{{
            type.name
          }}</option>
        </p-select>
      </div>
      <div class="col-6">
        <label for=""
          ><b>Phí</b> ($)&ensp;<span style="color: red">*</span>
        </label>
        <p-input
          type="text"
          v-model="amount"
          @input="validateAmount"
          @change="formatAmount"
        ></p-input>
        <div class="invalid-error" v-if="txtError">
          {{ txtError }}
        </div>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <label for=""
          ><b>Nội dung</b>&ensp;<span style="color: red">*</span></label
        >
        <textarea
          class="form-control"
          rows="4"
          v-model="description"
        ></textarea>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleSave" :loading="loading">
          Tạo
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import api from '../../bill/api'
export default {
  name: 'ModalCreateExtraFee',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    packageCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      types: [],
      extra_fee_type_id: 0,
      amount: '',
      description: '',
      txtError: '',
    }
  },
  async created() {
    const result = await api.fetchExtraFeeTypes()
    if (!result || result.error) {
      this.$toast.open({ message: result.errorMessage || '', type: 'error' })
      return
    }
    this.types = result.extra_fee_types
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    formatAmount() {
      this.amount = this.amount.replace(/\s+/g, '').replaceAll(',', '')
      let isValid = isFinite(this.amount)
      if (!isValid) {
        return
      }
      let decimal = this.amount.split('.')[1]
      let number = this.amount.split('.')[0]
      number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      if (decimal !== undefined && decimal.length >= 2) {
        decimal = decimal.toString().slice(0, 2)
      }

      if (this.amount.includes('.')) {
        this.amount =
          decimal === undefined ? `${number}.` : `${number}.${decimal}`
      } else {
        this.amount = number
      }
    },
    validateAmount() {
      this.amount = this.amount.replace(/\s+/g, '').replaceAll(',', '')
      let isValid = isFinite(this.amount)
      if (!isValid) {
        this.txtError = 'Số tiền không hợp lệ !'
        return
      }
      this.txtError = ''
      let decimal = this.amount.split('.')[1]
      let number = this.amount.split('.')[0]
      if (decimal !== undefined && decimal.length >= 2) {
        this.amount = `${number}.${decimal.toString().slice(0, 2)}`
      }
    },
    validateParams() {
      this.txtError = ''
      if (this.extra_fee_type_id === 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn loại phí !',
        })
        return false
      }

      if (this.amount.trim() === '') {
        this.$toast.open({
          type: 'error',
          message: 'Chưa nhập phí !',
        })
        return false
      }

      let amount = this.amount.replace(/\s+/g, '').replaceAll(',', '')
      if (!isFinite(amount)) {
        this.$toast.open({
          type: 'error',
          message: 'Số tiền không hợp lệ !',
        })
        return false
      }

      if (this.description === '') {
        this.$toast.open({
          type: 'error',
          message: 'Chưa nhập nội dung !',
        })
        return false
      }

      return true
    },
    async handleSave() {
      if (!this.validateParams()) {
        return
      }

      const payload = {
        extra_fee_type_id: this.extra_fee_type_id,
        amount: parseFloat(this.amount.replace(/\s+/g, '').replaceAll(',', '')),
        description: this.description,
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.extra_fee_type_id = 10
        this.amount = ''
        this.description = ''
      },
    },
    extra_fee_type_id: {
      handler: function (id) {
        const type = this.types.find((item) => item.id === id)
        if (type.name.trim().toLowerCase() === 'phí phát sinh khác') {
          this.$set(this, 'description', '')
        } else {
          this.$set(
            this,
            'description',
            `${type.name} cho đơn ${this.packageCode}`
          )
        }
      },
    },
  },
}
</script>
<style>
.p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
