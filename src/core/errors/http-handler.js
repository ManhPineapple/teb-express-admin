import EventBus from '@core/helpers/event'
import { HTTP_STATUS_TOKEN_EXPIRED } from '@core/constants/http'
import { TOKEN_EXPIRED } from '@core/constants/event'
import AuthService from '@core/services/auth'
// import ShopService from '@core/services/shop'

class HttpErrorHandler {
  static handle(response) {
    const path = encodeURIComponent(
      window.location.href.replace(window.location.origin, '')
    )
    // const shop_id = ShopService.getId()
    if (response.status === HTTP_STATUS_TOKEN_EXPIRED) {
      EventBus.$emit(TOKEN_EXPIRED)
      if (AuthService.isAuthenticated()) {
        window.localStorage.clear()
        window.location.replace(
          `/sign-in?type=error&message=Phiên làm việc của bạn đã hết hạn !&path=${path}`
        )
      }
    }
  }
}

export default HttpErrorHandler
