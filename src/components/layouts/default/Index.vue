<template>
  <div
    class="animsition dashboard"
    :class="{
      'site-menubar-unfold': isSidebarOpen,
      'site-menubar-hide': !isSidebarOpen,
      'site-menubar-hover': isHoverSidebar,
    }"
  >
    <p-sidebar
      :isSidebarOpen="isSidebarOpen"
      @onHoverSideBar="hoverSidebar"
      @onOutSideBar="outSidebar"
    />
    <p-header :user="user" @toggleShowSidebar="toggleShowSidebar" />
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import '@assets/scss/main.scss'
import '@assets/fonts/material-design/material-design.min.css'
import '@assets/fonts/web-icons/web-icons.min.css'
import PHeader from './Header'
import PSidebar from './Sidebar'
import { GET_USER, GET_CONFIGS } from '../../../packages/shared/store'
import firebase from '../../../core/services/firebase'
export default {
  name: 'Version2',
  components: {
    PHeader,
    PSidebar,
  },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      isSidebarOpen: true,
      isHoverSidebar: false,
      isTicketOpen: false,
    }
  },

  mounted() {},
  created() {
    firebase.setup()
    this.init()
  },
  methods: {
    ...mapActions('shared', [GET_USER, GET_CONFIGS]),
    async init() {
      await this.getUser()

      const result = await this[GET_CONFIGS]()

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 4000,
        })
      }
    },
    toggleShowSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    hoverSidebar() {
      this.isHoverSidebar = true
    },
    outSidebar() {
      this.isHoverSidebar = false
    },
  },
}
</script>
