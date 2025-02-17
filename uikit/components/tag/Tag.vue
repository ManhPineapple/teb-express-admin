<template>
  <div v-if="attached && closable" class="p-tag-wrapper has-addons">
    <span :class="classes">
      <span :class="{ 'has-ellipsis': ellipsis }">
        <slot />
      </span>
    </span>
    <a
      class="tag is-delete"
      role="button"
      :tabindex="tabstop ? 0 : false"
      :disabled="disabled"
      :class="[size, { 'is-rounded': rounded }]"
      @click="close()"
      @keyup.delete.prevent="close()"
    >
    </a>
  </div>
  <span v-else :class="classes">
    <span :class="{ 'has-ellipsis': ellipsis }">
      <slot />
    </span>
    <a
      v-if="closable"
      role="button"
      class="delete is-small"
      :disabled="disabled"
      :tabindex="tabstop ? 0 : false"
      @click="close()"
      @keyup.delete.prevent="close()"
    >
    </a>
  </span>
</template>

<script>
export default {
  name: 'PTag',
  props: {
    attached: Boolean,
    closable: Boolean,
    type: String,
    size: String,
    rounded: Boolean,
    disabled: Boolean,
    ellipsis: Boolean,
    tabstop: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classes() {
      return [
        'p-tag',
        this.size ? `p-tag---${this.size}` : '',
        this.type ? `p-tag---${this.type}` : '',
        this.rounded ? 'is-rounded' : '',
      ]
    },
  },
  methods: {
    /**
     * Emit close event when delete button is clicked
     * or delete key is pressed.
     */
    close() {
      if (this.disabled) {
        return
      }

      this.$emit('close')
    },
  },
}
</script>
