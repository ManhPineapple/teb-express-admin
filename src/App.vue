<template>
  <div id="app">
    <Loading />
    <component :is="layout">
      <router-view :key="$route.name"></router-view>
    </component>
    <notifications position="bottom center" />
    <div
      id="scroll-top"
      class="scroll-top"
      @click="scrollToTop"
      v-show="isShowScrollTop"
    >
      <a href="javascript:void(0)">
        <i class="icon md-chevron-up"></i>
      </a>
    </div>
  </div>
</template>
<script>
import Loading from '@components/shared/Loading'

export default {
  name: 'App',
  data() {
    return {
      isShowScrollTop: false,
    }
  },
  metaInfo() {
    return {
      title: this.$route.meta.title || '',
      titleTemplate: '%s - Shipping',
    }
  },
  created() {
    window.onscroll = () => {
      let pos = window.pageYOffset
      if (pos > window.innerHeight) {
        this.isShowScrollTop = true
      } else {
        this.isShowScrollTop = false
      }
    }
  },
  computed: {
    layout() {
      return `${this.$route.meta.layout || 'default'}-layout`
    },
  },
  components: {
    Loading,
    'default-layout': () => import('@layouts/default/Index'),
    'full-page-layout': () => import('@layouts/full-page/Index'),
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>
