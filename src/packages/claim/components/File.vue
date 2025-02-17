<template>
  <div @click="showContent">
    <img
      :src="image"
      :data-src="src"
      :class="className"
      v-if="image"
      alt="Thumbnail"
      @error="handleImageError"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import api from '../api'
import { extension } from '@core/utils/url'
import Browser from '@core/helpers/browser'

//eslint-disable-next-line
const re = new RegExp('^(s|/)+|(s|/)+$', 'g')
const URL_ASSETS = process.env.VUE_APP_ASSETS.replace(re, '')
const URL_IMAGES = process.env.VUE_APP_BASE_IMAGE_URL.replace(re, '')

const THUMBNAIL_PSD = `${URL_ASSETS}/psd-default.png`
const THUMBNAIL_CSV = `${URL_ASSETS}/csv-default.png`
const THUMBNAIL_XLSX = `${URL_ASSETS}/xlsx-default.png`

export default {
  name: 'TicketFile',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  computed: {
    isImage() {
      const ext = extension(this.src)
      return ['png', 'jpg', 'jpeg'].includes(ext)
    },
  },
  data() {
    return {
      count: 0,
      image: '',
      className: '',
      blob: null,
      callAPi: false,
      isError: false,
    }
  },
  methods: {
    async handleImageError() {
      this.isError = true
      if (this.count < 10) {
        setTimeout(() => {
          const src = this.getThumbnailUrl(this.src)
          this.image = `${src}?t=${new Date().getTime()}`
          this.count++
        }, 3000)
      } else {
        this.image = `${URL_ASSETS}/thumbnail-default.gif`
      }

      if (this.callAPi) {
        this.image = `${URL_ASSETS}/thumbnail-default.gif`
        return
      }

      this.image = `${URL_ASSETS}/design-process.gif`
      this.className = 'miss-thumbnail'

      const res = await api.missThumbnail(this.src)
      if (!res || res.error) {
        this.showNotify()
      }

      this.callAPi = true
      this.image = `${URL_IMAGES}/${res.url}?t=${new Date().getTime()}`
      this.isError = false
    },
    showNotify() {},
    getThumbnailUrl(src) {
      if (src.indexOf('http') === 0) return src

      const ext = extension(src)
      if (ext === 'psd') return THUMBNAIL_PSD
      if (ext === 'csv') return THUMBNAIL_CSV
      if (ext === 'xlsx' || ext === 'xls') return THUMBNAIL_XLSX

      return `${URL_IMAGES}/${src}`
    },
    showContent() {
      if (this.isImage) {
        this.zoomImage()
      } else {
        this.download()
      }
    },
    async zoomImage() {
      if (!this.isImage) return

      if (this.blob) {
        this.$zoom.open(this.blob)
        return
      }

      if (this.isError) return
      const res = await api.fetchTicketFile({ url: this.src, type: 'tickets' })
      if (res && !res.error) {
        this.blob = window.URL.createObjectURL(res)
        this.$zoom.open(this.blob)
      }
    },
    async download() {
      const res = await api.fetchTicketFile({ url: this.src, type: 'tickets' })
      if (res && !res.error) {
        Browser.downloadBlob(res, this.src.split('/').pop())
      }
    },
  },
  watch: {
    src: {
      handler(v) {
        this.blod = null
        this.image = this.getThumbnailUrl(v)
      },
      immediate: true,
    },
  },
}
</script>
