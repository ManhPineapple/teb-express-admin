<template>
  <nav class="site-navbar" role="navigation">
    <div class="navbar__header">
      <div class="navbar__header-content">
        <div class="navbar__header-icon">
          <div
            @click="toggleIcon"
            :class="{ 'active-ep': isExpand }"
            class="hamburger-lines"
          >
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
          </div>
        </div>
        <div class="navbar__header-title">{{ handleTitle }}</div>
      </div>
      <div class="navbar__header-right d-flex align-items-center">
        <div class="navbar__header-noti">
          <p-dropdown :multiple="false" class="">
            <div class="noti__dropdown-icon" slot="trigger">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.33337 4.16667C8.33337 3.72464 8.50897 3.30072 8.82153 2.98816C9.13409 2.67559 9.55801 2.5 10 2.5C10.4421 2.5 10.866 2.67559 11.1786 2.98816C11.4911 3.30072 11.6667 3.72464 11.6667 4.16667C12.6237 4.61919 13.4395 5.32361 14.0267 6.20442C14.614 7.08523 14.9504 8.10923 15 9.16667V11.6667C15.0628 12.1848 15.2462 12.6809 15.5357 13.1151C15.8252 13.5493 16.2126 13.9095 16.6667 14.1667H3.33337C3.78749 13.9095 4.17488 13.5493 4.46436 13.1151C4.75384 12.6809 4.93733 12.1848 5.00004 11.6667V9.16667C5.04967 8.10923 5.38612 7.08523 5.97333 6.20442C6.56054 5.32361 7.37637 4.61919 8.33337 4.16667"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 14.1667V15C7.5 15.663 7.76339 16.2989 8.23223 16.7678C8.70107 17.2366 9.33696 17.5 10 17.5C10.663 17.5 11.2989 17.2366 11.7678 16.7678C12.2366 16.2989 12.5 15.663 12.5 15V14.1667"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div v-if="convertNumber > 0" class="noti__dropdown-count">{{
                convertNumber
              }}</div>
            </div>

            <div class="noti__dropdown">
              <div class="noti__dropdown-header d-flex">
                <div class="noti__dropdown-label">Notifications</div>
                <div
                  v-if="count > 0"
                  class="noti__dropdown-mark"
                  @click="handleReadAll"
                  >Đánh dấu là đã đọc</div
                >
              </div>

              <div class="noti__dropdown-list">
                <div
                  class="noti__dropdown-content"
                  v-if="notifications.length > 0"
                >
                  <p-dropdown-item
                    v-for="(item, i) in notifications"
                    :key="i"
                    @click="handelReadNoti(item)"
                    :class="{ unread: item.readed === NotificationUnread }"
                    class="noti__dropdown-item"
                  >
                    <div class="item-content">
                      <div class="item-text"
                        >{{ item.body }}
                        <div class="item-date">{{
                          item.created_at | datetime('dd/MM/yyyy - HH:mm')
                        }}</div>
                      </div>
                    </div>
                  </p-dropdown-item>
                </div>
                <div class="no-noti" v-else>Không có thông báo nào.</div>
              </div>
              <p-dropdown-item class="all">
                <div class="noti__dropdown-footer d-flex">
                  <div v-if="notifications.length > 0" class="view-all">
                    <router-link to="/notification"> Xem tất cả </router-link>
                  </div>
                </div>
              </p-dropdown-item>
            </div>
          </p-dropdown>
        </div>
        <div class="navbar__header-user d-flex">
          <div class="navbar__header-name" @click="toggleMenuUser">
            <span class="mr-2"
              >Xin chào, <b>{{ user.full_name }}</b></span
            >
            <p-svg name="dropdown"></p-svg>
          </div>
          <div
            class="dropdown-menu"
            :class="{ active: showUserMenu }"
            v-click-outside="hideMenuUser"
          >
            <div class="dropdown-content">
              <div class="dropdown-item">
                <span class="navbar__header-icon">
                  <p-svg name="user"></p-svg>
                </span>
                <a
                  href="/profile"
                  aria-current="page"
                  class="nav-item nav-item active router-link-active"
                  >Thông tin tài khoản</a
                >
              </div>
              <div class="dropdown-item">
                <span class="navbar__header-icon">
                  <p-svg name="logout"></p-svg>
                </span>
                <a href="/logout" class="nav-item">Đăng xuất</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import {
  FETCH_NOTIFICATIONS,
  READ_NOTIFICATIONS,
  READ_NOTIFICATION,
  GET_COUNT,
  GET_NOTIFICATION,
} from '../../../packages/shared/store'
import { NOTIFY_TYPE_EXPORT_FILE } from '../../../packages/notification/constant'
import mixinDownload from '@/packages/shared/mixins/download'
import { numFormatter } from '@core/utils/formatter'
import { mapActions, mapGetters } from 'vuex'
import {
  // eslint-disable-next-line no-unused-vars
  NotificationRead,
  NotificationUnread,
} from '../../../packages/shared/constants'
export default {
  components: {},
  name: 'Header',
  mixins: [mixinDownload],
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    isSidebarOpen: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.init()
  },
  created() {},
  computed: {
    ...mapGetters('shared', {
      count: GET_COUNT,
      notifications: GET_NOTIFICATION,
    }),
    convertNumber() {
      return numFormatter(this.count)
    },
    handleTitle() {
      return this.$route.meta.title || ''
    },
  },
  data() {
    return {
      showUserMenu: false,
      filter: {
        limit: 7,
        page: 1,
        count: {
          unread: 1,
        },
      },
      isExpand: false,
      NotificationUnread: NotificationUnread,
    }
  },
  methods: {
    ...mapActions('shared', [
      FETCH_NOTIFICATIONS,
      READ_NOTIFICATIONS,
      READ_NOTIFICATION,
    ]),
    async init() {
      const result = await this[FETCH_NOTIFICATIONS](this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    async handleReadAll() {
      const result = await this[READ_NOTIFICATIONS]()
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.init()
    },
    async handelReadNoti(item) {
      if (item.link) {
        if (item.type == NOTIFY_TYPE_EXPORT_FILE) {
          this.downloadPackage(item.link, 'packages', item.link.split('/')[1])
        } else {
          var url = item.link.replace(
            // eslint-disable-next-line no-useless-escape
            /(http[s]?:\/\/)?([^\/\s]+(\/)|^[\/])/,
            ''
          )
          this.$router.replace({ path: `/${url}` })
        }
      }
      if (item.readed === NotificationRead) return
      const arr = []
      arr.push(item.id)
      let read = await this[READ_NOTIFICATION](arr)
      if (!read.success) {
        this.$toast.open({ type: 'error', message: 'Có lỗi xảy ra' })
      }
    },
    toggleMenuUser() {
      this.showUserMenu = !this.showUserMenu
    },
    hideMenuUser() {
      this.showUserMenu = false
    },
    toggleIcon() {
      this.isExpand = !this.isExpand
      this.$emit('toggleShowSidebar')
    },
  },
}
</script>
<style lang="scss">
.site-navbar .navbar__header-user {
  .navbar__header-name {
    cursor: pointer;

    span {
      font-weight: normal;
    }
  }

  .dropdown-menu {
    right: 0;
    left: unset;
    top: 57px;
    background: #ffffff;
    box-shadow: 0px 0px 2px rgb(40 41 61 / 4%), 0px 4px 8px rgb(96 97 112 / 16%);
    border-radius: 4;
    border: none;

    &.active {
      display: block;
    }

    .dropdown-item {
      padding: 10px 14px;
      display: flex;
      align-items: center;
    }

    a {
      color: #111212;
      padding: 0 13px;
      font-size: 14px;
      width: 100%;
    }
  }
}
</style>
