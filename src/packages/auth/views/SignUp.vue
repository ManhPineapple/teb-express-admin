<template>
  <div class="page vertical-align sign-up">
    <div class="vertical-align-middle">
      <div class="header mb-16">
        <div class="header-2"> Tạo tài khoản mới </div>
      </div>

      <form :model="form" class="" @submit.prevent="onSignUp">
        <div class="mb-16">
          <label class="font-weight-600 color-newtral-10">Họ và tên</label>
          <p-input
            placeholder="vd. Nguyen Van A"
            type="fullname"
            validate="on"
            v-model="user.fullname"
            :input="user.fullname"
            @keyup.enter="onSignUp"
            @status="checkUsername($event)"
            :required="requiredUsername"
          />
        </div>
        <div class="mb-16">
          <label class="font-weight-600 color-newtral-10"
            >Số điện thoại / Email</label
          >
          <p-input
            placeholder="Nhập số điện thoại hoặc email"
            :type="type"
            validate="on"
            ref="email"
            v-model="user.email"
            :input="user.email.trim()"
            @status="checkEmail($event)"
            @keyup.enter="onSignUp"
            :required="requiredEmail"
          />
        </div>
        <div class="mb-16">
          <label class="font-weight-600 color-newtral-10">Mật khẩu</label>
          <p-input
            placeholder="Nhập mật khẩu của bạn"
            hiddenPass="on"
            type="password"
            validate="on"
            v-model="user.password"
            :input="user.password"
            @keyup.enter="onSignUp"
            :required="requiredPassword"
            @status="checkPassword($event)"
          />
        </div>
        <div class="captcha mb-16">
          <vue-recaptcha
            ref="recapcha"
            @verify="onVerify"
            :sitekey="`${recapchaKey}`"
            :loadRecaptchaScript="true"
            @expired="onCaptchaExpired"
          >
          </vue-recaptcha>
          <span class="invalid-error" v-if="check == false">
            Please check the captcha
          </span>
        </div>
        <div class="police mb-16">
          <span class="police__text">
            Khi nhấn nút <b> Đăng ký</b>, bạn đã đồng ý thực hiện mọi giao dịch
            mua bán theo

            <a class="police__text-link" href="/"
              >Điều kiện sử dụng & chính sách</a
            >
            của ANANBAY.
          </span>
        </div>
        <p-button
          class="btn btn-special mb-16"
          :loading="isLoading"
          @click="onSignUp"
          :type="`java-blue`"
        >
          Đăng ký
        </p-button>
      </form>

      <p class="mb-80">
        Bạn đã có tài khoản?
        <router-link :to="{ name: 'sign-in' }" class="creatAcount"
          >Đăng nhập</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Storage from '@core/helpers/storage'
import VueRecaptcha from 'vue-recaptcha'
export default {
  components: { VueRecaptcha },

  computed: {
    recapchaKey() {
      return `${process.env.VUE_APP_RECAPCHA_KEY}`
    },
  },

  data() {
    return {
      form: {
        checkCaptcha: false,
      },
      type: 'emailornumber',
      check: true,
      user: {
        fullname: '',
        email: '',
        password: '',
      },
      isLoading: false,
      result: { success: true, message: 'Some thing wrong' },
      requiredEmail: false,
      requiredPassword: false,
      requiredUsername: false,
      correctEmail: false,
      correctPassword: false,
      correctUsername: false,
    }
  },

  methods: {
    ...mapActions('auth', ['signUp']),

    checkEmail(e) {
      if (e) {
        return (this.correctEmail = true)
      }
      return (this.correctEmail = false)
    },
    checkUsername(e) {
      if (e) {
        return (this.correctUsername = true)
      }
      return (this.correctUsername = false)
    },
    checkPassword(e) {
      if (e) {
        return (this.correctPassword = true)
      }
      return (this.correctPassword = false)
    },

    checkRequired() {
      let result = true
      if (this.user.fullname == '') {
        this.requiredUsername = true
        result = false
      } else {
        this.requiredUsername = false
      }

      if (this.user.password == '') {
        this.requiredPassword = true
        result = false
      } else {
        this.requiredPassword = false
      }

      if (this.user.email == '') {
        this.requiredEmail = true
        result = false
      } else {
        this.requiredEmail = false
      }

      return result
    },

    onVerify: function (response) {
      if (response) this.form.checkCaptcha = true
      this.check = true
    },
    onCaptchaExpired: function () {
      this.form.checkCaptcha = false
    },

    async onSignUp() {
      if (!this.checkRequired()) {
        return
      }
      if (
        this.correctEmail == false ||
        this.correctUsername == false ||
        this.correctPassword == false
      ) {
        return
      }

      if (this.form.checkCaptcha == false) {
        this.check = false
        return
      }
      const data = {
        full_name: this.user.fullname.trim(),
        email: this.user.email.trim().toLowerCase(),
        password: this.user.password,
      }

      this.isLoading = true
      this.result = await this.signUp({ user: data })
      setTimeout(() => {
        this.isLoading = false
      }, 1000)

      if (this.result.success) {
        Storage.set('userEmail', this.user.email)
        Storage.set('expried', null)
        setTimeout(() => {
          this.$router.push({
            name: 'sign-in',
          })
          this.$toast.open({
            type: 'success',
            message: 'Đăng ký thành công',
            duration: 3000,
          })
        }, 2000)
        return
      }
      this.$refs.recapcha.reset()
      this.form.checkCaptcha = false
      this.$toast.open({
        type: 'error',
        message: this.result.errors
          ? this.result.errors.join(',')
          : this.result.error,
        duration: 3000,
      })
    },
    onQueryChange() {
      this.checkRequired()
    },
  },
}
</script>
