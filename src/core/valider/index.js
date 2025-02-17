import * as yup from 'yup'

const valider = {
  errors: {},
  shape: null,
  value: null,

  schema(cb) {
    valider.shape = yup.object().shape(cb(yup))
    return valider
  },

  check(form) {
    valider.errors = {}

    if (valider.shape == null) return true

    try {
      valider.value = valider.shape.validateSync(form, { abortEarly: false })
      return true
    } catch (error) {
      for (const err of error.inner) {
        valider.errors[err.path] = err.message
      }

      return false
    }
  },

  hasError(key) {
    if (!valider.errors) return false
    return !!valider.errors[key]
  },

  error(key) {
    if (!valider.errors) return ''
    return valider.errors[key] || ''
  },

  reset() {
    valider.value = null
    valider.errors = {}
  },
}

export { yup }
export default valider
