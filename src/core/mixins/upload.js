import AuthService from '@core/services/auth'

export default {
  computed: {
    uploadHeaders() {
      return {
        Authorization: `Bearer ${AuthService.getAccessToken()}`,
      }
    },
    uploadEndpoint() {
      return `${process.env.VUE_APP_BASE_API_ENDPOINT}/uploads`
    },
    uploadFileEndpoint() {
      return `${process.env.VUE_APP_BASE_API_ENDPOINT}/uploads/files`
    },
  },
  methods: {
    createEndpoint(endpoint) {
      return `${process.env.VUE_APP_BASE_API_ENDPOINT}/${endpoint}`
    },
  },
}
