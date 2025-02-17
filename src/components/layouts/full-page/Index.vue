<template>
  <div
    class="animsition layout-full"
    :class="$route.meta && $route.meta.class ? $route.meta.class : ''"
  >
    <div class="app container-fluid">
      <div class="row">
        <div class="content ">
          <div class="form">
            <router-view :key="$route.fullPath" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullPage',
  data() {
    return {
      urlSingup: 'https://help.lionnix.com/general/registration/ ',
      urlSingin: 'https://help.lionnix.com/general/sign-in/',
      urlPass: 'https://help.lionnix.com/general/password-recovery/',
    }
  },
  computed: {},
}
</script>
