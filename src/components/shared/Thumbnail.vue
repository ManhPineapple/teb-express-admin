<template>
  <img
    :src="image"
    :data-src="src"
    :class="className"
    v-if="image"
    alt="Thumbnail"
    @error="handleImageError"
    v-bind="$attrs"
  />
</template>

<script>
import api from '@/packages/design/api'

export default {
  name: 'Thumbnail',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  computed: {
    thumbnail() {
      if (this.src) {
        return this.getThumbnailUrl(this.src)
      }

      return this.src
    },
  },
  data() {
    return {
      count: 0,
      className: '',
      image: '',
      callAPi: false,
    }
  },
  methods: {
    handleImageError() {
      const thumbnailDefault = `${process.env.VUE_APP_ASSETS}/thumbnail.png`
      const thumbnailPsdDefault = `${process.env.VUE_APP_ASSETS}/psd-default.png`
      const thumbnailCsvDefault = `${process.env.VUE_APP_ASSETS}/csv-default.png`

      if (!this.src) {
        this.image = thumbnailDefault
        return
      }

      const re = /(?:\.([^.]+))?$/
      let extPsd = re.exec(this.src)[1]

      if (extPsd === 'psd') {
        this.image = thumbnailPsdDefault
        return
      }

      if (extPsd === 'csv') {
        this.image = thumbnailCsvDefault
        return
      }

      setTimeout(() => {
        if (this.count < 10) {
          this.image = `${this.thumbnail}?t=${new Date().getTime()}`
          this.count++
        } else {
          this.image = thumbnailDefault
        }
      }, 3000)

      if (this.callAPi) {
        this.image = `${process.env.VUE_APP_ASSETS}/thumbnail-default.gif`
        return
      }

      this.image = `${process.env.VUE_APP_ASSETS}/design-process.gif`
      this.className = 'miss-thumbnail'

      if (this.src.startsWith('blob')) {
        return
      }

      api
        .missingThumbnail(this.src)
        .then((response) => {
          this.className = ''
          this.callAPi = true
          if (response && response.success) {
            if (response.url.length) {
              this.image = response.url
            } else {
              this.image = thumbnailDefault
            }
          } else {
            this.image = `${process.env.VUE_APP_ASSETS}/thumbnail-default.gif`
            this.showNotify()
          }
        })
        .catch(this.showNotify)
    },

    showNotify() {},

    getThumbnailUrl(src) {
      return src.indexOf('http') === 0
        ? src
        : `${process.env.VUE_APP_BASE_IMAGE_URL}/${src}`
    },
  },
  watch: {
    src: {
      handler(val) {
        if (val) {
          this.image = this.getThumbnailUrl(val)
        }
      },
      immediate: true,
    },
  },
}
</script>
