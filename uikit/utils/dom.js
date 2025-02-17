import Vue from 'vue'
const isServer = Vue.prototype.$isServer

export function removeElement(el) {
  if (typeof el.remove !== 'undefined') {
    el.remove()
  } else if (typeof el.parentNode !== 'undefined') {
    el.parentNode.removeChild(el)
  }
}

/**
 *
 */
export const domOff = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 *
 */
export const domOn = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * Generate id
 * @returns {number}
 */
export const generateId = function() {
  return Math.floor(Math.random() * 10000)
}

/**
 * Add class
 * @param el
 * @param cls
 */
export function addClass(el, cls) {
  if (!el) {
    return
  }

  let curClass = el.className
  let classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]
    if (!clsName) {
      continue
    }

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }

  if (!el.classList) {
    el.className = curClass
  }
}

/**
 * Remove class
 * @param el
 * @param cls
 */
export function removeClass(el, cls) {
  if (!el || !cls) {
    return
  }

  let classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]

    if (!clsName) {
      continue
    }

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }

  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 *
 * @param el
 * @param cls
 * @returns {boolean}
 */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/**
 *
 * @param string
 * @returns {string}
 */
const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
