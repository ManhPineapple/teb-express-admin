const modulesCache = {}
let routeData = []

;(function updateModules() {
  const requireModule = require.context('../../packages', true, /routes.js$/)
  // For every routes module...
  requireModule.keys().forEach((fileName) => {
    const definition = requireModule(fileName)

    // Skip the module during hot reload if it refers to the
    // same module definition as the one we have cached.
    if (
      !definition ||
      !definition.routes ||
      !Array.isArray(definition.routes) ||
      modulesCache[fileName] === definition
    ) {
      return
    }

    routeData = routeData.concat(...definition.routes)
  })
})()

export default routeData
