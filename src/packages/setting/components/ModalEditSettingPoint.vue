<template>
  <div class="modal-edit-setting-point">
    <p-modal
      :size="`custom-setting-point`"
      :active="visible"
      :title="`Sửa rule tích điểm`"
      @close="handleClose"
    >
      <div class="row mb-16">
        <div class="col-6">
          <label for=""
            >Giá vận đơn từ: <span style="color: red">*</span></label
          >
          <p-input
            type="number"
            id="to"
            placeholder="Từ"
            v-model.number="input.from"
            :error="valider.error('from')"
          />
        </div>
        <div class="col-6">
          <label for="">Đến: <span style="color: red">*</span></label>
          <p-input
            type="number"
            id="from"
            placeholder="Đến"
            v-model.number="input.to"
            :error="valider.error('to')"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label for="">Hạng: <span style="color: red">*</span></label>
          <multiselect
            placeholder="Chọn hạng"
            label="text"
            track-by="value"
            :options="types"
            v-model="input.class"
            :disabled="true"
          >
          </multiselect>
        </div>
        <div class="col-6">
          <label for=""
            >Phần trăm quy đổi điểm: <span style="color: red">*</span></label
          >
          <p-input
            type="number"
            id="value"
            placeholder="Nhập % quy đổi điểm"
            v-model.number="input.value"
            :error="valider.error('value')"
          />
        </div>
      </div>
      <template slot="footer">
        <div></div>
        <div class="group-button modal-confirm">
          <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
          <p-button type="info" :loading="loading" @click="handleSave">
            Lưu
          </p-button>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import valider from '@core/valider'
import {
  USER_CLASS_PUBLIC,
  USER_CLASS_PRIORITY,
  USER_CLASS_PARTNER,
} from '../constants'
import { cloneDeep } from '@core/utils'
export default {
  name: 'ModalEditSettingPoint',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    setting: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
  data() {
    return {
      valider: null,
      input: {
        from: '',
        to: '',
        class: null,
        value: '',
      },
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
    }
  },
  created() {
    this.valider = valider.schema((y) => ({
      from: y
        .number()
        .min(0, 'Giới hạn không hợp lệ')
        .typeError('Giới hạn không hợp lệ'),
      to: y
        .number()
        .positive('Giới hạn không hợp lệ')
        .typeError('Giới hạn không hợp lệ'),
      class: y
        .number()
        .positive('Chưa chọn hạng')
        .typeError('Chưa chọn hạng !'),
      value: y
        .number()
        .min(0, 'Điểm không hợp lệ')
        .typeError('Điểm quy đổi bắt buộc nhập !'),
    }))
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      let payload = {
        id: this.input.id,
        from: this.input.from,
        to: this.input.to,
        class: this.input.class.value,
        value: this.input.value,
        status: this.input.status,
      }
      if (!this.valider.check(payload)) {
        return false
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.valider.reset()
        if (this.setting) {
          this.input = cloneDeep(this.setting)
          this.input.class = this.types.find((i) => {
            return i.value === this.setting.class
          })
        }
      },
      deep: true,
    },
  },
}
</script>
<style scoped>
label {
  font-family: Be Vietnam Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.2px;
  margin-bottom: 4px;
}
</style>
