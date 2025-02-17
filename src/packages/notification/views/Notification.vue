<template>
  <div class="notification__page pages">
    <div class="container">
      <div class="page-header"> </div>
      <div class="page-content">
        <div
          v-for="(item, i) in notifications"
          :key="i"
          :class="{ unread: item.readed == NotificationUnread }"
          @click="handelReadNoti(item)"
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
        </div>
      </div>
      <div class="page-footer" v-if="count > 0">
        <p-pagination
          :total="count"
          :perPage.sync="filter.limit"
          :current.sync="filter.page"
          :filter-limit="true"
          size="sm"
        ></p-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { NOTIFY_TYPE_EXPORT_FILE } from '../../../packages/notification/constant'
import mixinDownload from '@/packages/shared/mixins/download'
import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_ALL,
  READ_NOTIFICATION,
} from '../../shared/store'
import { NotificationRead, NotificationUnread } from '../../shared/constants'

export default {
  name: 'Notification',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  computed: {
    ...mapState('shared', {
      notifications: (state) => state.notificationAll,
      count: (state) => state.countNotiAll,
    }),
  },
  data() {
    return {
      filter: {
        limit: 25,
        page: 1,
      },
      NotificationUnread: NotificationUnread,
      NotificationRead: NotificationRead,
      filterUnread: {
        limit: 7,
        page: 1,
        count: {
          unread: 1,
        },
      },
    }
  },
  methods: {
    ...mapActions('shared', [
      FETCH_NOTIFICATIONS_ALL,
      FETCH_NOTIFICATIONS,
      READ_NOTIFICATION,
    ]),
    handelReadNoti(item) {
      if (item.link) {
        if (item.type == NOTIFY_TYPE_EXPORT_FILE) {
          this.downloadPackage(item.link, 'packages', item.link.split('/')[1])
        } else {
          var url = item.link.replace(
            // eslint-disable-next-line no-useless-escape
            /(http[s]?:\/\/)?([^\/\s]+(\/)|^[\/])/,
            ''
          )
          this.$router.push({ path: `/${url}` })
        }
      }
      this.callRead(item)
    },
    async callRead(item) {
      if (item.readed == NotificationRead) return

      const arr = []
      arr.push(item.id)
      let read = await this[READ_NOTIFICATION](arr)
      if (!read.success) {
        this.$toast.open({ type: 'error', message: 'Có lỗi xảy ra' })
      }
    },
    async init() {
      this.handleUpdateRouteQuery()
      let limit = this.filter
      await this[FETCH_NOTIFICATIONS_ALL](limit)
    },
  },
  created() {
    this.init()
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
