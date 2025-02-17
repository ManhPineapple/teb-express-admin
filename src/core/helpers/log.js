let isEnableLog = false

/**
 * Set enable log
 * @param enable
 */
export function setEnableLog(enable) {
  isEnableLog = enable
}

/**
 * Handle console log
 * @param type
 * @param args
 */
function consoleLog(type, args) {
  if (!isEnableLog) {
    return
  }

  /* eslint-disable */
  switch (type) {
    case 'info':
      console.info(...args)
      break
    case 'warn':
      console.warn(...args)
      break
    case 'error':
      console.error(...args)
      break
    default:
      console.log(...args)
      break
  }
  /* eslint-enable */
}

/**
 * Console log
 *
 * @param messages
 */
export function log(...messages) {
  consoleLog('', messages)
}

/**
 * Console info
 *
 * @param messages
 */
export function info(...messages) {
  consoleLog('info', messages)
}

/**
 * Console warn
 *
 * @param messages
 */
export function warn(...messages) {
  consoleLog('warn', messages)
}

/**
 * Console error
 *
 * @param messages
 */
export function error(...messages) {
  consoleLog('error', messages)
}

/**
 * Init global log
 */
export function initGlobalLog() {
  window.log = log
  window.error = error
  window.info = info
  window.warn = warn
}

export default log
