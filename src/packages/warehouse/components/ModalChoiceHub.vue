<template>
  <p-modal
    class="modal-export"
    :active="visible"
    :title="`Chọn hub`"
    @close="handleClose"
    :close-outside="true"
  >
    <div class="row">
      <p-radio
        v-for="(item, i) in wareHouses"
        type="info"
        class="col-3 radio-inline"
        v-model="hub_id"
        :key="i"
        :native-value="item.id"
        ><b>{{ item.state }}</b></p-radio
      >
    </div>
    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" @click="handleSubmit"> Dán nhãn </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { IMPORT_CREATE_LABEL_PDF } from '../store'
import { mapActions, mapState } from 'vuex'
import { FETCH_WAREHOUSE } from '../../shared/store'

export default {
  name: 'ModalChoiceHub',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('shared', {
      wareHouses: (state) => state.wareHouses,
    }),
  },
  data() {
    return {
      hub_id: null,
    }
  },
  methods: {
    ...mapActions('warehouse', {
      import: IMPORT_CREATE_LABEL_PDF,
    }),
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    handleClose() {
      this.$emit('update:visible', false)
    },
    async init() {
      let req = { status: 1, type: 1, country: this.country }
      const r2 = await this[FETCH_WAREHOUSE](req)
      if (!r2.success) {
        this.$toast.open({ message: r2.message, type: 'error' })
      }
    },
    async handleSubmit() {
      if (!this.hub_id) {
        return this.$toast.error('Chọn 1 hub để dán nhãn')
      }
      this.$emit('label', this.hub_id)
      this.handleClose()
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.hub_id = null
          this.init()
        }
      },
    },
  },
}
</script>
<style>
.modal-footer {
  justify-content: flex-end !important;
}
.p-modal-content label {
  margin-bottom: 0.4rem;
}
.upload {
  margin-top: 4px;
}
.btn-primary {
  background-color: #00b4c3 !important;
  border: 1px solid transparent !important;
}
.p-radio {
  margin-bottom: unset !important;
}
</style>
