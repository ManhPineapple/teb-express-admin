<template>
  <table class="table table-hover" id="tbl-shipments">
    <thead>
      <tr>
        <template>
          <th>MÃ LÔ</th>
          <th class="text-center">TỔNG KIỆN HÀNG</th>
          <th>MANIFEST</th>
          <th>NGÀY TẠO</th>
          <th></th>
        </template>
      </tr>
    </thead>
    <tbody
      v-for="(item, i) in displayItems"
      :key="i"
      :class="{ 'tbody-opened': opened.includes(item.id) }"
    >
      <tr>
        <td>
          <a href="#">
            {{ item.id }}
          </a>
        </td>
        <td class="text-center">
          {{ item.count_container }}
        </td>
        <td
          >{{ item.tracking_number }}
          <span class="download-label" v-if="item.label_url">
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
        <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
        <td>
          <p-button
            class="btn btn-detail"
            :loading="isLoading(item.id)"
            @click="toggle(item.id)"
            :type="`java-blue`"
          >
            Chi tiết
          </p-button>
        </td>
      </tr>

      <tr
        v-if="item.containers.length > 0"
        v-show="opened.includes(item.id) && !isFetching && item.containers"
        class="item-shipment"
      >
        <td>
          <a href="#">
            {{ item.id }}
          </a>
        </td>
        <td class="text-center">
          {{ item.count_container }}
        </td>
        <td>{{ item.tracking_number }} </td>
        <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
        <td>
          <p-button
            class="btn btn-detail"
            @click="close(item.id)"
            :type="`java-blue`"
          >
            Thu gọn
          </p-button>
        </td>
      </tr>
      <tr
        class="info"
        v-show="opened.includes(item.id) && !isFetching && item.containers"
      >
        <td colspan="5">
          <table
            class="table table-container"
            :class="{ 'table-scroll': item.containers.length > 10 }"
          >
            <thead>
              <tr>
                <th>Mã kiện hàng</th>
                <th>Ngày tạo</th>
                <th colspan="2">Nhãn kiện hàng</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Trọng lượng</th>
                <th class="text-center">Dài x Rộng x Cao</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in item.containers" :key="i">
                <td>
                  <router-link
                    v-if="$isAdmin()"
                    :to="{
                      name: 'container-detail',
                      params: {
                        code: item.code,
                      },
                    }"
                    class="code"
                  >
                    {{ item.code }}
                  </router-link>
                  <span v-else>{{ item.code }}</span>
                </td>
                <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                <td class="align-center" colspan="2">
                  <a
                    class="mr-2"
                    v-if="item.tracking_number"
                    href="javascript:void(0)"
                    >{{ item.tracking_number }}</a
                  >

                  <span class="svg" v-if="item.tracking_number">
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

                  <span class="svg" v-if="item.tracking_number">
                    <p-tooltip
                      class="item_name"
                      :label="` Track `"
                      position="bottom"
                      type="dark"
                    >
                      <a
                        target="_blank"
                        :href="`https://www.ups.com/track?loc=vi_VN&tracknum=${item.tracking_number}&requester=WT/`"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="16" cy="16" r="16" fill="none" />
                          <g clip-path="url(#clip0_382_4459)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M12.0682 18.9542L8.14707 17.6451C7.95102 17.5204 7.95102 17.3957 8.14707 17.2711L23.4723 8.04502C23.6356 7.95151 23.701 8.01385 23.7337 8.13853L23.9951 22.5074C24.0278 22.7568 23.8971 22.8815 23.6356 22.7568L18.2114 20.9802L16.4795 23.9101C16.4142 24.0347 16.2508 24.0347 16.2508 23.8789L15.7607 20.0763L21.7404 11.5671L14.8784 18.2373C14.1268 18.9542 13.2119 19.2035 12.0682 18.9542Z"
                              fill="#313232"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_382_4459">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(8 8)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </p-tooltip>
                  </span>
                </td>
                <td class="text-center">{{
                  item.container_items ? item.container_items.length : '0'
                }}</td>
                <td class="text-center">{{ item.weight }}</td>
                <td class="text-center">
                  {{ getBoxInfo(item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { FETCH_SHIPMENT_DETAIL } from '../../shipment/store'
import { mapState, mapActions } from 'vuex'
import { GET_LABEL } from '../../container/store'
import Browser from '@core/helpers/browser'

export default {
  name: 'ListInHub',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      opened: [],
      isFetching: false,
      idLoading: null,
      currentFaq: -10,
    }
  },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
    }),
    displayItems() {
      return this.items.map((item) => ({
        id: item.id,
        tracking_number: item.tracking_number,
        route: { name: 'shipment-detail', params: { id: item.id } },
        containers: [],
        label_url: item.label_url,
        count_container: item.count_container,
        created_at: item.created_at,
      }))
    },
  },

  methods: {
    ...mapActions('shipment', [FETCH_SHIPMENT_DETAIL]),
    ...mapActions('container', [GET_LABEL]),

    async toggle(id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        return
      } else {
        this.isFetching = true
        this.idLoading = id
        const result = await this[FETCH_SHIPMENT_DETAIL]({ id: id })
        this.isFetching = false
        this.idLoading = null
        if (!result.success) {
          this.$toast.open({ message: result.message, type: 'error' })
        }
        this.displayItems.map((item) => {
          if (item.id == this.shipment.id) {
            item.containers = [...this.shipment.containers]
          }
        })
        this.opened.push(id)
      }
    },
    close(id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
      }
    },

    getBoxInfo(container) {
      return `${container.length} x ${container.width}  x ${container.height}`
    },
    isLoading(id) {
      return this.idLoading == id
    },

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
