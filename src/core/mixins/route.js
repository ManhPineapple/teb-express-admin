import { cloneDeep, isObjectDiff } from '@core/utils'
import { NOT_STAFF_GET_LIMIT } from '@core/constants'

export default {
  data() {
    return {
      firstload: false,
      filter: {},
    }
  },
  updated() {
    this.firstload = true
  },
  methods: {
    toBack() {
      return this.$router.go(-1)
    },
    getRouteQuery() {
      const query = {}

      Object.keys(this.filter).forEach((key) => {
        if (typeof this.$route.query[key] !== 'undefined') {
          let value = this.$route.query[key]
          switch (typeof this.filter[key]) {
            case 'number':
              value = Number(value)
              break
            case 'boolean':
              value = !!value
              break
          }

          query[key] = value
        } else {
          query[key] = this.filter[key]
        }
      })

      const max = NOT_STAFF_GET_LIMIT
      query.limit = query.limit <= max ? query.limit : max

      return Object.assign({}, this.$route.query, query)
    },
    handleUpdateRouteQuery(append = {}, reset_message = false) {
      let params = cloneDeep(this.$route.query)
      params = Object.assign(params, this.filter, append)

      if (!params.page && !reset_message) {
        params.page = 1
      }

      let query = {}
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key]) {
          query[key] = params[key]
        }
      }

      if (reset_message) {
        delete query['message']
        delete query['type']
      }

      this.$router
        .push({
          query,
          path: this.$route.path,
        })
        .catch(() => {}) // ko xoa. loi thi chay yarn upgrade
    },
    updatePageNumber() {
      if (!this.firstload) return
      if (this.filter.page > 1) {
        this.filter.page = 1
      }
    },
  },
  watch: {
    $route: function() {
      const filters = this.getRouteQuery()

      if (isObjectDiff(filters, this.filter)) {
        this.filter = filters
      }
    },
    'filter.status': function() {
      this.updatePageNumber()
    },
    'filter.search': function() {
      this.updatePageNumber()
    },
    'filter.search_by': function() {
      this.updatePageNumber()
    },
  },
}
