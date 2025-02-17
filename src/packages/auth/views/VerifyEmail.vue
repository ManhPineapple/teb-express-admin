<template>
  <div class="page vertical-align verify-email ">
    <h2>Thank you for using</h2>
    <p
      >A verification mail has been sent to your email account. Please check
      your inbox to verify.</p
    >
    <p>Still can't find the email?</p>
    <p-button
      class="btn btn-special btn-primary mt-20 mb-20"
      :loading="isLoading"
      :disabled="counting"
      @click="handleResendEmail"
    >
      <span v-if="counting">Resend Email again {{ count }} </span>
      <span v-if="!counting">Resend verification Email</span>
    </p-button>
    <p class="tip">
      Tip: If you have not received the email, please check your
      <br />
      <b>Spam</b> or <b>Trash folder</b>
    </p>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixinRoute from '@core/mixins/route'
import Storage from '@core/helpers/storage'

export default {
  name: 'VerifyEmail',
  mixins: [mixinRoute],
  filters: {},
  computed: {
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    code() {
      return this.$route.params.code
    },
  },

  data() {
    return {
      isLoading: false,
      result: {},
      counting: false,
      count: '2m',
    }
  },

  created() {
    this.init()
  },

  methods: {
    ...mapActions('auth', ['verifyEmail', 'resendEmail']),

    // To do clean code
    async init() {
      let now = new Date().getTime()
      if (Storage.get('expried') < now || Storage.get('expried') == null) {
        let expried = new Date().getTime() + 2 * 60000
        Storage.set('expried', expried)
        this.counting = true
        this.countDownTimer()
      } else {
        this.count = Storage.get('count')
        this.counting = Storage.get('counting')
        this.countDownTimer()
      }
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const params = {
        code: code,
      }
      if (code) {
        const result = await this.verifyEmail(params)
        if (result.success) {
          if (result.permission) {
            return this.$router.push('/')
          }
          return this.$toast.open({
            type: 'error',
            message: 'You are not allowed to do this action !',
          })
        } else {
          return this.$router.push('/404')
        }
      }
    },

    async handleResendEmail() {
      // To do bo console log
      if (!Storage.get('userEmail')) {
        return
      }
      this.isLoading = true

      const params = {
        email: Storage.get('userEmail'),
      }
      let response = await this.resendEmail(params)
      // To do clean code
      if (response.success) {
        this.$toast.open({
          type: 'success',
          message:
            'Successfully! Please check your email to activate the account.',
        })
        setTimeout(() => {
          this.isLoading = false
        }, 2000)
        this.counting = true
        let now = new Date().getTime()

        if (Storage.get('expried') < now || Storage.get('expried') == null) {
          let expried = new Date().getTime() + 2 * 60000
          Storage.set('expried', expried)
          this.countDownTimer()
        } else {
          this.countDownTimer()
        }
        return
      }
      this.$toast.open({ type: 'error', message: response.message })
    },

    countDownTimer() {
      let countDownDate = Storage.get('expried')
      let x = setInterval(
        function() {
          let now = new Date().getTime()

          // Find the distance between now and the count down date
          let distance = countDownDate - now

          // Time calculations for minutes and seconds
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          let seconds = Math.floor((distance % (1000 * 60)) / 1000)

          // Display the result in the element with id="demo"
          this.count = minutes + 'm ' + seconds + 's '

          // If the count down is finished, write some text
          if (distance < 0) {
            this.counting = false
            clearInterval(x)
          }
        }.bind(this),
        1000
      )
      Storage.set('count', this.count)
      Storage.set('counting', this.counting)
    },
  },

  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
