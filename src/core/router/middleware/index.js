import beforeEach from './before-each'
import afterEach from './after-each'

const middleware = (router, store) => {
  beforeEach(router, store)
  afterEach(router)
}

export default middleware
