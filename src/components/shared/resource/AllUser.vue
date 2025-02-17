<template>
  <div>
    <multiselect
      class="multiselect-custom"
      v-model="selected"
      :options="users"
      :placeholder="label"
      :custom-label="customLabel"
      :loading="isLoading"
      @search-change="fetchUsers"
      @select="handleSelect"
      @remove="handleRemove"
      :emitID="emitID"
      :showDropdown="false"
    >
    </multiselect>
    <div
      v-if="selected"
      class="multiselect__clear"
      @click.prevent="handleRemove"
    >
      <p-svg name="x"></p-svg>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import api from '@/packages/setting/api'

export default {
  name: 'AllUser',
  props: {
    value: {
      type: [Number, String, Object],
      default: 0,
    },
    filter: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: 'Search user',
    },
    emitID: {
      type: Boolean,
      default: true,
    },
    search: {
      type: String,
      default: '',
    },
    isTester: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selected: null,
      isLoading: false,
      users: [],
    }
  },
  mounted() {
    if (!this.shops || !this.shops.length) {
      this.handleSearch()
    }
  },
  created() {
    this.handleSearch = debounce(async function (search = '') {
      this.isLoading = true
      let response = await api.listUsers(
        Object.assign({}, this.filter, {
          search: search,
          not_limit: true,
          tester: this.isTester,
        })
      )
      if (response && response.errorMessage) {
        this.users = []
        return
      }

      this.users = response.users
      this.isLoading = false
      if (this.search != '') {
        this.selected = this.users.filter((x) => x.email == this.search)
        this.user = this.users.find((x) => x.email == this.search)
        if (this.emitID) {
          this.$emit('input', this.user && this.user.id ? this.user.id : 0)
          return
        }
        this.$emit('input', this.user)
      }
    }, 500)
  },
  methods: {
    async fetchUsers(search = '') {
      this.isLoading = true
      const result = await api.listUsers(
        Object.assign({}, this.filter, {
          search: search.trim(),
          not_limit: true,
          tester: this.isTester,
        })
      )
      this.isLoading = false

      if (result && result.errorMessage) {
        this.users = []
        return
      }
      // if (this.filter.code) {
      //   this.selected = result.users ? result.users[0] : ''
      //   this.handleSelect(this.selected)
      // }
      this.users = result.users
    },

    customLabel({ id, full_name, email, phone_number }) {
      return email !== ''
        ? `U${id} - ${full_name} - ${email}`
        : `U${id} - ${full_name} - ${phone_number}`
    },

    handleSelect(user) {
      if (this.emitID) {
        this.$emit('input', user && user.id ? user.id : 0)
        return
      }
      this.$emit('input', user)
    },

    handleRemove() {
      this.selected = null
      if (this.emitID) {
        this.$emit('input', 0)
        return
      }
      this.$emit('input', null)
    },
  },
  // watch: {
  //   filter: {
  //     handler: function() {
  //       this.fetchUsers()
  //     },
  //     deep: true,
  //   },
  // },
}
</script>

<style lang="scss">
.user-resource {
  width: 100%;
  position: relative;
}
.multiselect__clear {
  line-height: 40px;
  display: block;
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  right: 1px;
  text-align: center;
  cursor: pointer;
  z-index: 4;
}
</style>
