<template>
  <table class="table table-hover" id="tbl-packages">
    <thead>
      <tr>
        <template>
          <th>MÃ ĐƠN/KIỆN</th>
          <th>LOẠI</th>
          <th>ANANBAY TRACKING</th>
          <th>LAST MILE TRACKING</th>
          <th>NHÃN KIỆN</th>
          <th>MANIFEST</th>
          <th>NGÀY XUẤT</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in displayItems" :key="i">
        <td>
          <router-link :to="item.route" v-if="$isAdmin()">
            {{ item.id }}
          </router-link>
          <a href="#" v-else>
            {{ item.id }}
          </a>
        </td>
        <td>{{ item.type }}</td>
        <td>{{ item.code }}</td>
        <td>{{ item.tracking_number }}</td>
        <td>{{ item.label_number }}</td>
        <td>
          <p-tooltip
            v-if="item.label_url"
            class="item_name"
            :label="`Download`"
            position="top"
            type="dark"
          >
            <a href="javascript:void(0)" @click="downloadLabel(item.label_url)">
              {{ item.manifest_number }}
            </a>
          </p-tooltip>
          <span v-else> N/A</span>
        </td>
        <td>{{ item.date }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { datetime } from '@/core/utils/datetime'
import { GET_LABEL } from '../../container/store'
import Browser from '@core/helpers/browser'
import { mapActions } from 'vuex'

export default {
  name: 'ListReship',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    displayItems() {
      return this.items.map((item) => {
        if (item.type == 'container') {
          return {
            id: item.code,
            type: 'Kiện hàng',
            code: 'N/A',
            tracking_number: 'N/A',
            label_number: item.tracking_number,
            label_url: item.label_url,
            manifest_number: item.manifest_number,
            date: datetime(item.hub_exported_at, 'dd/MM/yyyy'),
            route: { name: 'container-detail', params: { code: item.code } },
          }
        }

        if (item.type == 'package') {
          return {
            id: item.id,
            type: 'Đơn hàng',
            code: item.code,
            tracking_number: item.tracking_number,
            label_number: 'N/A',
            label_url: item.label_url,
            manifest_number: item.manifest_number,
            date: datetime(item.hub_exported_at, 'dd/MM/yyyy'),
            route: { name: 'package-detail', params: { id: item.id } },
          }
        }

        return item
      })
    },
  },
  methods: {
    ...mapActions('container', [GET_LABEL]),
    async downloadLabel(labelUrl) {
      if (labelUrl == '') {
        this.$toast.open({
          type: 'error',
          message: "This tracking doesn't have label",
          duration: 3000,
        })
        return
      }
      let result = ''

      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this[GET_LABEL](payload)

      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
  },
}
</script>
