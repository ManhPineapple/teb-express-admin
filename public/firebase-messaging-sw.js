/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: 'AIzaSyAjOy8y98V9I5Whn93X6AFnLGOlOi3YkWI',
  authDomain: 'lionnix-firebase.firebaseapp.com',
  projectId: 'lionnix-firebase',
  storageBucket: 'lionnix-firebase.appspot.com',
  messagingSenderId: '805771800718',
  appId: '1:805771800718:web:9e4d2b76e3c30e942059df',
  measurementId: 'G-1L19FQ99D0',
})

const isSupported = firebase.messaging.isSupported()
if (isSupported) {
  const messaging = firebase.messaging()
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload)
    // const {
    //   notification: { title, body, image },
    // } = payload
    //
    // self.registration.showNotification(title, {
    //   body,
    //   icon: image || '/favicon.svg',
    // })
  })

  messaging.onBackgroundMessage((payload) => {
    console.log(payload)
    // const {
    //   notification: { title, body, image },
    // } = payload
    // self.registration.showNotification(title, {
    //   body,
    //   icon: image || '/favicon.svg',
    // })
  })
}
