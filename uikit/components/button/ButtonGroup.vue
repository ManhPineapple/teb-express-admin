<template>
  <div class="btn-group" role="group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'PButtonGroup',
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'lg', 'sm', 'xs'].indexOf(value) > -1
      },
    },
  },
  computed: {
    wrapperClasses() {
      return [
        this.vertical ? 'btn-group-vertical' : 'btn-group',
        this.size ? `btn-group-${this.size}` : '',
      ]
    },
  },
}
</script>
