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
import api from '@/packages/shared/api'

export default {
  name: 'ResourceUser',
  props: {
    value: {
      type: [Number, String, Object],
      default: 0,
    },
    filter: {
      type: Object,
      default: () => {},
    },
    arrStatus: {
      type: String,
      default: '',
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
    exclude: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: null,
      isLoading: false,
      users: [],
    }
  },
  computed: {
    isTester() {
      return (this.$route.query || {}).tester || 0
    },
  },
  mounted() {
    if (!this.shops || !this.shops.length) {
      this.handleSearch()
    }
  },
  created() {
    this.handleSearch = debounce(async function (search = '') {
      this.isLoading = true
      let response = await api.fetchUsersByRole(
        Object.assign({}, this.filter, {
          search: search,
          not_limit: true,
          status: 1,
          tester: this.isTester,
          arrStatus: this.arrStatus,
        })
      )
      if (response && response.errorMessage) {
        this.users = []
        return
      }

      this.users = response.users
      if (this.exclude.length) {
        this.users = this.users.filter((x) => {
          return !this.exclude.includes(x.id)
        })
      }

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
      const result = await api.fetchUsersByRole(
        Object.assign({}, this.filter, {
          search: search.trim(),
          status: 1,
          tester: this.isTester,
          arrStatus: this.arrStatus,
        })
      )
      this.isLoading = false

      if (result && result.errorMessage) {
        this.users = []
        return
      }
      this.users = result.users
      if (this.exclude.length) {
        this.users = this.users.filter((x) => {
          return !this.exclude.includes(x.id)
        })
      }
    },

    customLabel({ full_name, email, phone_number }) {
      return email !== ''
        ? `${full_name} - ${email}`
        : `${full_name} - ${phone_number}`
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
