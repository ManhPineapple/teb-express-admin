<template>
  <p-modal :active="visible" @close="handleClose" :title="title" size="sm">
    <template>
      <form @submit.prevent="handleUpdate">
        <div style="min-height: 150px">
          <label class="mb-5">Carrier:</label>
          <multiselect
            placeholder="Chọn carrier"
            v-model="carrier"
            label="text"
            track-by="value"
            :options="options"
          >
          </multiselect>
        </div>
      </form>
    </template>
    <template slot="footer">
      <div></div>
      <div class="d-flex">
        <div>
          <p-button
            @click="handleClose"
            type="default"
            :disabled="isSubmitting"
          >
            Đóng
          </p-button>
          <p-button
            class="ml-8"
            type="info"
            @click="confirmHandle"
            :loading="isSubmitting"
            :disabled="!hasChange"
          >
            Lưu
          </p-button>
        </div>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { UPDATE_CARRIER_SERVICE } from '../store'

export default {
  name: 'ModalEditCarrierService',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => {},
    },
    carriers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    title() {
      const names = { smallsize: '<450', largesize: '>450', oversize: '>3000' }
      const { size } = this.current || {}
      const name = names[size] || ''
      return `Chỉnh sửa mốc ${name}`
    },
    options() {
      return this.carriers.map(({ code, name }) => ({
        text: name,
        value: code,
      }))
    },
    hasChange() {
      return this.current && this.current.code != this.carrier.value
    },
  },
  data() {
    return {
      carrier: {},
      isSubmitting: false,
    }
  },
  methods: {
    ...mapActions('setting', { update: UPDATE_CARRIER_SERVICE }),

    confirmHandle() {
      this.$dialog.confirm({
        title: 'Bạn có muốn thay đổi?',
        onConfirm: () => this.handleUpdate(),
      })
    },

    async handleUpdate() {
      if (this.isSubmitting) return

      if (this.current.size == '') {
        this.$toast.error('Mốc không được để trống')
        return
      }

      if (this.carrier.value == '') {
        this.$toast.error('Carrier không được để trống')
        return
      }

      const payload = {
        line_size: this.current.size,
        carrier_code: this.carrier.value,
      }

      this.isSubmitting = true
      const res = await this.update(payload)
      this.isSubmitting = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Chỉnh sửa thông tin thành công')
      this.$emit('success')

      this.carrier = {}
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        if (this.current.code) {
          const { name, code } = this.current
          this.carrier = { text: name, value: code }
        } else {
          this.carrier = {}
        }
        this.isVisible = val
      },
      deep: true,
    },
    current: {
      handler: function (val) {
        if (!this.current) {
          this.handleClose()
        }

        this.carrier = { text: val.name, value: val.code }
      },
      deep: true,
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
    overflow-y: unset;
  }

  .modal-lg {
    overflow: revert;
  }
}
</style>
