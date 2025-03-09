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
          <th>NGÀY NHẬP</th>
          <!-- <th>TRẠNG THÁI</th> -->
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
        <td
          >{{ item.tracking_number }}
          <span class="download-label" v-if="item.tracking_number != 'N/A'">
            <p-tooltip
              class="item_name"
              :label="`Download`"
              position="bottom"
              type="dark"
            >
              <a
                href="javascript:void(0)"
                @click="downloadLabel(item.label_url)"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="none" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00002 19.264V12.728C8.00002 9.904 9.81682 8 12.528 8H19.464C22.176 8 24 9.904 24 12.728V19.264C24 22.096 22.176 24 19.464 24H12.528C9.81682 24 8.00002 22.096 8.00002 19.264ZM16.6 17.816V12.736C16.6 12.4 16.328 12.136 16 12.136C15.664 12.136 15.4 12.4 15.4 12.736V17.816L13.424 15.832C13.312 15.72 13.152 15.656 13 15.656C12.8488 15.656 12.696 15.72 12.576 15.832C12.344 16.064 12.344 16.448 12.576 16.68L15.576 19.696C15.8 19.92 16.2 19.92 16.424 19.696L19.424 16.68C19.656 16.448 19.656 16.064 19.424 15.832C19.184 15.6 18.808 15.6 18.568 15.832L16.6 17.816Z"
                    fill="#313232"
                  />
                </svg>
              </a>
            </p-tooltip>
          </span>
        </td>
        <td>{{ item.label_number }} </td>
        <td>{{ item.date }}</td>
        <!-- <td>{{ item.status }}</td> -->
      </tr>
    </tbody>
  </table>
</template>
<script>
import { datetime } from '@/core/utils/datetime'
import { GET_LABEL } from '../../container/store'
import { mapActions } from 'vuex'
import Browser from '@core/helpers/browser'

export default {
  name: 'ListInHub',
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
            status: '',
            route: { name: 'container-detail', params: { code: item.code } },
            date: item.hub_imported_at
              ? datetime(item.hub_imported_at, 'dd/MM/yyyy')
              : 'N/A',
          }
        }

        if (item.type == 'package') {
          return {
            id: item.id,
            type: 'Đơn hàng',
            code: item.code,
            tracking_number: item.tracking_number,
            label_number: 'N/A',
            status: '',
            route: { name: 'package-detail', params: { id: item.id } },
            date: item.hub_imported_at
              ? datetime(item.hub_imported_at, 'dd/MM/yyyy')
              : 'N/A',
            label_url: item.label_url,
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
