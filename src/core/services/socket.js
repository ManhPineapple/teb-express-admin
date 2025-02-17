// import AuthService from '@core/services/auth'

export const socket = {
  conn: null,

  // connect(callbackMessage) {
  //   if (!window['WebSocket']) {
  //     return this
  //   }
  //
  //   this.conn = new WebSocket(process.env.VUE_APP_WEBSOCKET_URL)
  //   this.onOpen()
  //   this.onMessage((e) => {
  //     callbackMessage(e)
  //   })
  //   this.onclose(() => {
  //     setTimeout(() => {
  //       this.connect(callbackMessage)
  //     }, 3000)
  //   })
  //
  //   return this
  // },
  //
  // onOpen() {
  //   const token = AuthService.getAccessToken()
  //   if (!token) {
  //     return
  //   }
  //
  //   this.conn.addEventListener('open', () => {
  //     this.conn.send(JSON.stringify({ type: 'connect', token: token }))
  //   })
  // },
  //
  // onclose(callback) {
  //   this.conn.onclose = function(e) {
  //     callback(e)
  //   }
  // },
  //
  // onSend(data) {
  //   if (!data || !this.conn) {
  //     return
  //   }
  //
  //   this.conn.send(data)
  // },
  //
  // onMessage(callback) {
  //   this.conn.addEventListener('message', (e) => {
  //     callback(e)
  //   })
  // },
  //
  // onEvent(eventName, callback) {
  //   this.conn.addEventListener(eventName, (e) => {
  //     callback(e)
  //   })
  // },
}

export default socket
