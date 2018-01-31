const debug = require('debug')('mh:Config:test')
const { Config, ConfigException } = require('../../')


debug('setup config')
const config = new Config({
  path: [ __dirname, '..', '..' ], // base path for the app
  defaults: {
    name: 'Forms',
    app: {
      port: {
        http: 5151
      }
    },
    db: {
      database: 'forms',
      username: 'dev',
      password: 'dev',
      dialect: 'mysql',
    }
  }
})
debug('config name', config.get('name'))

module.exports = config
