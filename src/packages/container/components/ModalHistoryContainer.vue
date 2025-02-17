<template>
  <p-modal :active="visible" :title="`Lịch sử kiện hàng`" @close="handleClose">
    <VclTable class="mt-20" v-if="isLoading"></VclTable>
    <div class="deliver-log" v-else-if="histories.length">
      <div class="timeline">
        <div
          v-for="(item, i) in displayDeliverLogs"
          :key="i"
          :class="{
            'first-item': i === 0 && timelinePagination.currentPage === 1,
          }"
          class="timeline-item"
        >
          <div class="timeline-item__left">
            <div>
              {{ item.ship_time | datetime('dd/MM/yyyy') }}
            </div>
            <div>
              {{ item.ship_time | datetime('HH:mm:ss') }}
            </div>
          </div>
          <div class="timeline-item__right">
            <div v-html="item.text"></div>
            <span v-if="item.location"
              ><i class="fa fa-map-marker mr-1"></i> {{ item.location }}</span
            >
          </div>
        </div>
      </div>
      <div class="timeline__next-page">
        <div
          :class="{
            'disable-next-page': timelinePagination.currentPage <= 1,
          }"
          @click="previousTimeLinePage"
          >Trước</div
        ><div
          :class="{
            'disable-next-page':
              timelinePagination.currentPage >= timelinePagination.numberPage ||
              timelinePagination.numberPage <= 1,
          }"
          @click="nextTimeLinePage"
          >Sau</div
        >
      </div>
    </div>
    <empty-search-result v-else></empty-search-result>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { GET_HISTORY_CONTAINER } from '../store'
import { mapActions } from 'vuex'
export default {
  name: 'ModalHistoryContainer',
  components: {
    EmptySearchResult,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    displayDeliverLogs() {
      const start =
        (this.timelinePagination.currentPage - 1) *
        this.timelinePagination.itemsPerPage
      return this.histories
        .slice(start, start + this.timelinePagination.itemsPerPage)
        .map((log) => {
          return {
            ship_time: log.ship_time,
            text: log.description,
            location: log.location,
          }
        })
    },
  },
  data() {
    return {
      timelinePagination: {
        numberPage: 0,
        itemsPerPage: 5,
        currentPage: 1,
      },
      isLoading: false,
      histories: [],
    }
  },
  methods: {
    ...mapActions('container', [GET_HISTORY_CONTAINER]),
    async init() {
      this.isLoading = true
      const payload = {
        id: this.id,
      }
      let r = await this[GET_HISTORY_CONTAINER](payload)
      this.isLoading = false
      if (!r.success) {
        this.$toast.open({
          message: r.message,
          type: 'error',
        })
        return
      }
      this.histories = r.logs
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {},
    previousTimeLinePage() {
      this.timelinePagination.currentPage <= 1
        ? (this.timelinePagination.currentPage = 1)
        : (this.timelinePagination.currentPage -= 1)
    },
    nextTimeLinePage() {
      this.timelinePagination.currentPage =
        this.timelinePagination.currentPage >=
        this.timelinePagination.numberPage
          ? this.timelinePagination.numberPage
          : this.timelinePagination.currentPage + 1
    },
  },
  watch: {
    histories: {
      handler: function (val) {
        if (val.length > 0) {
          this.timelinePagination.numberPage = Math.ceil(
            val.length / this.timelinePagination.itemsPerPage
          )
        }
      },
      deep: true,
    },
    visible: {
      handler: function (val) {
        if (val) {
          this.init()
        } else {
          this.histories = []
        }
      },
      deep: true,
    },
  },
}
</script>
<style>
.modal-body .page-not-found {
  min-height: unset;
}
.modal-body .page-not-found .content {
  position: unset;
  top: unset;
  left: unset;
  transform: unset;
  height: auto;
  width: auto;
}
</style>
