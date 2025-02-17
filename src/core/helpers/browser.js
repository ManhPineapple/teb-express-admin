const Browser = {
  supportLocalStorage: null,

  /**
   * Return true if this browser support localStorage
   * @returns {*}
   */
  isSupportLocalStorage() {
    if (this.supportLocalStorage === null) {
      const test = 'test'

      try {
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        this.supportLocalStorage = true
      } catch (e) {
        this.supportLocalStorage = false
      }
    }

    return this.supportLocalStorage
  },

  /**
   * Redirect to url
   * @param url
   */
  redirect(url) {
    window.location = url
  },

  /**
   * Open _new tab
   * @param url
   */
  openNewTab(url) {
    const win = window.open(url, '_blank')
    if (!win) {
      window.location.href = url
    }
  },

  /**
   * Insert param to url
   * @param myUrl
   * @param name
   * @param value
   * @returns {*}
   */
  insertParamToUrl(myUrl, name, value) {
    let newUrl = myUrl
    const re = new RegExp(`([?&]${name}=)[^&]+`, '')

    function add(sep) {
      newUrl += `${sep}${name}=${encodeURIComponent(value)}`
    }

    function change() {
      newUrl = newUrl.replace(re, `$1${encodeURIComponent(value)}`)
    }

    if (newUrl.indexOf('?') === -1) {
      add('?')
    } else if (re.test(newUrl)) {
      change()
    } else {
      add('&')
    }

    return newUrl
  },

  /**
   * Insert params to url
   * @param myUrl
   * @param params
   * @returns {*}
   */
  insertParamsToUrl(myUrl, params) {
    let newUrl = myUrl

    Object.keys(params).forEach((k) => {
      if (typeof params[k] !== 'undefined') {
        newUrl = this.insertParamToUrl(newUrl, k, params[k])
      }
    })

    return newUrl
  },

  /**
   * Get Url Param
   * @param name
   * @returns {string|null}
   */
  getURLParameter(name) {
    return (
      decodeURIComponent(
        (new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(
          window.location.search
        ) || [null, ''])[1].replace(/\+/g, '%20')
      ) || null
    )
  },

  /**
   * Download by link
   * @param link
   * @param filename
   */
  download(link, filename = 'download') {
    const element = document.createElement('a')

    element.setAttribute('href', link)
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },

  /**
   * Download by link
   * @param link
   */
  openInNewTab(link) {
    const element = document.createElement('a')

    element.setAttribute('href', link)
    element.setAttribute('target', '_blank')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },

  /**
   * Download blob
   * @param blob
   * @param filename
   */
  downloadBlob(blob, filename = 'download') {
    const url = window.URL.createObjectURL(blob)
    this.download(url, filename)
  },

  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64)
    var binaryLen = binaryString.length
    var bytes = new Uint8Array(binaryLen)
    for (var i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  },
  saveByteArray(fileName, byte, type) {
    var blob = new Blob([byte], { type: type })
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  },
}

export default Browser
