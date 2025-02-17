import Affiliate from '@core/helpers/affiliate'

const afterEach = (router) => {
  router.afterEach(async (to) => {
    if (to.query.ref) {
      Affiliate.setRef(to.query.ref)
    }
  })
}

export default afterEach
