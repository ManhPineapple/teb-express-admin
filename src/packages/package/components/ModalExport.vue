<template v-if="uploading">
  <p-modal
    id="preview"
    :active="visible"
    title="Xuất Excel"
    @close="handleClose"
  >
    <div class="text-center processing">
      <p>Quá trình xuất file excel có thể sẽ mất một vài phút ...</p>
      <img src="~@/assets/img/loading.gif" />
    </div>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalExport',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
