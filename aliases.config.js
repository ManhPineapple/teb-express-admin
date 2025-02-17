const path = require('path')
const aliases = {
  '@core': 'src/core',
  '@layouts': 'src/components/layouts',
  '@kit': 'src/kit',
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@': 'src',
}

module.exports = {
  webpack: {},
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
}

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
