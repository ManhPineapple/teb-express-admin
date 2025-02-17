import http from '@core/services/http'
import Browser from '@core/helpers/browser'

export default {
  methods: {
    async downloadFile(url, type, filename, prefix) {
      if (!filename || filename === '') {
        const arr = url.split('/')
        arr.shift()
        filename = arr.join('_')
      }

      const buckets = {
        packages: 'export_packages',
      }

      const bucket = buckets[type]
      const data = await http.get(
        `/uploads/file-export/download?type=${bucket}&url=${url}`,
        {
          type: 'blob',
        }
      )

      try {
        Browser.downloadBlob(
          data,
          prefix +
            new Date().toLocaleDateString('de-DE').replaceAll('.', '_') +
            '.' +
            `${filename}`.split('.')[1]
        )
      } catch (error) {
        this.$toast.open({ type: 'error', message: 'File error !!!' })
      }
    },
    async downloadPackage(url, type, filename) {
      if (!filename || filename === '') {
        const arr = url.split('/')
        arr.shift()
        filename = arr.join('_')
      }

      const buckets = {
        packages: 'export_packages',
      }

      const bucket = buckets[type]
      const data = await http.get(
        `/uploads/file-export/download?type=${bucket}&url=${url}`,
        {
          type: 'blob',
        }
      )

      try {
        Browser.downloadBlob(data, `${filename}`.split('.')[0])
      } catch (error) {
        this.$toast.open({ type: 'error', message: 'File error !!!' })
      }
    },
  },
}
