<template>
  <div class="page vertical-align">
    <div class="vertical-align-middle">
      <div class="text-center mb-60">
        <h2 class="header-2 mb-24">Reset your password</h2>
      </div>
      <form @submit.prevent="onReset">
        <label class=" font-weight-bold mb-4  ">New password</label>
        <p-input
          type="password"
          validate="on"
          class="mb-20"
          name="password"
          v-model="password"
          :input="password"
          hiddenPass="on"
          :required="requiredPassword"
          placeholder="New password"
          @status="checkPassword($event)"
        />
        <button class="btn btn-special btn-primary mb-20 "
          >Reset Password</button
        >
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import valider from '@core/valider'

export default {
  data() {
    return {
      result: '',
      password: null,
      requiredPassword: false,
      correctPassword: false,
      valider: null,
    }
  },

  created() {
    this.valider = valider.schema((y) => ({
      password: y
        .string()
        .required('Password không để trống')
        .min(6, 'Password tối thiểu 6 ký tự'),
    }))
    this.init()
  },

  methods: {
    ...mapActions('auth', ['resetPassword']),

    checkPassword(e) {
      if (e) {
        return (this.correctPassword = true)
      }
      return (this.correctPassword = false)
    },
    async init() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const params = {
        code: code,
      }
      this.result = await this.resetPassword(params)
      if (this.result.token_expire) {
        return this.$router.push('/404')
      }
    },

    checkRequired() {
      let result = true
      if (!this.password) {
        this.requiredPassword = true
        result = false
      } else {
        this.requiredPassword = false
      }
      return result
    },
    async onReset() {
      if (!this.checkRequired()) {
        return
      }
      if (this.correctPassword == false) {
        return
      }
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const password = this.password
      const params = {
        code: code,
        password: password,
      }
      this.result = await this.resetPassword(params)
      if (this.result.user) {
        this.$toast.open({
          type: 'success',
          message: 'Password is successfully updated.',
        })
        setTimeout(() => {
          return this.$router.push('/sign-in')
        }, 2000)
      } else {
        this.$toast.open({ type: 'error', message: this.result.errorMessage })
      }
    },
  },
}
</script>
<style></style>
