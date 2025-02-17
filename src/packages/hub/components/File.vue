<template>
  <div @click="showContent" class="img-thumbnail">
    <img
      :src="image"
      :data-src="src"
      :class="className"
      v-if="image"
      alt="Thumbnail"
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
const THUMBNAIL_PROCESS = `${URL_ASSETS}/design-process.gif`

export default {
  name: 'File',
  props: {
    src: {
      type: String,
      default: '',
    },
    allowDownloadImg: {
      type: Boolean,
      default: true,
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
      className: 'center',
      blob: null,
      callAPi: false,
      isError: false,
    }
  },
  methods: {
    showNotify() {},
    getThumbnailUrl(src) {
      if (!src) return THUMBNAIL_PROCESS

      if (src.indexOf('http') === 0) return src

      const ext = extension(src)
      if (ext === 'psd') return THUMBNAIL_PSD
      if (ext === 'csv') return THUMBNAIL_CSV
      if (ext === 'xlsx' || ext === 'xls') return THUMBNAIL_XLSX

      return `${URL_IMAGES}/${src}`
    },
    showContent() {
      if (this.allowDownloadImg) {
        this.download()
        return
      }
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
      const res = await api.fetchFile({
        url: this.src,
        type: 'return_packages',
      })
      if (res && !res.error) {
        this.blob = window.URL.createObjectURL(res)
        this.$zoom.open(this.blob)
      }
    },
    async download() {
      const res = await api.fetchFile({
        url: this.src,
        type: 'return_packages',
      })
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
<style scoped lang="scss">
.img-thumbnail {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  text-align: center;
  background: transparent;

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.1;
  }
  &:hover:after {
    opacity: 0;
  }
}
</style>
