<template>
  <div class="message" :class="{ me: isMeReply }">
    <div class="user">
      <div class="avatar">
        <p-svg name="avatar-dark"></p-svg>
      </div>
      <div class="info">
        <p class="user-name">
          <span>{{ displayName }}</span>
          <span class="user-role" v-show="roleName">{{ roleName }}</span>
        </p>
        <time class="post-time">{{ current.datetime }}</time>
      </div>
    </div>
    <div class="message-content">
      <div class="message-text" v-for="(item, i) in current.items" :key="i">
        <div class="w-text">
          <p v-html="formatText(item)"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthService from '@core/services/auth'
import {
  ROLE_ADMIN,
  ROLE_SUPPORT,
  ROLE_ACCOUNTANT,
  ROLE_SALE,
} from '@core/constants'

export default {
  name: 'TicketMessage',
  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    files() {
      return this.current.attachment || []
    },
    messageId() {
      return this.current.id || 0
    },
    hasFiles() {
      return this.files.length
    },
    displayName() {
      return this.current.full_name || 'Undefined'
    },
    roleName() {
      if (
        this.current.role === ROLE_ADMIN ||
        this.current.role === ROLE_SUPPORT ||
        this.current.role === ROLE_SALE ||
        this.current.role === ROLE_ACCOUNTANT
      ) {
        return 'CSKH'
      }

      return ''
    },
    authId() {
      return AuthService.getId()
    },
    isMeReply() {
      return this.current.user_id == this.authId
    },
  },
  methods: {
    formatText(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g
      return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>'
      })
    },
  },
}
</script>
