<!-- <div class="modal-confirm">
    <p-modal :active="visible" title="Xác nhận đóng kiện" @close="handleClose">
      <template>
        <span v-html="description"></span>
        <div class="mt-20">
          <p-input type="number" v-model="weight"> </p-input>
        </div>
      </template>
      <template slot="footer">
        <div class="group-button modal-confirm">
          <p-button type="default" @click="handleClose">
            {{ cancel }}
          </p-button>
          <p-button type="info" @click.prevent="handleAction()">
            {{ actionConfirm }}
          </p-button>
        </div>
      </template>
    </p-modal>
  </div> -->
<!-- // </template> -->
<!-- // <script> -->
<!-- // import mixinRoute from '@core/mixins/route' -->
<!-- // import mixinTable from '@core/mixins/table'
// import mixinUpload from '@core/mixins/upload' -->
<!-- // export default {
//   name: 'ModalCloseContainer',
//   mixins: [mixinRoute, mixinTable, mixinUpload],
//   props: {
//     visible: {
//       type: Boolean,
//       default: false,
//     },
//     description: {
//       type: String,
//       default: 'Nhập số trọng lượng kiện sau khi cân (kg)',
//     },
//     actionConfirm: {
//       type: String,
//     },
//     cancel: {
//       type: String,
//       default: 'Hủy',
//     },
//     id: {},
//     link: {
//       type: String,
//       default: '',
//     },
//     shop: {
//       type: Boolean,
//       default: false,
//     },
//     error: {
//       type: String,
//       default: '',
//     },
//     errorUrl: {
//       type: String,
//       default: '',
//     },
//     size: {
//       type: String,
//       default: '',
//     },
//   },
//   data() {
//     return {
//       weight: 0,
//     }
//   },
//   methods: {
//     handleClose() {
//       this.$emit('update:visible', false)
//       this.$emit('reset', true)
//       this.$emit('close', true)
//       this.$emit('update:error', '')
//       this.$emit('update:errorUrl', '')
//     },
//     handleAction() {
//       this.$emit('action', this.weight)
//     },
//   },
// }
// </script> -->
