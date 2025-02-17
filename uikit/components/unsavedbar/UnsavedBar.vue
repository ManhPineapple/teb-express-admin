<template>
  <div class="unsaved-bar" :class="{ 'unsaved-bar--show': show }">
    <div class="unsaved-bar__wrapper">
      <div class="container">
        <div class="d-flex align-items-center">
          <p class="unsaved-bar__title flex-fill">Bạn có thay đổi chưa lưu</p>
          <div class="unsaved-bar__actions">
            <p-button
              type="default"
              v-if="showDiscard"
              @click.prevent="$emit('discard')"
              class="mr-10"
              >Hủy</p-button
            >
            <p-button
              type="info"
              :loading="loading"
              :disabled="loading"
              @click.prevent="$emit('save')"
              >{{ title }}</p-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnsavedBar',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Save',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showDiscard: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
