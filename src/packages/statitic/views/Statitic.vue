<template>
  <div class="pages">
    <iframe
      style="overflow: hidden; width: 100%; height: 100vh"
      width="600"
      height="1500"
      seamless
      frameBorder="0"
      scrolling="yes"
      :src="`https://superset-new.lionnix.com/login?username=view&redirect=${getLink}`"
    >
    </iframe>
  </div>
</template>
<script>
export default {
  name: 'Statistics',
  computed: {
    getLink() {
      return `${process.env.VUE_APP_SUPERSET}`
    },
  },
}
</script>
