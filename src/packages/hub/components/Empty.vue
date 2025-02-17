<template>
  <div class="page-content page-not-found">
    <div class="content">
      <div class="content_404">
        <div class="content_404-img">
          <p-svg name="empty_container" class="mb-16"></p-svg>
          <div class="empty-content">Chưa có thông tin hàng {{ type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    type: {
      type: String,
      default: 'nhập',
    },
  },
}
</script>
<style scoped>
.empty-content {
  color: #626363;
  font-weight: 500;
}
</style>
