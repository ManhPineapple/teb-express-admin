<template>
  <p-modal :active="visible" title="Xem promotion" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12 p-desc">
        <div class="form-group">
          <b>Tên</b>
          <input
            type="text"
            class="form-control"
            :value="current.name"
            disabled
          />
        </div>
        <div class="form-group" v-if="price">
          <b>Giá ($):</b>
          <input type="text" class="form-control" :value="price" disabled />
        </div>
        <div class="form-group">
          <b>Mô tả</b>
          <textarea
            type="text"
            class="form-control"
            disabled
            :value="current.description"
            style="overflow: scroll"
          ></textarea>
        </div>
        <div class="d-flex justify-content-between" v-if="s3PathPrice">
          <span>Chỉnh sửa giá</span>
          <a :href="s3PathPrice">Tải về</a>
        </div>
        <div class="d-flex justify-content-between mb-20" v-if="s3PathWeight">
          <span>Chỉnh sửa cân nặng</span>
          <a :href="s3PathWeight">Tải về</a>
        </div>
        <hr />
        <div class="form-group">
          <b>Khách hàng áp dụng</b>
          <div class="user-select-box">
            <p-input
              placeholder="Tìm kiếm"
              prefixIcon="search"
              type="search"
              :value="search"
              @input="searchHandle"
            >
            </p-input>
            <div class="list-user-select">
              <ul>
                <li
                  v-for="item in displayUsers"
                  :key="item.id"
                  :title="item.name"
                  >{{ item.name }}</li
                >
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">Đóng</p-button>
      </div>
    </template>
  </p-modal>
</template>
<script>
import api from '../api'

export default {
  name: 'ModalDescription',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      users: [],
      isLoading: false,
      search: '',
    }
  },
  computed: {
    s3PathPrice() {
      const path = (this.current || {}).s3_path_price || ''
      return path ? `${process.env.VUE_APP_ASSETS}/${path}` : ''
    },
    s3PathWeight() {
      const path = (this.current || {}).s3_path_weight || ''
      return path ? `${process.env.VUE_APP_ASSETS}/${path}` : ''
    },
    tester() {
      return this.$route.query.tester ? parseInt(this.$route.query.tester) : 0
    },
    displayUsers() {
      return this.users.filter(({ full_name, email }) => {
        return email.includes(this.search) || full_name.includes(this.search)
      })
    },
    price() {
      return (this.current || {}).price || 0
    },
  },
  methods: {
    async init() {
      this.isLoading = true
      const res = await api.fetchPromotionUsers(this.current.id)
      this.isLoading = false

      if (res && res.errorMessage) {
        this.users = []
        return
      }

      this.users = (res.users || []).map(({ id, full_name, email }) => {
        return {
          id,
          full_name,
          email,
          name: full_name ? `${full_name} - ${email}` : email,
        }
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    searchHandle(search) {
      this.search = search
    },
  },
  watch: {
    visible: {
      handler: function (v) {
        if (v) this.init()
      },
    },
  },
}
</script>
<style>
.p-desc .list-user-select {
  width: 100%;
  height: 150px;
}
</style>
